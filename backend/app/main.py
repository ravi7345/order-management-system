from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.docs.openapi import API_DESCRIPTION, OPENAPI_TAGS
from app.routers import customer_router, order_router, product_router
from app.schemas import HealthResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory & Order Management API",
    description=API_DESCRIPTION,
    version="1.0.0",
    openapi_tags=OPENAPI_TAGS,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "Inventory API Support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    response_model=HealthResponse,
    responses={200: {"description": "Service is running"}},
)
def health_check():
    """Returns service health status."""
    return {"status": "ok"}


app.include_router(product_router.router)
app.include_router(customer_router.router)
app.include_router(order_router.router)
