from sqlalchemy.orm import Session

from app import models


def create_product(db: Session, product_data: dict) -> models.Product:
    product = models.Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products(db: Session) -> list[models.Product]:
    return db.query(models.Product).order_by(models.Product.id.desc()).all()


def get_product_by_id(db: Session, product_id: int) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_sku(db: Session, sku: str) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.sku == sku).first()


def delete_product(db: Session, product: models.Product) -> None:
    db.delete(product)
