from app.schemas import ErrorResponse

COMMON_RESPONSES = {
    400: {
        "model": ErrorResponse,
        "description": "Bad request — invalid input or business rule violation.",
    },
    404: {
        "model": ErrorResponse,
        "description": "Resource not found.",
    },
    409: {
        "model": ErrorResponse,
        "description": "Conflict — duplicate or conflicting resource.",
    },
    422: {
        "model": ErrorResponse,
        "description": "Validation error — request body or parameters failed validation.",
    },
}
