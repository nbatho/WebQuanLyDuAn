# API theo trang (frontend ↔ backend)

Base URL: `/api/v1` (đã căn chỉnh `beApi` + mount Express có dấu `/`).

## Chung (mọi trang sau đăng nhập)

| Nhu cầu | Endpoint | Ghi chú |
|--------|----------|---------|
| JWT | Header `Authorization: Bearer <accessToken>` | Lưu `accessToken` (localStorage) sau đăng nhập |

## Theo route

### `/`, landing

- **API:** không bắt buộc (tĩnh / marketing).

### `/login`, `/register`

- **POST** `/api/v1/auth/signin` — email, password.
- **POST** `/api/v1/auth/signup` — email, password, username, name.
- **POST** `/api/v1/auth/signout` — khi triển khai đầy đủ.

### `/google-login`

- **Phụ thuộc** flow OAuth backend (endpoint cụ thể cần khớp controller).

### `/workspace-setup`, `/workspace-branding`, `/invite-team`

- **Workspaces:** **POST** `/api/v1/workspaces` (tạo), **GET** `/api/v1/workspaces` (danh sách).
- **Spaces (khi gắn workspace):** **GET** `/api/v1/spaces/workspaces/:workspaceId/spaces`, **POST** `/api/v1/spaces/workspaces/:workspaceId/spaces`.
- **Thành viên:** **GET** `/api/v1/workspaces/:workspaceId/members` (mời/roles tùy nghiệp vụ).

### Layout (sidebar) — workspace switcher + tạo workspace

- **GET** `/api/v1/workspaces` — danh sách workspace của user (đã dùng `fetchWorkspaces` khi có token).
- **POST** `/api/v1/workspaces` — tạo workspace (`name`, `slug`, `description`).
- **Spaces trong sidebar (mock hiện tại):** sau này nên thay mock bằng **GET** `/api/v1/spaces/workspaces/:currentWorkspaceId/spaces`.

### `/home`

- **User:** **GET** `/api/v1/user/me` (hoặc route user tương đương trong backend).
- **Tóm tắt dashboard (tuỳ PM):** workspaces, spaces, tasks gần đây, notifications — **GET** `/api/v1/notifications`, v.v. khi có.

### `/inbox`

- **GET** `/api/v1/notifications` (hoặc inbox chuyên biệt nếu backend tách).

### `/my-tasks`

- **Tasks theo user:** hiện chưa có endpoint tổng hợp rõ trên FE; cần **GET** tasks filter `assignee` / `created_by` (backend mở rộng) hoặc **GET** `/api/v1/tasks` với query.
- **Spaces (hiển thị tên):** join với **GET** `/api/v1/spaces/:spaceId` hoặc list spaces theo workspace.

### `/space/:spaceId` (Space view — list/board)

- **GET** tasks theo space: model có `findAllTasksBySpaceId` — cần route **GET** `/api/v1/tasks/...` khớp controller (hiện controller có thể stub).
- **POST/PATCH/DELETE** task — CRUD tasks + quan hệ `parent_task_id` (thay bảng `subtasks` khi DB chuyển).
- **Space metadata:** **GET** `/api/v1/spaces/:spaceId`.

### `/time-tracking`, `/dashboards`

- **Time:** endpoint time logs (nếu backend có module riêng).
- **Dashboards:** tổng hợp tasks/milestones/sprints — **GET** `/api/v1/milestones`, **GET** `/api/v1/sprints`, tasks, v.v.

### `/settings`

- **GET/PATCH** user profile — `/api/v1/user/...`.
- **Workspaces:** **PUT** `/api/v1/workspaces/:id`, **DELETE** `/api/v1/workspaces/:id` (khi có UI).

---

## Ghi chú tích hợp

1. **Axios `beApi`** trả về **body** (interceptor), không phải `AxiosResponse` — thunk Redux đã cast `unknown` cho TypeScript.
2. **Slug workspace** phải khớp regex backend: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
3. **Tasks:** mock FE dùng `parent_task_id`; DB/backend có thể vẫn dùng bảng `subtasks` — cần migration/align sau.
