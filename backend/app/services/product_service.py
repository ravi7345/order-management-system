from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app import models
from app.dao import product_dao
from app.schemas import PaginatedProductsOut, ProductCreate, ProductUpdate
from app.utils.pagination import build_paginated_response


def create_product(db: Session, payload: ProductCreate):
    existing = product_dao.get_product_by_sku(db, payload.sku)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Product SKU already exists."
        )
    return product_dao.create_product(db, payload.model_dump())


def get_products(db: Session, page: int, page_size: int) -> PaginatedProductsOut:
    items, total = product_dao.get_products_paginated(db, page, page_size)
    return PaginatedProductsOut(**build_paginated_response(items, total, page, page_size))


def get_product_or_404(db: Session, product_id: int):
    product = product_dao.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return product


def update_product(db: Session, product_id: int, payload: ProductUpdate):
    product = get_product_or_404(db, product_id)
    incoming = payload.model_dump(exclude_unset=True)

    if "sku" in incoming and incoming["sku"] != product.sku:
        sku_exists = product_dao.get_product_by_sku(db, incoming["sku"])
        if sku_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Product SKU already exists."
            )

    if "quantity_in_stock" in incoming and incoming["quantity_in_stock"] < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product quantity cannot be negative.",
        )

    for field, value in incoming.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int):
    product = get_product_or_404(db, product_id)
    linked_order = (
        db.query(models.OrderItem.id).filter(models.OrderItem.product_id == product_id).first()
    )
    if linked_order:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete product linked to existing orders.",
        )

    product_dao.delete_product(db, product)
    db.commit()
