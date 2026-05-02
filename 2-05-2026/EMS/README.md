# EMS — Employee Management System

A full-stack .NET 10 application with:
- **EMS.InMemoryAPI** — ASP.NET Core Web API (REST) with EF Core + MSSQL
- **EMS.MvcApp** — ASP.NET Core MVC frontend (Razor Views)
- **MSSQL Server 2022** — hosted in Docker
- **Docker Compose** — orchestrates all 3 containers

---

## Architecture

```
Docker Network: ems-network
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [Browser] → :5001 → [ems-mvc]                      │
│                           ↓  HTTP (internal :8080)  │
│                       [ems-api]                     │
│                           ↓  EF Core                │
│                       [ems-mssql] :1433             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Docker Desktop** installed and running
- **.NET 10 SDK** (for local development only)

---

## 🚀 Quick Start — Docker

```bash
# 1. Clone / unzip the project
cd EMS

# 2. Build and start all containers
docker compose up --build

# 3. Wait ~60 seconds for MSSQL to be ready
#    The API auto-runs migrations on startup

# 4. Open in browser:
#    MVC App  → http://localhost:5001
#    API      → http://localhost:5000
#    Swagger  → http://localhost:5000/swagger
```

To stop:
```bash
docker compose down
```

To stop and remove volumes (wipes DB data):
```bash
docker compose down -v
```

---

## API Endpoints

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/employee         | Get all employees  |
| GET    | /api/employee/{id}    | Get by ID          |
| POST   | /api/employee         | Create employee    |
| PUT    | /api/employee/{id}    | Update employee    |
| DELETE | /api/employee/{id}    | Delete employee    |

---

## Local Development (without Docker)

### 1. Start MSSQL only via Docker:
```bash
docker compose up mssql -d
```

### 2. Run the API:
```bash
cd EMS.InMemoryAPI
dotnet run
# Runs on http://localhost:5000
```

### 3. Run the MVC app:
```bash
cd EMS.MvcApp
# Update appsettings.json → ApiSettings:BaseUrl → http://localhost:5000
dotnet run
# Runs on http://localhost:5001
```

---

## Project Structure

```
EMS/
├── docker-compose.yml
├── EMS.sln
├── EMS.InMemoryAPI/          ← Web API
│   ├── Controllers/
│   │   └── EmployeeController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Migrations/
│   ├── Models/
│   │   └── Employee.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── Dockerfile
└── EMS.MvcApp/               ← MVC Frontend
    ├── Controllers/
    │   └── EmployeeController.cs
    ├── Models/
    │   └── Employee.cs
    ├── Views/
    │   ├── Employee/
    │   │   ├── Index.cshtml
    │   │   ├── Create.cshtml
    │   │   ├── Edit.cshtml
    │   │   ├── Details.cshtml
    │   │   └── Delete.cshtml
    │   ├── Shared/
    │   │   └── _Layout.cshtml
    │   ├── _ViewImports.cshtml
    │   └── _ViewStart.cshtml
    ├── wwwroot/css/site.css
    ├── Program.cs
    ├── appsettings.json
    └── Dockerfile
```

---

## Notes

- MSSQL SA password: `YourStrong@Passw0rd` (change in production)
- Database is auto-created via `db.Database.Migrate()` on API startup
- MSSQL data persists in Docker volume `mssql_data`
- Connect to MSSQL via SSMS/Azure Data Studio: `localhost,1433` | `sa` | `YourStrong@Passw0rd`
