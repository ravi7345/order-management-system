from sqlalchemy.orm import Session

from app import models


def create_customer(db: Session, customer_data: dict) -> models.Customer:
    customer = models.Customer(**customer_data)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def get_customers(db: Session) -> list[models.Customer]:
    return db.query(models.Customer).order_by(models.Customer.id.desc()).all()


def get_customer_by_id(db: Session, customer_id: int) -> models.Customer | None:
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()


def get_customer_by_email(db: Session, email: str) -> models.Customer | None:
    return db.query(models.Customer).filter(models.Customer.email == email).first()


def delete_customer(db: Session, customer: models.Customer) -> None:
    db.delete(customer)
