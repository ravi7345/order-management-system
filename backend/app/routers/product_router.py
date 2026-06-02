from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.controllers import product_controller
from app.database import get_db
from app.docs.responses import COMMON_RESPONSES
from app.schemas import ProductCreate, ProductOut, ProductUpdate

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
    response_model=list[ProductOut],
    summary="List products",
    description="Retrieve all products ordered by newest first.",
    responses={200: {"description": "List of products"}},
)
def get_products(db: Session = Depends(get_db)):
    return product_controller.list_products(db)


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
    responses={
        204: {"description": "Product deleted successfully"},
        404: COMMON_RESPONSES[404],
    },
)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product_controller.delete_product(db, product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
