from sqlalchemy.orm import Session

from app.schemas import OrderCreate
from app.services import order_service


def create_order(db: Session, payload: OrderCreate):
    return order_service.create_order(db, payload)


def list_orders(db: Session, page: int, page_size: int):
    return order_service.get_orders(db, page, page_size)


def get_order(db: Session, order_id: int):
    return order_service.get_order(db, order_id)


def delete_order(db: Session, order_id: int):
    order_service.delete_order(db, order_id)


def get_dashboard(db: Session):
    return order_service.get_dashboard(db)
