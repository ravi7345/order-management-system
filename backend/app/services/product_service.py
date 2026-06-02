from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.dao import product_dao
from app.schemas import ProductCreate, ProductUpdate


def create_product(db: Session, payload: ProductCreate):
    existing = product_dao.get_product_by_sku(db, payload.sku)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Product SKU already exists."
        )
    return product_dao.create_product(db, payload.model_dump())


def get_products(db: Session):
    return product_dao.get_products(db)


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

    for field, value in incoming.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int):
    product = get_product_or_404(db, product_id)
    product_dao.delete_product(db, product)
    db.commit()
