# Docker Run Instructions

## Prerequisites
- Docker Desktop installed
- Docker Compose enabled

## Build and run both services
```powershell
docker compose up --build
```

## Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5183/api/dashboard

## Stop the containers
```powershell
docker compose down
```

## Build individual images
```powershell
docker build -t logistics-api ./LogisticsAPI
docker build -t logistics-ui ./logisticsui
```

## Run individual containers
```powershell
docker run --rm -p 5183:8080 logistics-api
docker run --rm -p 3000:80 logistics-ui
```
