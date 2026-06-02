from collections import defaultdict

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.dao import customer_dao, order_dao, product_dao
from app.schemas import DashboardOut, OrderCreate, OrderItemOut, OrderOut


def create_order(db: Session, payload: OrderCreate):
    customer = customer_dao.get_customer_by_id(db, payload.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")

    grouped_quantities: dict[int, int] = defaultdict(int)
    for item in payload.items:
        grouped_quantities[item.product_id] += item.quantity

    products_by_id: dict[int, models.Product] = {}
    total_amount = 0.0
    for product_id, qty in grouped_quantities.items():
        product = product_dao.get_product_by_id(db, product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {product_id} not found."
            )
        if product.quantity_in_stock < qty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient inventory for SKU {product.sku}.",
            )
        products_by_id[product_id] = product
        total_amount += product.price * qty

    order = order_dao.create_order(db, payload.customer_id, total_amount)

    for product_id, qty in grouped_quantities.items():
        product = products_by_id[product_id]
        order_dao.add_order_item(db, order.id, product_id, qty, product.price)
        product.quantity_in_stock -= qty

    db.commit()
    return to_order_response(get_order_or_404(db, order.id))


def get_orders(db: Session):
    orders = order_dao.get_orders(db)
    return [to_order_response(order) for order in orders]


def get_order_or_404(db: Session, order_id: int):
    order = order_dao.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
    return order


def get_order(db: Session, order_id: int):
    return to_order_response(get_order_or_404(db, order_id))


def delete_order(db: Session, order_id: int):
    order = get_order_or_404(db, order_id)

    # Restock items when order is canceled/deleted.
    for item in order.items:
        item.product.quantity_in_stock += item.quantity

    order_dao.delete_order(db, order)
    db.commit()


def to_order_response(order: models.Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=[
            OrderItemOut(
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price,
                product_name=item.product.name,
            )
            for item in order.items
        ],
    )


def get_dashboard(db: Session) -> DashboardOut:
    total_products = db.query(func.count(models.Product.id)).scalar() or 0
    total_customers = db.query(func.count(models.Customer.id)).scalar() or 0
    total_orders = db.query(func.count(models.Order.id)).scalar() or 0
    low_stock = (
        db.query(models.Product)
        .filter(models.Product.quantity_in_stock <= 5)
        .order_by(models.Product.quantity_in_stock.asc())
        .all()
    )
    return DashboardOut(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        low_stock_products=low_stock,
    )
