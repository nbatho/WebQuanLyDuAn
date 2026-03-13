-- ==========================================================
-- MOCK DATA CHO HỆ THỐNG QUẢN LÝ CÔNG VIỆC (TTCS)
-- ==========================================================

BEGIN;

-- 1. USERS & ROLES
INSERT INTO roles (role_name) VALUES ('Owner'), ('Admin'), ('Member'), ('Guest');

INSERT INTO permissions (permission_name) VALUES 
('CREATE_TASK'), ('EDIT_TASK'), ('DELETE_TASK'), ('MANAGE_MEMBERS'), ('VIEW_REPORTS');

INSERT INTO users (username, name, email, password_hash, sdt) VALUES
('hoang_admin', 'Nguyễn Minh Hoàng', 'hoang@example.com', 'hash_123', '0901234567'),
('lan_manager', 'Trần Thị Lan', 'lan@example.com', 'hash_456', '0912345678'),
('minh_dev', 'Lê Quang Minh', 'minh@example.com', 'hash_789', '0923456789'),
('thu_dev', 'Phạm Hoài Thu', 'thu@example.com', 'hash_000', '0934567890');

INSERT INTO role_permissions (role_id, permission_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 4),
(3, 1), (3, 2);

-- 2. WORKSPACES
INSERT INTO workspaces (name, description, created_by) VALUES 
('Phát triển Phần mềm 2024', 'Workspace dành cho các dự án nội bộ công ty', 1),
('Marketing & Branding', 'Các chiến dịch truyền thông', 2);

INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES 
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 3),
(2, 2, 1);

INSERT INTO workspace_invitations (workspace_id, email, role_id, invited_by, status) VALUES 
(1, 'new_hire@example.com', 3, 1, 'PENDING');

-- 3. SPACES
INSERT INTO spaces (workspace_id, name, description) VALUES 
(1, 'Dự án App Mobile', 'Phát triển ứng dụng quản lý chi tiêu'),
(1, 'Hệ thống Backend', 'Xây dựng core logic và API');

INSERT INTO space_members (space_id, user_id, role_id) VALUES 
(1, 1, 2), (1, 3, 3), (1, 4, 3),
(2, 1, 2), (2, 3, 3);

-- 4. SPACE ATTRIBUTES (Cấu hình cho Space_id = 1)
INSERT INTO task_status (space_id, status_name, position) VALUES 
(1, 'Mới tạo', 1), (1, 'Đang làm', 2), (1, 'Đợi review', 3), (1, 'Hoàn thành', 4);

INSERT INTO task_priority (space_id, priority_name, position) VALUES 
(1, 'Khẩn cấp', 1), (1, 'Cao', 2), (1, 'Trung bình', 3), (1, 'Thấp', 4);

INSERT INTO milestones (space_id, name, due_date) VALUES 
(1, 'Hoàn thiện bản Prototype', '2026-04-15');

INSERT INTO sprints (space_id, name, start_date, end_date) VALUES 
(1, 'Sprint 01: Auth & Database', '2026-03-01', '2026-03-15');

INSERT INTO tags (space_id, name) VALUES 
(1, 'Giao diện'), (1, 'Lỗi'), (1, 'Cần tối ưu');

-- 5. TASKS & RELATIONS
-- Task cha
INSERT INTO tasks (space_id, name, description, status_id, priority_id, sprint_id, created_by) VALUES 
(1, 'Thiết kế UI cho màn hình chính', 'Sử dụng Figma để vẽ mockup', 2, 2, 1, 2);

-- Task con (parent_task_id = 1)
INSERT INTO tasks (parent_task_id, space_id, name, status_id, priority_id, created_by) VALUES 
(1, 1, 'Vẽ icon bộ nhận diện', 1, 3, 3);

-- Gán người thực hiện và Tag
INSERT INTO task_assigns (task_id, user_id) VALUES (1, 3), (1, 4), (2, 4);
INSERT INTO task_tags (task_id, tag_id) VALUES (1, 1), (2, 2);

-- 6. ACTIVITIES, COMMENTS & NOTIFICATIONS
INSERT INTO activity_logs (task_id, user_id, action) VALUES 
(1, 2, 'đã thay đổi trạng thái thành Đang làm'),
(2, 3, 'đã gán task này cho Phạm Hoài Thu');

INSERT INTO comments (task_id, user_id, content) VALUES 
(1, 3, 'Tôi đã bắt đầu làm phần bố cục, chiều nay sẽ có kết quả.');

INSERT INTO attachments (task_id, file_name, file_url, uploaded_by) VALUES 
(1, 'sketch_v1.pdf', 'https://cdn.example.com/files/1/sketch_v1.pdf', 3);

INSERT INTO notifications (user_id, actor_id, entity_id, entity_type, type, content) VALUES 
(4, 2, 1, 'task', 'ASSIGN_TASK', 'Bạn đã được thêm vào task Thiết kế UI cho màn hình chính');

COMMIT;