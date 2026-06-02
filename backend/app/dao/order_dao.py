from sqlalchemy.orm import Session, joinedload

from app import models


def create_order(db: Session, customer_id: int, total_amount: float) -> models.Order:
    order = models.Order(customer_id=customer_id, total_amount=total_amount)
    db.add(order)
    db.flush()
    return order


def add_order_item(
    db: Session, order_id: int, product_id: int, quantity: int, unit_price: float
) -> models.OrderItem:
    item = models.OrderItem(
        order_id=order_id, product_id=product_id, quantity=quantity, unit_price=unit_price
    )
    db.add(item)
    return item


def get_orders(db: Session) -> list[models.Order]:
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.customer), joinedload(models.Order.items).joinedload(models.OrderItem.product))
        .order_by(models.Order.id.desc())
        .all()
    )


def get_order_by_id(db: Session, order_id: int) -> models.Order | None:
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.customer), joinedload(models.Order.items).joinedload(models.OrderItem.product))
        .filter(models.Order.id == order_id)
        .first()
    )


def delete_order(db: Session, order: models.Order) -> None:
    db.delete(order)
