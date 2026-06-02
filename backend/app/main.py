from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.exc import IntegrityError

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
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,
        "displayRequestDuration": True,
        "docExpansion": "list",
        "filter": True,
        "persistAuthorization": True,
        "tryItOutEnabled": True,
    },
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


@app.exception_handler(IntegrityError)
async def integrity_error_handler(_request: Request, _exc: IntegrityError):
    return JSONResponse(
        status_code=409,
        content={"detail": "Duplicate or conflicting record."},
    )


@app.get("/", include_in_schema=False)
def root():
    """Redirect root URL to Swagger UI."""
    return RedirectResponse(url="/docs")


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
