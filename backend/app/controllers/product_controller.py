from sqlalchemy.orm import Session

from app.schemas import ProductCreate, ProductUpdate
from app.services import product_service


def create_product(db: Session, payload: ProductCreate):
    return product_service.create_product(db, payload)


def list_products(db: Session):
    return product_service.get_products(db)


def get_product(db: Session, product_id: int):
    return product_service.get_product_or_404(db, product_id)


def update_product(db: Session, product_id: int, payload: ProductUpdate):
    return product_service.update_product(db, product_id, payload)


def delete_product(db: Session, product_id: int):
    product_service.delete_product(db, product_id)
