from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.controllers import product_controller
from app.database import get_db
from app.docs.responses import COMMON_RESPONSES
from app.schemas import PaginatedProductsOut, ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])


@router.post(
    "",
    response_model=ProductOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create product",
    description="Create a new product. SKU must be unique across all products.",
    responses={
        201: {"description": "Product created successfully"},
        409: COMMON_RESPONSES[409],
        422: COMMON_RESPONSES[422],
    },
)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    return product_controller.create_product(db, payload)


@router.get(
    "",
    response_model=PaginatedProductsOut,
    summary="List products",
    description="Retrieve products ordered by newest first with pagination.",
    responses={200: {"description": "Paginated list of products"}},
)
def get_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
):
    return product_controller.list_products(db, page, page_size)


@router.get(
    "/{product_id}",
    response_model=ProductOut,
    summary="Get product by ID",
    responses={
        200: {"description": "Product details"},
        404: COMMON_RESPONSES[404],
    },
)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return product_controller.get_product(db, product_id)


@router.put(
    "/{product_id}",
    response_model=ProductOut,
    summary="Update product",
    description="Update product fields. SKU must remain unique if changed.",
    responses={
        200: {"description": "Product updated successfully"},
        404: COMMON_RESPONSES[404],
        409: COMMON_RESPONSES[409],
        422: COMMON_RESPONSES[422],
    },
)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    return product_controller.update_product(db, product_id, payload)


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete product",
    description="Delete a product. Returns 409 if the product is linked to existing orders.",
    responses={
        204: {"description": "Product deleted successfully"},
        404: COMMON_RESPONSES[404],
        409: COMMON_RESPONSES[409],
    },
)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product_controller.delete_product(db, product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
