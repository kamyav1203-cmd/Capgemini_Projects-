# Multi-Catalog Bill Generator

Full-stack billing demo: **ASP.NET Core 8 Web API** (SQLite + EF Core) and a **React (JavaScript + Vite)** client. It supports multiple catalogs (entrance, donation presets, selling), custom lines, discounts, tax, draft/finalized bills, CSV export, print-friendly invoices, and a daily sales summary.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) (for the React app)

## Run the API

From the solution folder:

```powershell
cd BillGenerator.Api
dotnet run
```

- Default URL: `http://localhost:5235` (see `Properties/launchSettings.json`).
- Swagger UI: `http://localhost:5235/swagger` (Development).
- SQLite file: `BillGenerator.Api/billgenerator.db` (created on first run; migrations and catalog seed run automatically).

## Run the React client

In a second terminal:

```powershell
cd bill-generator-ui
npm install
npm run dev
```

- Dev server: `http://localhost:5173`
- Use **Cart / new bill** (`/cart`) to add items like a shopping cart, then **Generate bill** and **Print** (or open an empty draft from the Bills list).
- The Vite dev server **proxies** `/api` to `http://localhost:5235`, so the UI works even if `VITE_API_URL` is unset. You can still set `VITE_API_URL` in `.env.development` to call the API directly.

## EF Core migrations (optional)

Migrations are applied automatically on API startup. To add a new migration after model changes:

```powershell
dotnet ef migrations add YourMigrationName -p BillGenerator.Infrastructure -s BillGenerator.Api -o Data/Migrations
dotnet ef database update -p BillGenerator.Infrastructure -s BillGenerator.Api
```

## Project layout

- `BillGenerator.Domain` — entities, enums, shared billing math.
- `BillGenerator.Infrastructure` — `AppDbContext`, migrations, seed data.
- `BillGenerator.Api` — REST controllers and services.
- `bill-generator-ui` — Vite React SPA.
