-- ================================================================
-- 0. DỌN DẸP DỮ LIỆU CŨ (Trừ Roles & Permissions)
-- ================================================================
TRUNCATE TABLE 
    users, 
    workspaces, 
    spaces, 
    task_status, 
    task_priority, 
    milestones, 
    sprints, 
    tags, 
    tasks, 
    time_logs, 
    comments, 
    attachments, 
    activity_logs, 
    notifications 
RESTART IDENTITY CASCADE;

-- ================================================================
-- 1. USERS (Tạo 5 tài khoản)
-- ================================================================
INSERT INTO users (user_id, username, name, email, password_hash, avatar_url, is_active) VALUES
(1, 'admin', 'System Admin', 'admin@flowise.com', '$2b$10$dummyHashString123456789', 'https://i.pravatar.cc/150?u=1', true),
(2, 'manager', 'Project Manager', 'pm@flowise.com', '$2b$10$dummyHashString123456789', 'https://i.pravatar.cc/150?u=2', true),
(3, 'frontend_dev', 'Frontend Developer', 'frontend@flowise.com', '$2b$10$dummyHashString123456789', 'https://i.pravatar.cc/150?u=3', true),
(4, 'backend_dev', 'Backend Developer', 'backend@flowise.com', '$2b$10$dummyHashString123456789', 'https://i.pravatar.cc/150?u=4', true),
(5, 'client', 'Guest Client', 'client@demo.com', '$2b$10$dummyHashString123456789', 'https://i.pravatar.cc/150?u=5', true);

SELECT setval('users_user_id_seq', 5);

-- ================================================================
-- 2. WORKSPACES & WORKSPACE MEMBERS
-- ================================================================
INSERT INTO workspaces (workspace_id, name, slug, description, plan, created_by) VALUES
(1, 'Acme Corporation', 'acme-corp', 'Không gian làm việc chính của tổ chức Acme', 'pro', 1);

SELECT setval('workspaces_workspace_id_seq', 1);

INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES
(1, 1, 1), -- Admin
(1, 2, 2), -- Manager
(1, 3, 3), -- Member (Dev)
(1, 4, 3), -- Member (Dev)
(1, 5, 4); -- Guest (Client)

-- ================================================================
-- 3. SPACES & SPACE MEMBERS (Tạo 2 dự án)
-- ================================================================
INSERT INTO spaces (space_id, workspace_id, name, description, color, icon, is_private, created_by) VALUES
(1, 1, 'Flowise V2 Backend', 'Xây dựng core API cho hệ thống mới', '#6C63FF', '⚙️', false, 1),
(2, 1, 'Chiến dịch Marketing', 'Chuẩn bị ra mắt sản phẩm', '#FF6347', '📢', true, 2);

SELECT setval('spaces_space_id_seq', 2);

INSERT INTO space_members (space_id, user_id, role_id) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 3), (1, 5, 4), -- Mọi người đều vào dự án 1
(2, 1, 1), (2, 2, 2); -- Dự án 2 private, chỉ admin và manager

-- ================================================================
-- 4. SPACE ATTRIBUTES (Cấu hình Kanban, Sprint, Milestone, Tag)
-- ================================================================
INSERT INTO task_status (status_id, space_id, status_name, color, position, is_done_state, is_default) VALUES
(1, 1, 'To Do', '#9CA3AF', 0, false, true),
(2, 1, 'In Progress', '#3B82F6', 1, false, false),
(3, 1, 'Code Review', '#F59E0B', 2, false, false),
(4, 1, 'Done', '#10B981', 3, true, false);

SELECT setval('task_status_status_id_seq', 4);

INSERT INTO task_priority (priority_id, space_id, priority_name, color, position) VALUES
(1, 1, 'Low', '#9CA3AF', 0),
(2, 1, 'Normal', '#3B82F6', 1),
(3, 1, 'High', '#F59E0B', 2),
(4, 1, 'Urgent', '#EF4444', 3);

SELECT setval('task_priority_priority_id_seq', 4);

INSERT INTO milestones (milestone_id, space_id, name, status, due_date, created_by) VALUES
(1, 1, 'Alpha Release', 'completed', CURRENT_DATE - INTERVAL '10 days', 1),
(2, 1, 'Beta Release', 'on_track', CURRENT_DATE + INTERVAL '20 days', 1);

SELECT setval('milestones_milestone_id_seq', 2);

INSERT INTO sprints (sprint_id, space_id, name, status, start_date, end_date, created_by) VALUES
(1, 1, 'Sprint 1 - Database', 'completed', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '1 day', 2),
(2, 1, 'Sprint 2 - Core APIs', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 2);

SELECT setval('sprints_sprint_id_seq', 2);

INSERT INTO tags (tag_id, space_id, name, color, created_by) VALUES
(1, 1, 'Backend', '#4B5563', 4),
(2, 1, 'Frontend', '#8B5CF6', 3),
(3, 1, 'Bug Fix', '#EF4444', 2);

SELECT setval('tags_tag_id_seq', 3);

-- ================================================================
-- 5. TASKS (Công việc lõi)
-- ================================================================
INSERT INTO tasks (task_id, space_id, sprint_id, milestone_id, status_id, priority_id, name, description, story_points, start_date, due_date, created_by, completed_at) VALUES
(1, 1, 1, 1, 4, 3, 'Thiết kế Database Schema 2.0', 'Viết SQL script cho 23 bảng', 5, CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '5 days', 1, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 1, 2, 2, 2, 4, 'Viết API Login & Auth', 'Áp dụng JWT và mã hóa mật khẩu', 8, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 2, NULL),
(3, 1, 2, 2, 1, 2, 'Tạo UI Kanban Board', 'Dùng React DnD để kéo thả', 13, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '1 day', 2, NULL),
(4, 1, NULL, 2, 1, 1, 'Sửa lỗi hiển thị Avatar', 'Ảnh bị méo trên mobile', 2, NULL, NULL, 5, NULL);

SELECT setval('tasks_task_id_seq', 4);

-- Subtasks (Công việc con thuộc Task 2)
INSERT INTO tasks (task_id, parent_task_id, space_id, status_id, priority_id, name, created_by) VALUES
(5, 2, 1, 4, 3, 'Cấu hình Middleware xác thực', 4),
(6, 2, 1, 2, 3, 'Tạo endpoint POST /api/auth/login', 4);

SELECT setval('tasks_task_id_seq', 6);

-- ================================================================
-- 6. GÁN VIỆC & GẮN THẺ
-- ================================================================
INSERT INTO task_assigns (task_id, user_id, assigned_by) VALUES
(1, 1, 1), 
(2, 4, 2), 
(3, 3, 2), 
(4, 3, 2),
(5, 4, 4),
(6, 4, 4);

INSERT INTO task_tags (task_id, tag_id) VALUES
(1, 1), (2, 1), (3, 2), (4, 2), (4, 3);

-- ================================================================
-- 7. TIME LOGS & TƯƠNG TÁC (Comments, Files, Activity, Noti)
-- ================================================================
INSERT INTO time_logs (task_id, user_id, started_at, stopped_at, note) VALUES
(1, 1, CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Drafting tables and views'),
(2, 4, CURRENT_TIMESTAMP - INTERVAL '1 hour', NULL, 'Đang debug lỗi JWT token không nhận');

INSERT INTO comments (comment_id, task_id, user_id, content) VALUES
(1, 1, 1, 'Đã chốt xong schema 23 bảng nhé team. Mọi người pull code về test.'),
(2, 1, 4, 'Tuyệt vời, để em lấy schema này build Model cho backend luôn.');

SELECT setval('comments_comment_id_seq', 2);

INSERT INTO attachments (task_id, file_name, file_url, file_size, mime_type, uploaded_by) VALUES
(1, 'schema_v2.sql', 'https://flowise-demo-storage.s3.aws.com/schema_v2.sql', 15360, 'application/sql', 1);

INSERT INTO activity_logs (task_id, user_id, action, old_value, new_value) VALUES
(1, 1, 'status_changed', '{"status_id": 3}', '{"status_id": 4}'),
(2, 4, 'timer_started', NULL, '{"note": "Đang debug lỗi JWT token không nhận"}');

INSERT INTO notifications (user_id, actor_id, entity_id, entity_type, type, content, is_read) VALUES
(4, 2, 2, 'task', 'assigned', 'Project Manager vừa giao cho bạn công việc: Viết API Login & Auth', false),
(3, 2, 3, 'task', 'assigned', 'Project Manager vừa giao cho bạn công việc: Tạo UI Kanban Board', false),
(1, 4, 1, 'comment', 'mention', 'Backend Developer đã bình luận trong thẻ Thiết kế Database', true);