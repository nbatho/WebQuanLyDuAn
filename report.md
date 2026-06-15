# 📊 BÁO CÁO REVIEW DỰ ÁN FLOWISE

> **Ngày review:** 15/06/2026  
> **Phạm vi:** Toàn bộ codebase Backend (Node.js/Express) + Frontend (React/Vite/TypeScript)  
> **Mục tiêu:** Tìm code thừa, logic phức tạp hóa không cần thiết, và các vấn đề cần cải thiện

---

## 📋 Tổng quan

Dự án có kiến trúc tổng thể **hợp lý**: Backend Express MVC, Frontend React + Redux Toolkit + TypeScript. Tuy nhiên sau khi đọc kỹ toàn bộ codebase, tôi phát hiện **10 vấn đề** chia thành 3 nhóm:

| Nhóm | Số lượng | Mô tả |
|------|----------|-------|
| 🔴 **Code thừa / Dead code** | 4 | Code cài nhưng không dùng, file rỗng, hàm không gọi |
| 🟡 **Logic phức tạp hóa** | 4 | Viết phức tạp hơn mức cần thiết, hoặc duplicate không cần thiết |
| 🟢 **Thiết kế cần cải thiện** | 2 | Hoạt động đúng nhưng có thể gây vấn đề khi mở rộng |

---

# 🔴 PHẦN 1: CODE THỪA / DEAD CODE

## 1.1 — 6 Dependencies cài nhưng KHÔNG import ở bất kỳ đâu

**File:** `backend/package.json`

| Thư viện | Dùng chưa? | Ghi chú |
|----------|-----------|---------|
| `groq-sdk` | ✅ Có dùng | Dùng trong `aiController.js` |
| `@google/generative-ai` | ❌ **Không dùng** | Không import ở file nào |
| `openai` | ❌ **Không dùng** | Không import ở file nào |
| `@openrouter/sdk` | ❌ **Không dùng** | Không import ở file nào |
| `swagger-jsdoc` | ❌ **Không dùng** | Không có file cấu hình Swagger |
| `swagger-ui-express` | ❌ **Không dùng** | Không mount Swagger UI |

**Tác hại:** ~3MB+ thư viện thừa trong `node_modules`, tăng thời gian `npm install`, tăng attack surface.

**Cách sửa:**
```bash
cd backend
npm uninstall @google/generative-ai openai @openrouter/sdk swagger-jsdoc swagger-ui-express
```

---

## 1.2 — Hàm `changePassword` bị thừa (đã có flow OTP thay thế)

**File:** `backend/src/controllers/userControllers.js` (dòng 65-99)

Hệ thống có **2 flow đổi mật khẩu** cùng tồn tại:

| Flow | Hàm | Cách hoạt động |
|------|-----|----------------|
| Flow cũ | `changePassword()` | Nhập mật khẩu cũ → đổi luôn (không OTP) |
| Flow mới | `requestPasswordChangeOtp()` + `verifyAndChangePassword()` | Nhập mật khẩu cũ → gửi OTP email → xác thực OTP → đổi |

Flow cũ `changePassword()` **ít bảo mật hơn** và có vẻ là phiên bản cũ trước khi thêm OTP. Nếu đã bắt buộc dùng OTP thì hàm cũ nên gỡ bỏ để tránh confusion.

---

## 1.3 — File rác và file rỗng

| File | Vấn đề |
|------|--------|
| `read_pdf.py` (ở root) | Script Python extract text từ PDF — **không liên quan** đến dự án web. File debug cá nhân quên xóa |
| `frontend/src/hooks/useSpaceTasks.ts` | File **hoàn toàn rỗng** (0 bytes). Không export gì, không ai import |
| `backend/src/models/Dashboard.js` | Chứa 4 hàm query (`getKanbanTasks`, `getUserTaskSummary`, `getSpaceOverview`, `getWorkspaceOverview`) nhưng **không có controller hay route nào gọi đến** — dead code |

---

## 1.4 — Hàm `RemoveMember` rỗng

**File:** `backend/src/controllers/memberController.js` (dòng 169)

```javascript
export const RemoveMember = async (req, res) => { }
```

Hàm export nhưng **body rỗng**, không làm gì cả. Nếu chưa cần thì nên xóa, nếu cần thì implement.

---

## 1.5 — Import thừa

**File:** `backend/src/controllers/memberController.js` (dòng 2-3)

```javascript
import express from "express";     // ❌ Không dùng express ở đây
import dotenv from "dotenv";       // ❌ Không gọi dotenv.config()
```

Hai import này không phục vụ gì trong file controller.

---

## 1.6 — `console.log` debug quên xóa

**File:** `backend/src/controllers/memberController.js` (dòng 152)

```javascript
console.log(invitation);  // ❌ Debug log quên xóa
```

---

# 🟡 PHẦN 2: LOGIC PHỨC TẠP HÓA KHÔNG CẦN THIẾT

## 2.1 — getTasksByListId và getTasksBySprintId: Copy-paste 120 dòng

**File:** `backend/src/controllers/taskController.js`

Hai hàm `getTasksByListId` (dòng 40-104) và `getTasksBySprintId` (dòng 106-170) có **code giống nhau 95%**. Toàn bộ logic nhóm task theo status, xử lý orphaned tasks, format response **y hệt nhau**, chỉ khác 2 dòng fetch data:

```javascript
// getTasksByListId — chỉ khác 2 dòng này:
const statuses = await findStatusesByListId(listId);
const rawTasks = await findAllTasksByListId(listId);

// getTasksBySprintId — tương tự:
const statuses = await findStatusesBySprintId(sprintId);
const rawTasks = await findAllTasksBySprintId(sprintId);

// Phần còn lại: GIỐNG HỆT NHAU (~60 dòng mỗi hàm)
```

**Cách sửa đơn giản:**

```javascript
// Tạo helper function dùng chung
function groupTasksByStatus(statuses, rawTasks) {
    const groupedTaskIds = new Set();
    const groupedData = statuses.map((status) => {
        const tasksInStatus = rawTasks
            .filter(task => Number(task.status_id) === Number(status.status_id))
            .map(task => {
                groupedTaskIds.add(task.task_id);
                return {
                    ...task,
                    assignees: task.assignees || [],
                    subtask_count: 0,
                    subtask_done_count: 0,
                    comment_count: Number(task.comment_count) || 0,
                    attachment_count: Number(task.attachment_count) || 0,
                };
            });
        return {
            id: status.status_id,
            name: status.status_name,
            color: status.color || '#d3d3d3',
            isExpanded: true,
            tasks: tasksInStatus
        };
    });
    // Orphaned tasks
    const orphanedTasks = rawTasks
        .filter(task => !groupedTaskIds.has(task.task_id))
        .map(task => ({ ...task, assignees: task.assignees || [], ... }));
    if (orphanedTasks.length > 0) {
        groupedData.push({ id: 0, name: 'No Status', color: '#9ca3af', isExpanded: true, tasks: orphanedTasks });
    }
    return groupedData;
}

// Sử dụng:
export const getTasksByListId = async (req, res) => {
    const statuses = await findStatusesByListId(listId);
    const rawTasks = await findAllTasksByListId(listId);
    res.status(200).json(groupTasksByStatus(statuses, rawTasks));
};
```

Từ **120 dòng duplicate → ~10 dòng mỗi hàm** + 1 helper dùng chung.

---

## 2.2 — Hệ thống resolve spaceId bị viết LẠI 2 lần ở 2 middleware

Dự án có 2 middleware phân quyền, **CẢ HAI** đều phải tìm `spaceId` từ URL params, nhưng viết logic hoàn toàn riêng biệt:

### Middleware 1: `roleMiddlewares.js` — Dùng bảng lookup + model functions (sạch)

```javascript
const PARAM_TO_SPACE_LOOKUP = [
    { param: 'taskId',   fn: getSpaceIdByTaskId,   notFoundMsg: '...' },
    { param: 'listId',   fn: getSpaceIdByListId,   notFoundMsg: '...' },
    // ... 11 entries, gọi model functions
];

async function resolveSpaceIdFromParams(params) {
    for (const { param, fn, notFoundMsg } of PARAM_TO_SPACE_LOOKUP) {
        if (!params[param]) continue;
        const spaceId = await fn(params[param]);
        // ...
    }
}
```

### Middleware 2: `membershipMiddleware.js` — Viết SQL thẳng (duplicate)

```javascript
// Viết lại từ đầu, SQL inline
if (!spaceId && req.params.taskId) {
    const result = await con.query(
        `SELECT l.space_id FROM tasks t 
         JOIN lists l ON t.list_id = l.list_id 
         WHERE t.task_id = $1 AND t.deleted_at IS NULL`,
        [req.params.taskId]
    );
    spaceId = result.rows[0]?.space_id;
}
// Lặp lại cho listId, sprintId...
```

**Vấn đề:**
- Cùng 1 việc (tìm spaceId từ taskId/listId) được code **2 lần** với 2 phong cách khác nhau
- Khi thêm entity mới (ví dụ: `tagId`), phải nhớ update **CẢ HAI** file
- `membershipMiddleware` chỉ xử lý 3 params (taskId, listId, sprintId) trong khi `roleMiddlewares` xử lý 11 params — **không đồng bộ**

**Cách sửa:** Tách hàm `resolveSpaceId` thành utility dùng chung:

```javascript
// utils/resolveSpace.js
export async function resolveSpaceId(params) {
    // Dùng bảng lookup đã có sẵn trong roleMiddlewares
    // Cả 2 middleware đều gọi hàm này
}
```

---

## 2.3 — AI Controller viết lại business logic từ đầu thay vì gọi model

**File:** `backend/src/controllers/aiController.js` (632 dòng)

File này là ví dụ điển hình của **phức tạp hóa không cần thiết**. Khi AI cần tạo Space, thay vì gọi model function `createSpaces()` đã có sẵn, nó **viết lại toàn bộ SQL từ đầu**:

### Cách dự án đang làm (phức tạp, duplicate):

```javascript
// aiController.js — Tạo Space bằng raw SQL (80+ dòng)
const dbClient = await con.connect();
await dbClient.query('BEGIN');

const spaceInsert = await dbClient.query(
    "INSERT INTO spaces (workspace_id, name, description) VALUES ($1, $2, $3) RETURNING space_id",
    [workspaceId, functionArgs.name, functionArgs.description || ""]
);
const newSpaceId = spaceInsert.rows[0].space_id;

await dbClient.query(
    "INSERT INTO space_members (space_id, user_id) VALUES ($1, $2) ON CONFLICT ...",
    [newSpaceId, userId]
);

await dbClient.query(
    `INSERT INTO task_status ... VALUES ($1, 'TO DO', ...), ($1, 'IN PROGRESS', ...), ($1, 'COMPLETE', ...)`,
    [newSpaceId]
);

await dbClient.query(
    "INSERT INTO lists (space_id, name, created_by) VALUES ($1, $2, $3)",
    [newSpaceId, 'General', userId]
);

await dbClient.query('COMMIT');
```

### Cách đơn giản (gọi model đã có sẵn):

```javascript
// Chỉ cần 1 dòng — model Spaces.js đã handle tất cả
import { createSpaces } from '../models/Spaces.js';
const newSpace = await createSpaces(name, description, workspaceId, false);
```

**Hậu quả của việc duplicate:**
- Logic tạo Space tồn tại ở **2 nơi** (model + AI controller) — sửa 1 quên sửa kia sẽ gây bug
- AI controller **bypass phân quyền RBAC** — Member có thể tạo Space qua AI dù không có quyền `SPACE_CREATE`
- Tương tự với logic tạo Task trong AI controller (dòng 316-416)

---

## 2.4 — `taskFamily.ts` — Over-engineering cho tính năng subtask CHƯA TỒN TẠI

**File:** `frontend/src/utils/taskFamily.ts` + `frontend/src/hooks/useTaskFilters.ts`

File `taskFamily.ts` xây dựng hệ thống **đệ quy** để xử lý cây parent-child subtask:

```javascript
// Đệ quy tìm tất cả con cháu
export function descendantTaskIds(tasks, parentTaskId) {
    const direct = tasks.filter(t => t.parent_task_id === parentTaskId).map(t => t.task_id);
    return direct.flatMap(id => [id, ...descendantTaskIds(tasks, id)]);
}
// + familyTaskIds, rootTasks, directChildTasks, directChildCount, visibleRootsWithFamily
```

**Nhưng:** Nhìn vào `Task.js` model và `taskController.js`, **dự án KHÔNG có tính năng subtask**:
- Bảng `tasks` không có cột `parent_task_id` trong các query hiện tại
- Comment trong taskController: `// subtasks controller removed`
- Hardcode `subtask_count: 0, subtask_done_count: 0` ở mọi nơi

Toàn bộ `taskFamily.ts` (36 dòng) + phần filter phức tạp trong `useTaskFilters.ts` về family/root **xử lý tính năng không tồn tại**.

**Cách sửa:** Xóa `taskFamily.ts` và đơn giản hóa `useTaskFilters.ts`:

```javascript
// Thay vì gọi visibleRootsWithFamily → familyTaskIds (đệ quy phức tạp)
// Chỉ cần filter đơn giản:
const filteredGroups = groups.map(g => ({
    ...g,
    tasks: g.tasks.filter(t => matches(t))
}));
```

---

## 2.5 — `useSpaceViewState` hook: Gom quá nhiều state không liên quan

**File:** `frontend/src/hooks/useSpaceViewState.ts`

Hook này gom **9 state** + **1 handler** vào 1 chỗ:

```javascript
export function useSpaceViewState(spaceId, listParam, folderParam) {
    const [activeView, setActiveView] = useState('overview');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [ctxMenu, setCtxMenu] = useState(null);
    const [groupBy, setGroupBy] = useState('status');
    const [subtaskMode, setSubtaskMode] = useState('collapsed');  // ❌ Subtask không tồn tại
    const [showClosed, setShowClosed] = useState(true);
    const [columns, setColumns] = useState({ assignee: true, dueDate: true, priority: true });
    // ...
}
```

**Vấn đề:**
- `subtaskMode` — quản lý tính năng **không tồn tại** (subtask đã bị remove)
- Gom context menu state (`ctxMenu`), view state (`activeView`), filter state (`groupBy`, `showClosed`), UI state (`columns`) vào 1 hook — khiến bất kỳ thay đổi nào cũng re-render tất cả
- Đây chỉ là `useState` wrapper đơn thuần, không có logic phức tạp nào để justify tạo custom hook

**Nếu giữ hook:** Ít nhất nên tách `subtaskMode` ra vì không dùng.

---

## 2.6 — `ensureMessagingTables()` — Chạy migration MỖI LẦN server start

**File:** `backend/src/models/Messages.js` (dòng 7-51) + `server.js` (dòng 101)

```javascript
// server.js — Gọi mỗi khi start
app.listen(PORT, HOST, () => {
    ensureMessagingTables();  // CREATE TABLE IF NOT EXISTS ... + ALTER TABLE ...
});
```

Hàm này chạy **6 câu SQL DDL** (CREATE TABLE, ALTER TABLE, CREATE INDEX) **mỗi lần server khởi động**, kể cả khi bảng đã tồn tại từ lâu.

**Vấn đề:**
- Dự án **đã có** thư mục `backend/src/config/migrations/` với file `001_authorization_setup.sql` — tức đã có hệ thống migration
- Nhưng messaging tables lại **tự tạo runtime** thay vì dùng migration
- 2 cơ chế khác nhau để quản lý schema → confusion

**Cách sửa:** Chuyển SQL trong `ensureMessagingTables()` vào file migration `002_messaging_tables.sql`, rồi xóa hàm và lời gọi trong `server.js`.

---

# 🟢 PHẦN 3: THIẾT KẾ CẦN CẢI THIỆN

## 3.1 — OTP lưu trong bộ nhớ RAM (In-Memory Map)

**File:** `backend/src/controllers/userControllers.js` (dòng 14)

```javascript
const otpStore = new Map();  // Mất hết khi server restart
```

**Rủi ro:**
- **Mất hết OTP** khi server restart (nodemon, deploy, crash)
- **Không hoạt động** nếu chạy nhiều instance (load balancer)
- **Memory leak** — OTP hết hạn nhưng không có cơ chế tự động dọn (chỉ xóa khi user verify hoặc request mới)

**Cách sửa nhanh (không thay đổi kiến trúc):**
```javascript
// Thêm cleanup định kỳ
setInterval(() => {
    const now = Date.now();
    for (const [key, val] of otpStore) {
        if (now > val.expiresAt) otpStore.delete(key);
    }
}, 5 * 60 * 1000); // mỗi 5 phút
```

**Cách sửa đúng:** Lưu vào bảng PostgreSQL (đã có sẵn kết nối DB).

---

## 3.2 — Error messages Backend: Hỗn loạn 3 ngôn ngữ

Backend trộn lẫn **3 kiểu** message trong cùng codebase:

```javascript
// Kiểu 1: Tiếng Việt KHÔNG DẤU (authControllers.js)
"Khong the thieu username, password, email hoac name"
"Dang ky thanh cong"
"Sai email hoac password"

// Kiểu 2: Tiếng Việt CÓ DẤU (userControllers.js, memberController.js)
"Vui lòng nhập đầy đủ mật khẩu hiện tại"
"Mật khẩu mới phải có ít nhất 6 ký tự"

// Kiểu 3: Tiếng Anh (taskController.js, spaceController.js)
"Task ID is required"
"Space not found"
"Failed to retrieve spaces"
```

Frontend đã setup i18n (Việt + Anh) nhưng backend trả message hardcode 3 kiểu → trải nghiệm không nhất quán.

**Cách sửa lý tưởng:** Backend chỉ trả error code, frontend hiển thị message theo i18n.

---

## 3.3 — Frontend có 15 Redux modules — có thể gộp bớt

**File:** `frontend/src/store/rootReducer.ts`

| Module hiện tại | Có thể gộp vào | Lý do |
|----------------|----------------|-------|
| `comments` | `tasks` | Comments là sub-resource của task |
| `tree` | `spaces` | Tree quản lý folder/list — thuộc về spaces |
| `timelogs` | `tasks` | Time logs gắn liền với task |
| `activityLogs` | `tasks` | Activity logs gắn liền với task |

Ngoài ra: `api/messages/` có API layer nhưng **không có Redux module** — chưa rõ state messaging quản lý ở đâu.

---

# 📈 TÓM TẮT & ƯU TIÊN HÀNH ĐỘNG

| # | Vấn đề | Loại | Effort | Ưu tiên |
|---|--------|------|--------|---------|
| 1.1 | Gỡ 6 dependencies không dùng | 🔴 Dead code | ⚡ 5 phút | **Làm ngay** |
| 1.2 | Xóa hàm `changePassword` cũ | 🔴 Dead code | ⚡ 5 phút | **Làm ngay** |
| 1.3 | Xóa file rác (`read_pdf.py`, hook rỗng, Dashboard.js) | 🔴 Dead code | ⚡ 5 phút | **Làm ngay** |
| 1.4 | Xóa `RemoveMember` rỗng + import thừa + console.log | 🔴 Dead code | ⚡ 5 phút | **Làm ngay** |
| 2.1 | Extract `groupTasksByStatus` helper | 🟡 Duplicate | 🕐 30 phút | Nên làm |
| 2.2 | Hợp nhất resolve spaceId logic | 🟡 Duplicate | 🕐 2 giờ | Nên làm |
| 2.3 | AI Controller gọi model thay vì raw SQL | 🟡 Phức tạp hóa | 🕐 3 giờ | Nên làm |
| 2.4 | Xóa `taskFamily.ts` + đơn giản hóa filter | 🟡 Over-engineering | ⚡ 30 phút | Nên làm |
| 2.5 | Xóa `subtaskMode` khỏi useSpaceViewState | 🟡 Code thừa | ⚡ 10 phút | Nên làm |
| 2.6 | Chuyển messaging tables vào migration | 🟡 Phức tạp hóa | 🕐 30 phút | Nên làm |
| 3.1 | OTP in-memory → thêm cleanup hoặc dùng DB | 🟢 Thiết kế | 🕐 1-2 giờ | Khi deploy production |
| 3.2 | Chuẩn hóa error messages | 🟢 Thiết kế | 🕐 2 giờ | Khi rảnh |
| 3.3 | Gộp Redux modules | 🟢 Thiết kế | 🕐 3 giờ | Khi rảnh |

---

# ✅ NHỮNG ĐIỂM LÀM TỐT

Công bằng mà nói, dự án có nhiều điểm rất chất lượng:

- ✅ **Error handling tập trung** — `AppError` class + `globalErrorHandler` xử lý PostgreSQL, JWT, Multer errors rất chuyên nghiệp
- ✅ **Rate limiting đa tầng** — 7 limiter khác nhau cho login, signup, OTP, AI, invite
- ✅ **RBAC database-driven** — Phân quyền dựa trên DB (role → role_permissions → permissions), không hardcode
- ✅ **Soft delete pattern** nhất quán — Tất cả entity dùng `deleted_at`
- ✅ **Activity logging** — Tự động ghi log cho mọi thay đổi task
- ✅ **BASE_TASK_SELECT** constant trong Task model — Tránh duplicate SQL
- ✅ **Frontend error pipeline** — `ApiError` class + `callApi.ts` interceptors + `errorUtils.ts` tạo hệ thống xử lý lỗi FE-BE nhất quán
- ✅ **TypeScript** nghiêm ngặt với type definitions riêng
- ✅ **i18n** đã setup sẵn cho frontend (vi/en)
- ✅ **Transaction pattern** — Dùng đúng BEGIN/COMMIT/ROLLBACK cho các thao tác multi-step
