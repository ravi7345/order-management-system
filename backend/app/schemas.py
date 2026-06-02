from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ErrorResponse(BaseModel):
    detail: str | list = Field(
        ...,
        description="Error message or list of validation errors.",
        examples=["Product not found."],
    )


class HealthResponse(BaseModel):
    status: str = Field(..., examples=["ok"])


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120, examples=["Wireless Mouse"])
    sku: str = Field(..., min_length=1, max_length=60, examples=["WM-001"])
    price: float = Field(..., gt=0, examples=[29.99])
    quantity_in_stock: int = Field(..., ge=0, examples=[100])


class ProductCreate(ProductBase):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "Wireless Mouse",
                    "sku": "WM-001",
                    "price": 29.99,
                    "quantity_in_stock": 100,
                }
            ]
        }
    )


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120, examples=["Wireless Mouse Pro"])
    sku: str | None = Field(default=None, min_length=1, max_length=60, examples=["WM-001-PRO"])
    price: float | None = Field(default=None, gt=0, examples=[34.99])
    quantity_in_stock: int | None = Field(default=None, ge=0, examples=[85])

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [{"name": "Wireless Mouse Pro", "price": 34.99, "quantity_in_stock": 85}]
        }
    )


class ProductOut(ProductBase):
    id: int = Field(..., examples=[1])
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedProductsOut(BaseModel):
    items: list[ProductOut]
    total: int = Field(..., ge=0, examples=[42])
    page: int = Field(..., ge=1, examples=[1])
    page_size: int = Field(..., ge=1, examples=[10])
    total_pages: int = Field(..., ge=0, examples=[5])


class CustomerCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=120, examples=["Jane Doe"])
    email: EmailStr = Field(..., examples=["jane.doe@example.com"])
    phone_number: str = Field(..., min_length=6, max_length=20, examples=["+1-555-0100"])

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "full_name": "Jane Doe",
                    "email": "jane.doe@example.com",
                    "phone_number": "+1-555-0100",
                }
            ]
        }
    )


class CustomerOut(CustomerCreate):
    id: int = Field(..., examples=[1])
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedCustomersOut(BaseModel):
    items: list[CustomerOut]
    total: int = Field(..., ge=0, examples=[18])
    page: int = Field(..., ge=1, examples=[1])
    page_size: int = Field(..., ge=1, examples=[10])
    total_pages: int = Field(..., ge=0, examples=[2])


class OrderItemCreate(BaseModel):
    product_id: int = Field(..., gt=0, examples=[1])
    quantity: int = Field(..., gt=0, examples=[2])


class OrderCreate(BaseModel):
    customer_id: int = Field(..., gt=0, examples=[1])
    items: list[OrderItemCreate] = Field(..., min_length=1)

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "customer_id": 1,
                    "items": [{"product_id": 1, "quantity": 2}],
                }
            ]
        }
    )


class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    product_name: str


class OrderOut(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    total_amount: float
    created_at: datetime
    items: list[OrderItemOut]

    model_config = ConfigDict(from_attributes=True)


class PaginatedOrdersOut(BaseModel):
    items: list[OrderOut]
    total: int = Field(..., ge=0, examples=[25])
    page: int = Field(..., ge=1, examples=[1])
    page_size: int = Field(..., ge=1, examples=[10])
    total_pages: int = Field(..., ge=0, examples=[3])


class DashboardOut(BaseModel):
    total_products: int = Field(..., examples=[12])
    total_customers: int = Field(..., examples=[8])
    total_orders: int = Field(..., examples=[25])
    low_stock_products: list[ProductOut]
