from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.dao import customer_dao
from app.schemas import CustomerCreate


def create_customer(db: Session, payload: CustomerCreate):
    existing = customer_dao.get_customer_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Customer email already exists."
        )
    return customer_dao.create_customer(db, payload.model_dump())


def get_customers(db: Session):
    return customer_dao.get_customers(db)


def get_customer_or_404(db: Session, customer_id: int):
    customer = customer_dao.get_customer_by_id(db, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
    return customer


def delete_customer(db: Session, customer_id: int):
    customer = get_customer_or_404(db, customer_id)
    customer_dao.delete_customer(db, customer)
    db.commit()
