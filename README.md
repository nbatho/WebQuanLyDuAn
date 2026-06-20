<div align="center">

# FLOWISE — Hệ thống Quản lý Dự án **React** & **Node.js**.

![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng-chính)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [API Endpoints](#-api-endpoints)
- [Phân quyền](#-hệ-thống-phân-quyền)
- [Tác giả](#-tác-giả)

---

## 💡 Giới thiệu

**Flowise** là hệ thống quản lý dự án và công việc dành cho nhóm, lấy cảm hứng từ các công cụ như ClickUp và Jira. Hệ thống cung cấp đầy đủ các tính năng cần thiết để quản lý công việc hiệu quả, kết hợp với **trợ lý AI thông minh** giúp tự động hóa quy trình làm việc.

---

## ✨ Tính năng chính

### 📂 Quản lý Workspace & Space

- Tạo và quản lý nhiều **Workspace** (dự án)
- Tổ chức công việc theo **Spaces** (không gian), **Folders** (thư mục), **Lists** (danh sách)
- Mời thành viên qua email với liên kết xác thực

### ✅ Quản lý Task

- Tạo, cập nhật, xóa task với đầy đủ thông tin (tên, mô tả, ưu tiên, deadline)
- **Kanban Board** — Hiển thị task theo trạng thái (To Do, In Progress, Done...)
- Phân công task cho thành viên (**Assignee**)
- Bình luận (**Comments**) và đính kèm tệp (**Attachments**)
- Chia sẻ task giữa các thành viên

### 🏃 Sprint & Milestone

- Quản lý Sprint với trạng thái (Planning, Active, Completed)
- Theo dõi Milestones cho các mốc quan trọng của dự án

### ⏱️ Time Tracking

- Bấm giờ và ghi nhận thời gian làm việc cho từng task
- Thống kê thời gian theo user và space

### 💬 Messaging

- Nhắn tin trực tiếp giữa các thành viên (**Direct Message**)
- Tạo **Channels** nhóm và **Space Chat**
- Gửi file đính kèm trong tin nhắn

### 🤖 Trợ lý AI (FlowiseAI)

- Chat AI đa năng, hỗ trợ cả kiến thức chung và quản lý dự án
- **Tạo Task/Space bằng ngôn ngữ tự nhiên** — "Tạo task thiết kế UI cho Space Frontend"
- **Thống kê task** — Đếm task theo trạng thái, tìm task quá hạn
- **Gợi ý AI** — Tự động sinh mô tả task, đề xuất mức độ ưu tiên
- Sử dụng model **Llama 3.3 70B** qua Groq API

### 🔔 Thông báo

- Thông báo khi được giao task mới
- Đánh dấu đã đọc / chưa đọc

### 🔐 Xác thực & Bảo mật

- Đăng ký / Đăng nhập với email & mật khẩu
- **Google OAuth 2.0** — Đăng nhập nhanh bằng Google
- JWT Access Token (15 phút) + Refresh Token (14 ngày) qua HttpOnly Cookie
- **OTP qua email** để xác thực đổi mật khẩu
- Rate Limiting chống brute-force và lạm dụng API
- Hệ thống phân quyền RBAC (Admin, Manager, Member)

---

## 🛠 Công nghệ sử dụng

### Frontend

| Công nghệ           | Phiên bản | Mô tả                     |
| ------------------- | --------- | ------------------------- |
| **React**           | 19        | UI Framework              |
| **TypeScript**      | 5.9       | Strongly-typed JavaScript |
| **Vite**            | 7.x       | Build tool & Dev server   |
| **TailwindCSS**     | 4.x       | Utility-first CSS         |
| **Ant Design**      | 6.x       | UI Component Library      |
| **Redux Toolkit**   | 2.x       | State Management          |
| **React Router**    | 7.x       | Client-side Routing       |
| **React Hook Form** | 7.x       | Form Management           |
| **Zod**             | 4.x       | Schema Validation         |
| **Axios**           | 1.x       | HTTP Client               |
| **Sonner**          | 2.x       | Toast Notifications       |

### Backend

| Công nghệ               | Phiên bản | Mô tả            |
| ----------------------- | --------- | ---------------- |
| **Node.js**             | 20+       | Runtime          |
| **Express**             | 5.x       | Web Framework    |
| **PostgreSQL**          | 16        | Database         |
| **JWT**                 | 9.x       | Authentication   |
| **bcrypt**              | 6.x       | Password Hashing |
| **Groq SDK**            | 1.x       | AI Integration   |
| **Resend**              | 6.x       | Email Service    |
| **Multer**              | 2.x       | File Upload      |
| **express-rate-limit**  | —         | Rate Limiting    |
| **Google Auth Library** | 10.x      | Google OAuth     |

### DevOps

| Công nghệ          | Mô tả                           |
| ------------------ | ------------------------------- |
| **Docker**         | Containerization                |
| **Docker Compose** | Multi-container orchestration   |
| **Nodemon**        | Auto-restart during development |

---

## 📦 Yêu cầu hệ thống

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **PostgreSQL** ≥ 16 (hoặc Docker)
- **Git**

---

## 🚀 Cài đặt & Chạy dự án

### Cách 1: Chạy thủ công (Development)

#### 1. Clone repository

```bash
git clone <repository-url>
cd WebQuanLyDuAn
```

#### 2. Thiết lập Database

Tạo project trên Supabase, sau đó mở **SQL Editor** và chạy nội dung file `backend/flowise.sql` để khởi tạo schema.

Lấy thông tin kết nối PostgreSQL trong **Project Settings > Database**. Khi chạy trong Docker, nên dùng thông tin Supabase pooler.

#### 3. Cấu hình Backend

```bash
cd backend
cp .env.example .env
```

Chỉnh sửa file `backend/.env`:

```env
PORT=5001
DB_HOST=<supabase_pooler_host>
DB_PORT=5432
DB_USER=postgres.<project_ref>
DB_PASSWORD=<supabase_database_password>
DB_NAME=postgres
DB_SSL=true

RESEND_API_KEY=<resend_api_key>
ACCESS_TOKEN_SECRET=<chuỗi_bí_mật_ngẫu_nhiên_64_ký_tự>
EMAIL_TOKEN_SECRET=<chuỗi_bí_mật_ngẫu_nhiên_64_ký_tự>
GOOGLE_CLIENT_ID=<google_oauth_client_id>
GROQ_API_KEY=<groq_api_key>
```

Cài đặt dependencies và chạy:

```bash
npm install
npm run dev
```

> Backend chạy tại: `http://localhost:5001`

#### 4. Cấu hình Frontend

```bash
cd frontend
cp .env.example .env
```

Chỉnh sửa file `frontend/.env`:

```env
VITE_API_GATEWAY_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=<google_oauth_client_id>
```

Cài đặt dependencies và chạy:

```bash
npm install
npm run dev
```

> Frontend chạy tại: `http://localhost:5173`

---

### Cách 2: Chạy bằng Docker Compose

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build -d
```

Điền thông tin kết nối Supabase PostgreSQL vào `backend/.env` trước khi chạy. Docker Compose chỉ khởi chạy Backend API và Frontend; database được sử dụng trực tiếp từ Supabase.

Các địa chỉ mặc định:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

Biến cho Docker Compose nằm trong `.env` ở thư mục gốc. Biến backend và frontend lần lượt nằm trong `backend/.env` và `frontend/.env`.

```bash
docker compose down
```

---

## 📁 Cấu trúc thư mục

```
WebQuanLyDuAn/
├── backend/                     # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── connect.js       # Kết nối PostgreSQL Pool
│   │   ├── controllers/         # Xử lý logic nghiệp vụ
│   │   │   ├── authControllers.js
│   │   │   ├── taskController.js
│   │   │   ├── aiController.js
│   │   │   ├── messageController.js
│   │   │   └── ...
│   │   ├── middlewares/         # Middleware
│   │   │   ├── authMiddlewares.js        # JWT xác thực
│   │   │   ├── roleMiddlewares.js        # Phân quyền RBAC
│   │   │   ├── membershipMiddleware.js   # Kiểm tra membership
│   │   │   ├── rateLimitMiddleware.js    # Chống brute-force
│   │   │   └── errorMiddleware.js        # Xử lý lỗi tập trung
│   │   ├── models/              # Truy vấn Database
│   │   │   ├── Users.js
│   │   │   ├── Task.js
│   │   │   ├── Permission.js
│   │   │   └── ...
│   │   ├── routes/              # Định tuyến API
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── ...
│   │   └── server.js            # Entry point
│   ├── uploads/                 # Thư mục lưu file upload
│   ├── flowise.sql              # Schema & Seed Database
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/                    # Frontend (React/Vite/TypeScript)
│   ├── src/
│   │   ├── api/                 # API client (Axios)
│   │   │   └── callApi.ts       # Axios instance + interceptors
│   │   ├── components/          # Shared UI components
│   │   │   ├── TaskDetailModal/
│   │   │   ├── ShareTaskModal.tsx
│   │   │   └── ...
│   │   ├── layouts/             # Layout components
│   │   │   └── AppLayout/       # Sidebar + TopBar + Content
│   │   ├── pages/               # Các trang
│   │   │   ├── AuthPage/        # Login / Register
│   │   │   ├── LandingPage/     # Trang chủ
│   │   │   ├── MyTasksPage/     # Task của tôi
│   │   │   ├── ListViewPage/    # Kanban Board
│   │   │   ├── SprintViewPage/  # Sprint Board
│   │   │   ├── AIPage/          # Chat AI
│   │   │   ├── InboxPage/       # Thông báo
│   │   │   ├── SettingsPage/    # Cài đặt
│   │   │   └── TimeTrackingPage/# Theo dõi thời gian
│   │   ├── store/               # Redux store
│   │   ├── hooks/               # Custom React hooks
│   │   ├── routes/              # Route definitions
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                        # Tài liệu dự án
└── README.md
```

---

## 🔐 Hệ thống Phân quyền

Flowise sử dụng mô hình **RBAC** (Role-Based Access Control) với 3 vai trò:

| Vai trò     | Mô tả         | Quyền chính                                                                     |
| ----------- | ------------- | ------------------------------------------------------------------------------- |
| **Admin**   | Quản trị viên | Toàn quyền — quản lý workspace, space, task, thành viên, role                   |
| **Manager** | Quản lý       | Quản lý space & task — tạo/sửa/xóa task, quản lý thành viên space, folder, list |
| **Member**  | Thành viên    | Tương tác cơ bản — tạo/sửa task, bình luận, đính kèm, time log                  |

### Bảng phân quyền chi tiết

| Quyền                                    | Admin | Manager | Member |
| ---------------------------------------- | :---: | :-----: | :----: |
| Cập nhật / Xóa Workspace                 |  ✅   |   ❌    |   ❌   |
| Mời thành viên / Quản lý Role            |  ✅   |   ❌    |   ❌   |
| Tạo / Xóa Space                          |  ✅   |   ❌    |   ❌   |
| Cập nhật Space, Quản lý thành viên Space |  ✅   |   ✅    |   ❌   |
| Quản lý Folder / List / Settings         |  ✅   |   ✅    |   ❌   |
| Tạo / Cập nhật Task                      |  ✅   |   ✅    |   ✅   |
| Xóa Task                                 |  ✅   |   ✅    |   ❌   |
| Đổi trạng thái / Phân công Task          |  ✅   |   ✅    |   ✅   |
| Bình luận / Đính kèm / Time Log          |  ✅   |   ✅    |   ✅   |

---

## 🔧 Scripts

### Backend

```bash
npm run dev      # Chạy development (nodemon)
npm start        # Chạy production
```

### Frontend

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # Kiểm tra lỗi ESLint
npm run format   # Format code với Prettier
```

---

## 👨‍💻 Tác giả

**Nguyễn Bá Thọ** — B23DCDT249 \
**Nguyễn Minh Đăng** — B23DCDT045
