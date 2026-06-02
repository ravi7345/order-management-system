from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.controllers import customer_controller
from app.database import get_db
from app.docs.responses import COMMON_RESPONSES
from app.schemas import CustomerCreate, CustomerOut

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post(
    "",
    response_model=CustomerOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create customer",
    description="Create a new customer. Email must be unique.",
    responses={
        201: {"description": "Customer created successfully"},
        409: COMMON_RESPONSES[409],
        422: COMMON_RESPONSES[422],
    },
)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    return customer_controller.create_customer(db, payload)


@router.get(
    "",
    response_model=list[CustomerOut],
    summary="List customers",
    description="Retrieve all customers ordered by newest first.",
    responses={200: {"description": "List of customers"}},
)
def get_customers(db: Session = Depends(get_db)):
    return customer_controller.list_customers(db)


@router.get(
    "/{customer_id}",
    response_model=CustomerOut,
    summary="Get customer by ID",
    responses={
        200: {"description": "Customer details"},
        404: COMMON_RESPONSES[404],
    },
)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    return customer_controller.get_customer(db, customer_id)


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete customer",
    description="Delete a customer and all associated orders.",
    responses={
        204: {"description": "Customer deleted successfully"},
        404: COMMON_RESPONSES[404],
    },
)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer_controller.delete_customer(db, customer_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
