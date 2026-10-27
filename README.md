# MediFlow — Clinic Appointment & Management System

Hệ thống Đặt lịch & Quản lý Phòng khám y tế bao gồm Backend (Spring Boot), Frontend (React + Vite) và thư mục cấu hình hạ tầng `infras/`.

---

## Cấu trúc thư mục dự án

```
appointment-service/
├── backend/                       # Spring Boot 3 REST API & Kafka Service
│   ├── src/                       # Controllers, Services, Repositories, DTOs, Kafka Events
│   ├── pom.xml                    # Maven configuration
│   ├── Dockerfile                 # Multi-stage Docker build cho backend
│   └── application.properties     # Cấu hình Database Postgres & Kafka
│
├── frontend/                      # React 19 + Vite + Tailwind CSS v4 + Framer Motion
│   ├── src/                       # Pages (Booking, My Appointments, Doctor, Admin)
│   ├── package.json               # Dependencies
│   ├── Dockerfile                 # Multi-stage Docker build cho frontend
│   └── nginx.conf                 # Nginx proxy và SPA routing
│
├── infras/                        # Cấu hình Docker Compose & .env riêng cho từng service
│   ├── back-end/
│   │   ├── .env
│   │   └── docker-compose.yml
│   ├── front-end/
│   │   ├── .env
│   │   └── docker-compose.yml
│   ├── postgres/
│   │   ├── .env
│   │   └── docker-compose.yml
│   └── kafka/
│       ├── .env
│       └── docker-compose.yml
│
├── docker-compose.yml             # Docker Compose gốc điều hành tất cả compose trong infras/
├── run-backend.bat                # Script chạy nhanh backend khi dev local
└── run-frontend.bat               # Script chạy nhanh frontend khi dev local
```

---

## Cách khởi chạy bằng Docker

### Cách 1: Khởi chạy toàn bộ hệ thống bằng 1 lệnh duy nhất (Root Docker Compose)
Tại thư mục gốc dự án:
```bash
docker compose up -d
```
File `docker-compose.yml` ở thư mục gốc sử dụng cơ chế `include` để tự động nạp và điều phối tất cả các file docker-compose trong thư mục `infras/`, đồng thời tự động tạo network chung `appointment_network`.

### Cách 2: Khởi chạy từng service riêng biệt trong `infras/`
Nếu chỉ muốn chạy riêng lẻ từng service:
```bash
# Chỉ chạy Database:
cd infras/postgres && docker compose up -d

# Chỉ chạy Kafka:
cd infras/kafka && docker compose up -d

# Chỉ chạy Backend:
cd infras/back-end && docker compose up -d

# Chỉ chạy Frontend:
cd infras/front-end && docker compose up -d
```

---

## Danh sách Cổng Dịch vụ (Ports)

* **Frontend**: `http://localhost:3000/`
* **Backend API**: `http://localhost:8080/`
* **PostgreSQL**: `localhost:5433` (Database: `appointment_db`, User: `hdang2507`)
* **Adminer UI**: `http://localhost:8081/`
* **Kafka**: `localhost:9092`
