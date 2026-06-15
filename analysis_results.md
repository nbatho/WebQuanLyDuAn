# 📊 Báo cáo Review Dự Án Flowise — Quản Lý Dự Án

> **Ngày review:** 15/06/2026
> **Phạm vi:** Toàn bộ codebase Backend (Node.js/Express) + Frontend (React/Vite/TypeScript)

---

## 📋 Tổng quan đánh giá

Dự án Flowise có kiến trúc tổng thể **hợp lý và rõ ràng**: phân tách MVC ở backend, sử dụng Redux Toolkit + TypeScript ở frontend. Tuy nhiên, sau khi phân tích chi tiết, tôi phát hiện **6 vấn đề chính** liên quan đến sự phức tạp hóa, code thừa, và thiết kế không cần thiết.

| Mức độ | Số lượng | Ý nghĩa |
|--------|----------|---------|
| 🔴 Nghiêm trọng | 2 | Ảnh hưởng trực tiếp đến hoạt động / bảo mật |
| 🟡 Quan trọng | 3 | Tăng độ phức tạp, giảm khả năng bảo trì |
| 🟢 Nhỏ | 3 | Code thừa, không ảnh hưởng chức năng |

---

## 🔴 Vấn đề 1: Dependencies Backend thừa — 4 thư viện cài nhưng KHÔNG dùng

**File:** [package.json](file:///d:/Project/WebQuanLyDuAn/backend/package.json)

Backend cài đặt **4 thư viện AI/API nhưng chỉ dùng 1** (Groq SDK):

| Thư viện | Kích thước | Sử dụng thực tế |
|----------|------------|-----------------|
| `groq-sdk` | — | ✅ Dùng trong [aiController.js](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/aiController.js) |
| `@google/generative-ai` | ~200KB | ❌ **Không import ở bất kỳ file nào** |
| `openai` | ~500KB | ❌ **Không import ở bất kỳ file nào** |
| `@openrouter/sdk` | ~100KB | ❌ **Không import ở bất kỳ file nào** |
| `swagger-jsdoc` | ~150KB | ❌ **Không import, không cấu hình Swagger** |
| `swagger-ui-express` | ~2MB | ❌ **Không import, không cấu hình Swagger** |

> [!WARNING]
> 6 dependencies thừa chiếm ~3MB+ trong `node_modules`, tăng thời gian cài đặt, tăng attack surface (đặc biệt `openai` có rất nhiều transitive deps). Swagger được cài nhưng không hề setup — nếu không dùng thì nên gỡ bỏ.

### Đề xuất
```bash
npm uninstall @google/generative-ai openai @openrouter/sdk swagger-jsdoc swagger-ui-express
```

---

## 🔴 Vấn đề 2: OTP lưu trong bộ nhớ (In-Memory) — Mất dữ liệu khi restart

**File:** [userControllers.js](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/userControllers.js#L14-L16)

```javascript
// In-memory OTP store: Map<user_id, { otp, newPasswordHash, expiresAt, attempts }>
const otpStore = new Map();
```

OTP cho đổi mật khẩu được lưu trong `Map()` JavaScript — tức là **hoàn toàn nằm trên RAM**:

- ❌ **Mất hết OTP** khi server restart (nodemon, deploy, crash)
- ❌ **Không hoạt động** nếu scale nhiều instance (load balancer)
- ❌ **Memory leak tiềm ẩn** — OTP hết hạn nhưng không có cơ chế cleanup tự động (chỉ xóa khi user gọi verify)

> [!CAUTION]
> Nếu 1000 user request OTP nhưng không bao giờ verify, `otpStore` sẽ giữ 1000 entry mãi mãi cho đến khi server restart.

### Đề xuất
Tạo bảng `password_otp` trong PostgreSQL (đã có sẵn kết nối), hoặc dùng hàm cleanup định kỳ:
```javascript
// Cleanup mỗi 5 phút
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore) {
    if (now > val.expiresAt) otpStore.delete(key);
  }
}, 5 * 60 * 1000);
```

---

## 🟡 Vấn đề 3: Logic phân quyền bị TRÙNG LẶP giữa 2 hệ thống middleware

Dự án có **2 middleware phân quyền** làm việc tương tự nhau nhưng không phối hợp:

| Middleware | File | Chức năng |
|-----------|------|-----------|
| `requirePermission` | [roleMiddlewares.js](file:///d:/Project/WebQuanLyDuAn/backend/src/middlewares/roleMiddlewares.js) | Kiểm tra quyền RBAC (role → permission) |
| `requireSpaceMembership` | [membershipMiddleware.js](file:///d:/Project/WebQuanLyDuAn/backend/src/middlewares/membershipMiddleware.js) | Kiểm tra membership (user thuộc space?) |

**Vấn đề cốt lõi:** Cả hai đều **dò ngược spaceId từ URL params** với logic gần giống nhau:

````carousel
```javascript
// roleMiddlewares.js — dùng bảng lookup
const PARAM_TO_SPACE_LOOKUP = [
    { param: 'taskId', fn: getSpaceIdByTaskId, ... },
    { param: 'listId', fn: getSpaceIdByListId, ... },
    // ... 11 entries
];
```
<!-- slide -->
```javascript
// membershipMiddleware.js — viết lại từ đầu
if (!spaceId && req.params.taskId) {
    const result = await con.query(
        `SELECT l.space_id FROM tasks t 
         JOIN lists l ON t.list_id = l.list_id 
         WHERE t.task_id = $1 ...`,
        [req.params.taskId]
    );
    spaceId = result.rows[0]?.space_id;
}
```
````

- `roleMiddlewares.js` gọi model functions từ [Permission.js](file:///d:/Project/WebQuanLyDuAn/backend/src/models/Permission.js) (dùng abstraction sạch)
- `membershipMiddleware.js` **viết SQL trực tiếp** (raw query inline) để làm y hệt
- Kết quả: **cùng 1 việc (tìm spaceId) được code 2 lần**, với 2 phong cách khác nhau

> [!IMPORTANT]
> Khi thêm entity mới (ví dụ: `tagId`), developer phải nhớ update **CẢ HAI** file middleware. Đây là nguồn bug rất phổ biến.

### Đề xuất
Hợp nhất thành 1 middleware duy nhất, hoặc tách phần "resolve spaceId" thành utility function dùng chung:
```javascript
// utils/resolveSpace.js — dùng chung cho cả 2 middleware
export async function resolveSpaceId(params) { ... }
```

---

## 🟡 Vấn đề 4: AI Controller quá "monolithic" — 632 dòng, 1 file làm tất cả

**File:** [aiController.js](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/aiController.js) — **632 dòng**

File này gộp **tất cả** vào 1 nơi:
1. **Tool definitions** (dòng 8–90) — Schema cho AI function calling
2. **Tool handlers** (dòng 96–181) — `handleListTasks`, `handleCountByStatus`, `handleFindOverdue`
3. **Main chat endpoint** (dòng 187–528) — Xử lý chat, **chứa cả business logic tạo Space và Task**
4. **AI assist endpoints** (dòng 530–632) — `generateDescription`, `suggestPriority`

Đặc biệt nghiêm trọng: **AI chat endpoint TỰ TẠO Space và Task** bằng raw SQL (dòng 268–416), **hoàn toàn bỏ qua** model layer và middleware phân quyền:

```javascript
// AI controller tạo Space trực tiếp bằng SQL — bypass mọi validation
const spaceInsert = await dbClient.query(
    "INSERT INTO spaces (workspace_id, name, description) VALUES ($1, $2, $3) ...",
    [workspaceId, functionArgs.name, functionArgs.description || ""]
);
```

So sánh với flow tạo Space qua API thông thường: `spaceRoutes → requirePermission → spaceController → Spaces.createSpaces` — AI controller **bỏ qua toàn bộ** pipeline này.

> [!WARNING]
> - Tạo Space qua AI **không kiểm tra quyền RBAC** — Member có thể tạo Space khi không có quyền `SPACE_CREATE`
> - Logic tạo Space bị viết **2 lần** (1 ở model [Spaces.js](file:///d:/Project/WebQuanLyDuAn/backend/src/models/Spaces.js), 1 ở AI controller)
> - Nếu schema database thay đổi, phải sửa ở **cả 2 nơi**

### Đề xuất
Tách AI controller thành nhiều file và reuse model layer:
```
controllers/
  ai/
    chatHandler.js         ← Main chat endpoint
    toolDefinitions.js     ← Tool schemas
    toolHandlers.js        ← list_tasks, count_tasks, etc.
    aiAssistController.js  ← generate-description, suggest-priority
```
Và gọi lại model functions thay vì viết raw SQL:
```javascript
// Thay vì raw SQL, gọi model:
import { createSpaces } from '../models/Spaces.js';
const newSpace = await createSpaces(name, description, workspaceId, false);
```

---

## 🟡 Vấn đề 5: Code trùng lặp trong Task Controller — getTasksByListId vs getTasksBySprintId

**File:** [taskController.js](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/taskController.js)

Hai hàm [getTasksByListId](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/taskController.js#L40-L104) và [getTasksBySprintId](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/taskController.js#L106-L170) có **code gần như giống hệt nhau** (copy-paste):

```diff
 // getTasksByListId (dòng 40-104)
-const statuses = await findStatusesByListId(listId);
-const rawTasks = await findAllTasksByListId(listId);
+// getTasksBySprintId (dòng 106-170)
+const statuses = await findStatusesBySprintId(sprintId);
+const rawTasks = await findAllTasksBySprintId(sprintId);

 // Phần còn lại: GIỐNG NHAU HOÀN TOÀN (~60 dòng)
 const groupedTaskIds = new Set();
 const groupedData = statuses.map((status) => {
     const tasksInStatus = rawTasks
         .filter(task => Number(task.status_id) === Number(status.status_id))
         .map(task => {
             groupedTaskIds.add(task.task_id);
             return { ...task, assignees: task.assignees || [], ... };
         });
     return { id: status.status_id, name: status.status_name, ... };
 });
 // ... orphanedTasks logic cũng giống y hệt
```

**~120 dòng code bị duplicate** vì chỉ khác 2 dòng gọi hàm fetch.

### Đề xuất
Tạo helper function:
```javascript
function groupTasksByStatus(statuses, rawTasks) {
    const groupedTaskIds = new Set();
    const groupedData = statuses.map((status) => { /* ... */ });
    // ... orphanedTasks logic
    return groupedData;
}
```

---

## 🟢 Vấn đề 6: File và code không cần thiết

### 6.1 File `read_pdf.py` ở root
**File:** [read_pdf.py](file:///d:/Project/WebQuanLyDuAn/read_pdf.py)

Script Python extract text từ PDF — **không liên quan** đến dự án web. Có thể là file debug/utility cá nhân quên xóa.

### 6.2 File `useSpaceTasks.ts` — Hoàn toàn rỗng
**File:** [useSpaceTasks.ts](file:///d:/Project/WebQuanLyDuAn/frontend/src/hooks/useSpaceTasks.ts) — **0 bytes**

File hook rỗng, không export gì. Nên xóa hoặc implement.

### 6.3 Model `Dashboard.js` không có Controller/Route tương ứng
**File:** [Dashboard.js](file:///d:/Project/WebQuanLyDuAn/backend/src/models/Dashboard.js)

Model chứa 4 hàm query (`getKanbanTasks`, `getUserTaskSummary`, `getSpaceOverview`, `getWorkspaceOverview`) nhưng **không có controller hay route nào gọi đến**. Đây có thể là code chuẩn bị cho dashboard nhưng chưa dùng.

### 6.4 Function `changePassword` bị thừa
**File:** [userControllers.js](file:///d:/Project/WebQuanLyDuAn/backend/src/controllers/userControllers.js#L65-L99)

Hàm `changePassword` (dòng 65-99) đổi mật khẩu **KHÔNG qua OTP**, trong khi hệ thống đã có flow OTP 2 bước (`requestPasswordChangeOtp` + `verifyAndChangePassword`). Cả hai flow cùng tồn tại, tạo confusion. Nếu đã bắt buộc OTP thì hàm `changePassword` cũ **nên gỡ bỏ**.

### 6.5 `ensureMessagingTables()` — Auto-migration trong runtime
**File:** [Messages.js](file:///d:/Project/WebQuanLyDuAn/backend/src/models/Messages.js#L7-L51)

```javascript
// Được gọi mỗi khi server start
app.listen(PORT, HOST, () => {
    ensureMessagingTables();  // CREATE TABLE IF NOT EXISTS ...
});
```

Hàm này tạo bảng messaging **mỗi lần server khởi động**. Cách làm này:
- ❌ Không theo chuẩn migration (dự án đã có [migrations/](file:///d:/Project/WebQuanLyDuAn/backend/src/config/migrations) folder)
- ❌ Chạy `ALTER TABLE ADD COLUMN IF NOT EXISTS` mỗi lần start — dù cột đã tồn tại
- ❌ Trộn lẫn DDL (schema) vào model layer

Nên chuyển vào file migration [001_authorization_setup.sql](file:///d:/Project/WebQuanLyDuAn/backend/src/config/migrations/001_authorization_setup.sql) hoặc tạo migration mới.

---

## 🟢 Vấn đề 7: Redux Store có module `comments` nhưng thiếu `messages`

**File:** [rootReducer.ts](file:///d:/Project/WebQuanLyDuAn/frontend/src/store/rootReducer.ts)

| Store Module | API Layer | Nhận xét |
|-------------|-----------|----------|
| `comments` | Có `api/comments/` | ✅ OK nhưng **comments là sub-resource của task**, có thể gộp vào `tasks` slice |
| `messages` | Có `api/messages/` | ❌ **Có API layer nhưng KHÔNG có Redux module** — messaging state quản lý ở đâu? |
| `tree` | — | 🟡 Quản lý folder/list tree riêng, có thể gộp vào `spaces` |
| `modal` | — | 🟡 Store module `modal` tồn tại nhưng không trong rootReducer — có thể là dead code |

> [!NOTE]
> 15 store modules cho 1 ứng dụng CRUD-centric là khá nhiều. Có thể gộp `comments` vào `tasks`, `tree` vào `spaces`, `timelogs` vào `tasks` để giảm boilerplate.

---

## 🟢 Vấn đề 8: i18n chưa hoàn thiện — Hệ thống 2 ngôn ngữ nhưng Backend vẫn hardcode tiếng Việt

**Frontend:** Đã setup đầy đủ i18next với vi/en

**Backend:** Tất cả error messages **hardcode tiếng Việt** lẫn lộn với tiếng Việt không dấu:

```javascript
// authControllers.js — Hỗn hợp Tiếng Việt có dấu + không dấu
"Khong the thieu username, password, email hoac name"  // không dấu 
"Phiên đăng nhập đã hết hạn"                          // có dấu
"Email khong hop le"                                    // không dấu
```

Điều này tạo trải nghiệm không nhất quán. Nên:
- Chuyển tất cả về error code (`MISSING_FIELDS`, `INVALID_EMAIL`) 
- Để frontend hiển thị message dựa trên i18n

---

## 📈 Tóm tắt & Ưu tiên hành động

| # | Vấn đề | Mức độ | Effort | Ưu tiên |
|---|--------|--------|--------|---------|
| 1 | Gỡ 6 dependencies không dùng | 🔴 | ⚡ 5 phút | **P0 — Làm ngay** |
| 2 | OTP in-memory → DB hoặc cleanup | 🔴 | 🕐 1-2 giờ | **P0 — Rủi ro production** |
| 3 | Hợp nhất resolve spaceId logic | 🟡 | 🕐 2-3 giờ | P1 |
| 4 | Tách AI controller + reuse models | 🟡 | 🕐 3-4 giờ | P1 |
| 5 | Extract groupTasksByStatus helper | 🟡 | ⚡ 30 phút | P1 |
| 6 | Dọn file rác + dead code | 🟢 | ⚡ 15 phút | P2 |
| 7 | Gộp Redux modules | 🟢 | 🕐 2-3 giờ | P3 |
| 8 | Chuẩn hóa error messages backend | 🟢 | 🕐 1-2 giờ | P3 |

---

## ✅ Những điểm làm TỐT

Dự án cũng có nhiều điểm đáng khen:

- ✅ **Error handling tập trung** — [errorMiddleware.js](file:///d:/Project/WebQuanLyDuAn/backend/src/middlewares/errorMiddleware.js) với `AppError` class, xử lý PostgreSQL errors, JWT errors, Multer errors rất chuyên nghiệp
- ✅ **Rate limiting đa tầng** — [rateLimitMiddleware.js](file:///d:/Project/WebQuanLyDuAn/backend/src/middlewares/rateLimitMiddleware.js) với 7 limiter khác nhau (login, signup, OTP, AI, invite, general)
- ✅ **RBAC database-driven** — Phân quyền dựa trên DB mapping (role → role_permissions → permissions), không hardcode
- ✅ **Soft delete pattern** nhất quán — Tất cả entity dùng `deleted_at` thay vì xóa thật
- ✅ **Activity logging** — Tự động ghi log cho mọi thay đổi task (fire-and-forget pattern)
- ✅ **Frontend error handling** — [errorUtils.ts](file:///d:/Project/WebQuanLyDuAn/frontend/src/utils/errorUtils.ts) + [callApi.ts](file:///d:/Project/WebQuanLyDuAn/frontend/src/api/callApi.ts) tạo pipeline xử lý lỗi FE-BE nhất quán
- ✅ **Task model** — [Task.js](file:///d:/Project/WebQuanLyDuAn/backend/src/models/Task.js) sử dụng `BASE_TASK_SELECT` constant để tránh lặp SQL
- ✅ **TypeScript** — Frontend sử dụng TypeScript nghiêm ngặt với type definitions riêng
- ✅ **i18n setup** — Đã chuẩn bị sẵn đa ngôn ngữ cho frontend
