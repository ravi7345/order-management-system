OPENAPI_TAGS = [
    {
        "name": "Health",
        "description": "Service health and readiness checks.",
    },
    {
        "name": "Products",
        "description": "Create, read, update, and delete products. SKU must be unique.",
    },
    {
        "name": "Customers",
        "description": "Manage customer records. Email must be unique.",
    },
    {
        "name": "Orders",
        "description": "Create and manage orders. Stock is reduced automatically on order creation.",
    },
    {
        "name": "Dashboard",
        "description": "Summary metrics and low-stock product alerts.",
    },
]

API_DESCRIPTION = """
## Inventory & Order Management API

REST API for managing products, customers, orders, and inventory.

### Business rules
- Product **SKU** must be unique
- Customer **email** must be unique
- Product quantity cannot be negative
- Orders fail when inventory is insufficient
- Order total is calculated automatically by the backend
- Deleting an order restores product stock

### Swagger UI
Interactive API docs are available at **`/docs`**.

### ReDoc
Alternative documentation is available at **`/redoc`**.

### OpenAPI JSON
Machine-readable schema: **`/openapi.json`**
"""
