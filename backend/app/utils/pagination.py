import math
from typing import Any


def paginate_query(query, page: int, page_size: int) -> tuple[list[Any], int]:
    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    return items, total


def build_paginated_response(items: list[Any], total: int, page: int, page_size: int) -> dict:
    total_pages = math.ceil(total / page_size) if total else 0
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }
