# Production-Ready Inventory & Order Management System

Full-stack application with:
- **Backend:** FastAPI + SQLAlchemy
- **Frontend:** React (Vite)
- **Database:** PostgreSQL
- **Containers:** Docker + Docker Compose

## Backend Layered Architecture

`backend/app` is segregated as requested:
- `controllers/` - request orchestration layer
- `dao/` - data-access layer (DB queries)
- `services/` - business logic and validations
- `routers/` - API routes/endpoints

## Implemented APIs

### Products
- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Customers
- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

### Orders
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

### Dashboard
- `GET /dashboard`

## Business Rules Enforced

- Unique product SKU
- Unique customer email
- Product quantity cannot be negative
- Prevent order creation if inventory is insufficient
- Auto-decrease stock on order creation
- Auto-calculate total order amount in backend
- Restock order quantities if order is deleted
- Validation and proper HTTP status codes for API errors

## Run Locally with Docker Compose

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Start all services (pulls images from Docker Hub):
   ```bash
   docker compose pull
   docker compose up
   ```
3. Access:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`
   - OpenAPI JSON: `http://localhost:8000/openapi.json`

## Free Deployment Plan

- Backend: deploy `backend/` on **Render**, **Railway**, or **Fly.io**
- Frontend: deploy `frontend/` on **Vercel** or **Netlify**
- Database: use managed PostgreSQL (Render/Railway free tier)
- Set env vars from `.env.example`
- Set frontend `VITE_API_BASE_URL` to deployed backend URL

## Docker Hub Images

- Backend: `ravitailor777/backend:1.0`
- Frontend: `ravitailor777/frontend:1.0`

Build and push (when updating images):

```bash
docker build -t ravitailor777/backend:1.0 ./backend
docker build --build-arg VITE_API_BASE_URL=http://localhost:8000 -t ravitailor777/frontend:1.0 ./frontend

docker push ravitailor777/backend:1.0
docker push ravitailor777/frontend:1.0
```

## Submission Checklist

- GitHub repo URL
- Docker Hub backend image: `https://hub.docker.com/r/ravitailor777/backend`
- Live frontend URL
- Live backend URL

