from sqlalchemy.orm import Session

from app import models


def create_product(db: Session, product_data: dict) -> models.Product:
    product = models.Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products_query(db: Session):
    return db.query(models.Product).order_by(models.Product.id.desc())


def get_products_paginated(db: Session, page: int, page_size: int) -> tuple[list[models.Product], int]:
    from app.utils.pagination import paginate_query

    return paginate_query(get_products_query(db), page, page_size)


def get_product_by_id(db: Session, product_id: int) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_sku(db: Session, sku: str) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.sku == sku).first()


def delete_product(db: Session, product: models.Product) -> None:
    db.delete(product)
