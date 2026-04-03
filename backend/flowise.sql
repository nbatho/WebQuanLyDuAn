-- ================================================================
-- FLOWISE — PostgreSQL Database Schema
-- Phiên bản: 2.0 (viết lại hoàn chỉnh từ createTableTTCS.sql)
-- Bảng: 23 bảng (21 gốc + time_logs + user_sessions)
-- ================================================================

-- Extension cần thiết
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
-- 1. USERS & ROLES
-- ================================================================

CREATE TABLE users (
    user_id       SERIAL        PRIMARY KEY,
    username      VARCHAR(50)   UNIQUE,
    name          VARCHAR(255),
    email         VARCHAR(255)  UNIQUE NOT NULL,
    password_hash TEXT,
    avatar_url    TEXT,
    sdt           VARCHAR(20),
    google_id     VARCHAR(255)  UNIQUE,              -- Google OAuth
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    last_seen_at  TIMESTAMP,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id     SERIAL       PRIMARY KEY,
    role_name   VARCHAR(100) NOT NULL UNIQUE         -- 'admin','manager','member','guest'
);

CREATE TABLE permissions (
    permission_id   SERIAL       PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,    -- 'task:create','space:delete'...
    category        VARCHAR(50)                      -- 'task','space','workspace','member'
);

CREATE TABLE role_permissions (
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id)       REFERENCES roles(role_id)            ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- JWT refresh token — lưu để revoke khi logout
CREATE TABLE user_sessions (
    session_id    SERIAL    PRIMARY KEY,
    user_id       INT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    refresh_token TEXT      NOT NULL UNIQUE,
    device_info   TEXT,
    ip_address    INET,
    expires_at    TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 2. WORKSPACES
-- ================================================================

CREATE TABLE workspaces (
    workspace_id SERIAL       PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    slug         VARCHAR(100) NOT NULL UNIQUE,       -- URL: 'acme-corp'
    description  TEXT,
    plan         VARCHAR(20)  NOT NULL DEFAULT 'free', -- 'free','pro','enterprise'
    created_by   INT          REFERENCES users(user_id) ON DELETE SET NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspace_members (
    workspace_id INT NOT NULL,
    user_id      INT NOT NULL,
    role_id      INT,
    joined_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)      REFERENCES users(user_id)           ON DELETE CASCADE,
    FOREIGN KEY (role_id)      REFERENCES roles(role_id)           ON DELETE SET NULL
);

CREATE TABLE workspace_invitations (
    invitation_id SERIAL       PRIMARY KEY,
    workspace_id  INT          NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    email         VARCHAR(255) NOT NULL,
    role_id       INT          REFERENCES roles(role_id) ON DELETE SET NULL,
    token         TEXT         NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    invited_by    INT          REFERENCES users(user_id) ON DELETE SET NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','accepted','rejected','expired')),
    expires_at    TIMESTAMP    NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    accepted_at   TIMESTAMP,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 3. SPACES
-- ================================================================

CREATE TABLE spaces (
    space_id     SERIAL       PRIMARY KEY,
    workspace_id INT          NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    color        VARCHAR(7)   NOT NULL DEFAULT '#6C63FF', -- hex color sidebar
    icon         VARCHAR(10),                             -- emoji icon
    is_private   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_by   INT          REFERENCES users(user_id) ON DELETE SET NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE space_members (
    space_id  INT NOT NULL,
    user_id   INT NOT NULL,
    role_id   INT,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (space_id, user_id),
    FOREIGN KEY (space_id) REFERENCES spaces(space_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
    FOREIGN KEY (role_id)  REFERENCES roles(role_id)   ON DELETE SET NULL
);

-- ================================================================
-- 4. SPACE ATTRIBUTES — Status, Priority, Milestone, Sprint, Tag
-- ================================================================

CREATE TABLE task_status (
    status_id    SERIAL       PRIMARY KEY,
    space_id     INT          NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
    status_name  VARCHAR(100) NOT NULL,
    color        VARCHAR(7)   NOT NULL DEFAULT '#9CA3AF',
    position     INT          NOT NULL DEFAULT 0,     -- thứ tự drag-to-reorder
    is_done_state BOOLEAN     NOT NULL DEFAULT FALSE, -- TRUE = task hoàn thành
    is_default   BOOLEAN      NOT NULL DEFAULT FALSE,
    UNIQUE (space_id, status_name)
);

CREATE TABLE task_priority (
    priority_id   SERIAL       PRIMARY KEY,
    space_id      INT          NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
    priority_name VARCHAR(100) NOT NULL,
    color         VARCHAR(7)   NOT NULL DEFAULT '#6C63FF',
    position      INT          NOT NULL DEFAULT 0,
    UNIQUE (space_id, priority_name)
);

CREATE TABLE milestones (
    milestone_id SERIAL       PRIMARY KEY,
    space_id     INT          NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'on_track'
                              CHECK (status IN ('on_track','at_risk','completed','cancelled')),
    color        VARCHAR(7)   DEFAULT '#00D4AA',
    due_date     DATE,
    created_by   INT          REFERENCES users(user_id) ON DELETE SET NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sprints (
    sprint_id   SERIAL       PRIMARY KEY,
    space_id    INT          NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    goal        TEXT,                                 -- sprint goal
    status      VARCHAR(20)  NOT NULL DEFAULT 'planning'
                             CHECK (status IN ('planning','active','completed','cancelled')),
    velocity    SMALLINT,                             -- story points hoàn thành
    start_date  DATE,
    end_date    DATE,
    created_by  INT          REFERENCES users(user_id) ON DELETE SET NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tag_id     SERIAL      PRIMARY KEY,
    space_id   INT         NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    color      VARCHAR(7)  DEFAULT '#6C63FF',
    created_by INT         REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (space_id, name)
);

-- ================================================================
-- 5. TASKS & RELATIONS
-- ================================================================

CREATE TABLE tasks (
    task_id        SERIAL       PRIMARY KEY,
    parent_task_id INT          REFERENCES tasks(task_id)         ON DELETE CASCADE,  -- subtask
    space_id       INT          NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
    sprint_id      INT          REFERENCES sprints(sprint_id)     ON DELETE SET NULL,
    milestone_id   INT          REFERENCES milestones(milestone_id) ON DELETE SET NULL,
    status_id      INT          REFERENCES task_status(status_id) ON DELETE SET NULL,
    priority_id    INT          REFERENCES task_priority(priority_id) ON DELETE SET NULL,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    story_points   SMALLINT     CHECK (story_points >= 0 AND story_points <= 100),
    start_date     DATE,                              -- Timeline/Gantt cần start_date
    due_date       DATE,
    completed_at   TIMESTAMP,                         -- lúc task được đánh dấu done
    position       INT          NOT NULL DEFAULT 0,   -- thứ tự trong group List View
    is_archived    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_by     INT          REFERENCES users(user_id) ON DELETE SET NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_assigns (
    task_id     INT NOT NULL,
    user_id     INT NOT NULL,
    assigned_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id)  REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE task_tags (
    task_id INT NOT NULL,
    tag_id  INT NOT NULL,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)  REFERENCES tags(tag_id)   ON DELETE CASCADE
);

-- Time Tracker — mỗi lần nhấn ▶/■ tạo 1 row
CREATE TABLE time_logs (
    time_log_id   SERIAL    PRIMARY KEY,
    task_id       INT       NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    user_id       INT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    started_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stopped_at    TIMESTAMP,                          -- NULL = đang chạy
    duration_secs INT GENERATED ALWAYS AS (
        CASE WHEN stopped_at IS NOT NULL
             THEN EXTRACT(EPOCH FROM (stopped_at - started_at))::INT
             ELSE NULL END
    ) STORED,
    note          TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 6. ACTIVITIES & NOTIFICATIONS
-- ================================================================

CREATE TABLE activity_logs (
    activity_id SERIAL    PRIMARY KEY,
    task_id     INT       NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    user_id     INT       REFERENCES users(user_id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL
                CHECK (action IN (
                    'created','updated','deleted',
                    'status_changed','priority_changed',
                    'assigned','unassigned',
                    'commented','attachment_added','attachment_removed',
                    'due_date_changed','start_date_changed',
                    'moved','archived','restored',
                    'timer_started','timer_stopped',
                    'sprint_assigned','milestone_assigned',
                    'tag_added','tag_removed',
                    'subtask_added','story_points_changed'
                )),
    old_value   JSONB,                                -- giá trị trước
    new_value   JSONB,                                -- giá trị sau
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    comment_id SERIAL    PRIMARY KEY,
    task_id    INT       NOT NULL REFERENCES tasks(task_id)    ON DELETE CASCADE,
    parent_id  INT       REFERENCES comments(comment_id)       ON DELETE CASCADE, -- reply
    user_id    INT       NOT NULL REFERENCES users(user_id)    ON DELETE CASCADE,
    content    TEXT      NOT NULL,
    is_edited  BOOLEAN   NOT NULL DEFAULT FALSE,
    edited_at  TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attachments (
    attachment_id SERIAL       PRIMARY KEY,
    task_id       INT          NOT NULL REFERENCES tasks(task_id)    ON DELETE CASCADE,
    comment_id    INT          REFERENCES comments(comment_id)       ON DELETE SET NULL,
    file_name     VARCHAR(255) NOT NULL,
    file_url      TEXT         NOT NULL,
    file_size     BIGINT,                             -- bytes
    mime_type     VARCHAR(100),
    uploaded_by   INT          REFERENCES users(user_id) ON DELETE SET NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id SERIAL      PRIMARY KEY,
    user_id         INT         NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,  -- người nhận
    actor_id        INT         REFERENCES users(user_id) ON DELETE SET NULL,           -- người thực hiện
    entity_id       INT,                              -- task_id, invitation_id, ...
    entity_type     VARCHAR(50),                      -- 'task','comment','invitation',...
    type            VARCHAR(100) NOT NULL,            -- 'assigned','mention','status_changed',...
    content         TEXT        NOT NULL,
    is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMP,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- INDEXES
-- ================================================================

-- Tasks — query nhiều nhất
CREATE INDEX idx_tasks_space_id      ON tasks(space_id);
CREATE INDEX idx_tasks_parent_id     ON tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;
CREATE INDEX idx_tasks_status_id     ON tasks(status_id);
CREATE INDEX idx_tasks_sprint_id     ON tasks(sprint_id)      WHERE sprint_id IS NOT NULL;
CREATE INDEX idx_tasks_milestone_id  ON tasks(milestone_id)   WHERE milestone_id IS NOT NULL;
CREATE INDEX idx_tasks_due_date      ON tasks(due_date)        WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_archived      ON tasks(is_archived);
CREATE INDEX idx_tasks_position      ON tasks(space_id, status_id, position);
CREATE INDEX idx_tasks_name_fts      ON tasks USING gin(to_tsvector('simple', name));

-- Assigns
CREATE INDEX idx_task_assigns_user_id ON task_assigns(user_id);
CREATE INDEX idx_task_assigns_task_id ON task_assigns(task_id);

-- Notifications — Inbox query
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread  ON notifications(user_id, is_read, created_at DESC);

-- Activity logs
CREATE INDEX idx_activity_logs_task_id ON activity_logs(task_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- Comments
CREATE INDEX idx_comments_task_id   ON comments(task_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- Time logs
CREATE INDEX idx_time_logs_task_id  ON time_logs(task_id);
CREATE INDEX idx_time_logs_user_id  ON time_logs(user_id);
CREATE INDEX idx_time_logs_running  ON time_logs(user_id) WHERE stopped_at IS NULL;

-- Sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token   ON user_sessions(refresh_token);

-- Workspace & Space
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_space_members_user_id     ON space_members(user_id);
CREATE INDEX idx_spaces_workspace_id       ON spaces(workspace_id);

-- ================================================================
-- TRIGGERS — tự động cập nhật updated_at
-- ================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_workspaces_updated
    BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_workspace_invitations_updated
    BEFORE UPDATE ON workspace_invitations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_spaces_updated
    BEFORE UPDATE ON spaces
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_milestones_updated
    BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_sprints_updated
    BEFORE UPDATE ON sprints
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tasks_updated
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_comments_updated
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ================================================================
-- TRIGGER — tự động ghi read_at khi đánh dấu đã đọc
-- ================================================================

CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
        NEW.read_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notifications_read
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION mark_notification_read();

-- ================================================================
-- TRIGGER — tự động complete_at khi task chuyển sang done state
-- ================================================================

CREATE OR REPLACE FUNCTION set_task_completed_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_is_done BOOLEAN;
BEGIN
    IF NEW.status_id IS DISTINCT FROM OLD.status_id THEN
        SELECT is_done_state INTO v_is_done
        FROM task_status WHERE status_id = NEW.status_id;

        IF v_is_done = TRUE THEN
            NEW.completed_at = CURRENT_TIMESTAMP;
        ELSE
            NEW.completed_at = NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_task_completed_at
    BEFORE UPDATE OF status_id ON tasks
    FOR EACH ROW EXECUTE FUNCTION set_task_completed_at();

-- ================================================================
-- VIEW — kanban_tasks
-- Dùng cho Board View + List View: 1 query lấy đủ data 1 task card
-- Tránh N+1 query khi render danh sách
-- ================================================================

CREATE OR REPLACE VIEW kanban_tasks AS
SELECT
    t.task_id,
    t.parent_task_id,
    t.space_id,
    t.name,
    t.description,
    t.story_points,
    t.start_date,
    t.due_date,
    t.completed_at,
    t.position,
    t.is_archived,
    t.created_by,
    t.created_at,
    t.updated_at,
    -- Status
    ts.status_name,
    ts.color          AS status_color,
    ts.is_done_state,
    -- Priority
    tp.priority_name,
    tp.color          AS priority_color,
    -- Sprint & Milestone
    sp.name           AS sprint_name,
    ms.name           AS milestone_name,
    -- Subtask progress
    COALESCE(sub.total, 0)      AS subtask_count,
    COALESCE(sub.done,  0)      AS subtask_done_count,
    -- Cộng tác
    COALESCE(cmt.cnt, 0)        AS comment_count,
    COALESCE(att.cnt, 0)        AS attachment_count,
    -- Time tracking
    COALESCE(tl.total_secs, 0)  AS time_logged_secs
FROM tasks t
LEFT JOIN task_status   ts  ON ts.status_id    = t.status_id
LEFT JOIN task_priority tp  ON tp.priority_id  = t.priority_id
LEFT JOIN sprints       sp  ON sp.sprint_id    = t.sprint_id
LEFT JOIN milestones    ms  ON ms.milestone_id = t.milestone_id
LEFT JOIN LATERAL (
    SELECT
        COUNT(*)                                          AS total,
        COUNT(*) FILTER (WHERE ts2.is_done_state = TRUE) AS done
    FROM tasks sub2
    JOIN task_status ts2 ON ts2.status_id = sub2.status_id
    WHERE sub2.parent_task_id = t.task_id
) sub ON TRUE
LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM comments WHERE task_id = t.task_id
) cmt ON TRUE
LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM attachments WHERE task_id = t.task_id
) att ON TRUE
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(duration_secs), 0) AS total_secs
    FROM time_logs
    WHERE task_id = t.task_id AND stopped_at IS NOT NULL
) tl ON TRUE
WHERE t.is_archived = FALSE;

-- ================================================================
-- VIEW — user_task_summary
-- Dùng cho Dashboard stats: total, done, overdue, time per user
-- ================================================================

CREATE OR REPLACE VIEW user_task_summary AS
SELECT
    ta.user_id,
    t.space_id,
    COUNT(*)                                                         AS total_tasks,
    COUNT(*) FILTER (WHERE ts.is_done_state = TRUE)                  AS done_tasks,
    COUNT(*) FILTER (WHERE t.due_date < CURRENT_DATE
                       AND ts.is_done_state = FALSE)                 AS overdue_tasks,
    COALESCE(SUM(tl.total_secs), 0)                                  AS total_time_secs
FROM task_assigns ta
JOIN tasks       t   ON t.task_id    = ta.task_id
JOIN task_status ts  ON ts.status_id = t.status_id
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(duration_secs), 0) AS total_secs
    FROM time_logs
    WHERE task_id = t.task_id AND stopped_at IS NOT NULL
) tl ON TRUE
WHERE t.is_archived = FALSE
GROUP BY ta.user_id, t.space_id;

-- ================================================================
-- SEED DATA — Roles & Permissions mặc định
-- ================================================================

INSERT INTO roles (role_name) VALUES
    ('admin'),
    ('manager'),
    ('member'),
    ('guest');

INSERT INTO permissions (permission_name, category) VALUES
    ('workspace:manage',        'workspace'),
    ('workspace:delete',        'workspace'),
    ('workspace:invite',        'workspace'),
    ('workspace:billing',       'workspace'),
    ('space:create',            'space'),
    ('space:delete',            'space'),
    ('space:manage_members',    'space'),
    ('space:manage_statuses',   'space'),
    ('task:create',             'task'),
    ('task:update',             'task'),
    ('task:delete',             'task'),
    ('task:assign',             'task'),
    ('task:comment',            'task'),
    ('task:attach',             'task'),
    ('member:view',             'member'),
    ('member:manage_roles',     'member');

-- Admin: toàn quyền
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'admin';

-- Manager: không có workspace:delete, workspace:billing, workspace:manage
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'manager'
  AND p.permission_name NOT IN (
      'workspace:delete', 'workspace:billing', 'workspace:manage'
  );

-- Member: chỉ task operations + xem member
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'member'
  AND p.permission_name IN (
      'task:create', 'task:update', 'task:comment', 'task:attach', 'member:view'
  );

-- Guest: chỉ xem
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'guest'
  AND p.permission_name = 'member:view';
