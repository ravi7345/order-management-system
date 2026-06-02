from sqlalchemy.orm import Session

from app.schemas import CustomerCreate
from app.services import customer_service


def create_customer(db: Session, payload: CustomerCreate):
    return customer_service.create_customer(db, payload)


def list_customers(db: Session):
    return customer_service.get_customers(db)


def get_customer(db: Session, customer_id: int):
    return customer_service.get_customer_or_404(db, customer_id)


def delete_customer(db: Session, customer_id: int):
    customer_service.delete_customer(db, customer_id)
