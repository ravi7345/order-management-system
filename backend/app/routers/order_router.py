from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.controllers import order_controller
from app.database import get_db
from app.docs.responses import COMMON_RESPONSES
from app.schemas import DashboardOut, OrderCreate, OrderOut, PaginatedOrdersOut

router = APIRouter(tags=["Orders"])


@router.post(
    "/orders",
    response_model=OrderOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create order",
    description=(
        "Create an order for a customer. "
        "Validates inventory, calculates total amount, and reduces stock automatically."
    ),
    responses={
        201: {"description": "Order created successfully"},
        400: COMMON_RESPONSES[400],
        404: COMMON_RESPONSES[404],
        422: COMMON_RESPONSES[422],
    },
)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    return order_controller.create_order(db, payload)


@router.get(
    "/orders",
    response_model=PaginatedOrdersOut,
    summary="List orders",
    description="Retrieve orders with customer and line-item details, paginated by newest first.",
    responses={200: {"description": "Paginated list of orders"}},
)
def get_orders(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
):
    return order_controller.list_orders(db, page, page_size)


@router.get(
    "/orders/{order_id}",
    response_model=OrderOut,
    summary="Get order by ID",
    responses={
        200: {"description": "Order details"},
        404: COMMON_RESPONSES[404],
    },
)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return order_controller.get_order(db, order_id)


@router.delete(
    "/orders/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel order",
    description="Delete an order and restore product stock for all line items.",
    responses={
        204: {"description": "Order canceled successfully"},
        404: COMMON_RESPONSES[404],
    },
)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order_controller.delete_order(db, order_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/dashboard",
    response_model=DashboardOut,
    tags=["Dashboard"],
    summary="Dashboard summary",
    description="Returns totals for products, customers, orders, and low-stock products (≤ 5 units).",
    responses={200: {"description": "Dashboard metrics"}},
)
def get_dashboard(db: Session = Depends(get_db)):
    return order_controller.get_dashboard(db)
