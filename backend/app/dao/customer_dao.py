from sqlalchemy.orm import Session, joinedload

from app import models


def create_customer(db: Session, customer_data: dict) -> models.Customer:
    customer = models.Customer(**customer_data)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def get_customers_query(db: Session):
    return db.query(models.Customer).order_by(models.Customer.id.desc())


def get_customers_paginated(
    db: Session, page: int, page_size: int
) -> tuple[list[models.Customer], int]:
    from app.utils.pagination import paginate_query

    return paginate_query(get_customers_query(db), page, page_size)


def get_customer_by_id(db: Session, customer_id: int) -> models.Customer | None:
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()


def get_customer_with_orders(db: Session, customer_id: int) -> models.Customer | None:
    return (
        db.query(models.Customer)
        .options(
            joinedload(models.Customer.orders)
            .joinedload(models.Order.items)
            .joinedload(models.OrderItem.product)
        )
        .filter(models.Customer.id == customer_id)
        .first()
    )


def get_customer_by_email(db: Session, email: str) -> models.Customer | None:
    return db.query(models.Customer).filter(models.Customer.email == email).first()


def delete_customer(db: Session, customer: models.Customer) -> None:
    db.delete(customer)
