# Online Food Ordering System

Production-oriented sample built with React, ASP.NET Core Web API, ASP.NET Core Identity, EF Core Code First, SQL Server, Docker, and Azure DevOps.

## Folder Structure

```text
OnlineFoodOrderingSystem.slnx
src/FoodOrdering.Api
  Controllers, Services, Repositories, Models, Dtos, Data, Middleware
frontend
  src/api, src/components, src/context, src/pages, src/styles
tests/FoodOrdering.Tests
docker-compose.yml
azure-pipelines.yml
```

## Main Features

- JWT authentication with Admin and Customer roles.
- Admin category and food management.
- Customer browse, search, filter, cart, checkout, order history.
- Order status workflow: Pending, Preparing, Delivered.
- HTML invoice endpoint.
- SQL Server persistence through EF Core Code First.
- Docker Compose for API, frontend, and SQL Server.
- Azure DevOps pipeline for restore, build, test, publish, and deploy.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/logout`
- `GET /api/food`
- `GET /api/food/{id}`
- `GET /api/food/categories`
- `POST|PUT|DELETE /api/food` for admins
- `GET|POST|PUT|DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders` for admins
- `PUT /api/orders/{orderId}/status` for admins
- `GET /api/orders/{orderId}/invoice`

## Database Setup

The API uses SQL Server and applies EF Core migrations automatically at startup when running against a relational database. The default local connection string is in `src/FoodOrdering.Api/appsettings.json`.

Seeded admin:

```text
Email: admin@food.local
Password: Admin@123
```

For a real production deployment, replace the JWT key and SQL password with Azure Key Vault or App Service configuration.

## Run Locally Without Docker

1. Start SQL Server locally on port `1433`.
2. Update `ConnectionStrings:DefaultConnection` if your SQL Server credentials differ.
3. Restore and run the API:

```powershell
dotnet restore .\src\FoodOrdering.Api\FoodOrdering.Api.csproj
dotnet run --project .\src\FoodOrdering.Api\FoodOrdering.Api.csproj
```

4. Install and run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

5. Open `http://localhost:5173`.

## Run With Docker

```powershell
docker compose up --build
```

Open:

- Frontend: `http://localhost:8080`
- API Swagger: `http://localhost:5000/swagger`

## Development Steps

1. Create models for `Category`, `FoodItem`, `CartItem`, `Order`, and `OrderDetail`.
2. Add `ApplicationDbContext` inheriting from `IdentityDbContext<ApplicationUser>`.
3. Configure Identity roles and JWT authentication.
4. Build DTOs for requests and responses so entities are not exposed directly.
5. Implement services for auth, food, cart, and orders.
6. Add controllers with proper REST methods and role attributes.
7. Create React pages and Axios API client.
8. Add Dockerfiles and `docker-compose.yml`.
9. Add tests and Azure DevOps pipeline.

## Git Commit Structure

Recommended commit flow:

```text
feat(api): add identity auth and food ordering endpoints
feat(web): add react ordering workflow
test(api): add basic order model tests
chore(devops): add docker and azure pipelines
docs: add setup and architecture guide
```
