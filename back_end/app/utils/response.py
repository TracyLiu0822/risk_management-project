from typing import Any, Optional

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


def create_response(
    data: Any = None,
    success: bool = True,
    status_code: int = 200,
    message: Optional[str] = None,
) -> JSONResponse:
    payload = {"success": success, "data": data}
    if message:
        payload["message"] = message
    return JSONResponse(status_code=status_code, content=jsonable_encoder(payload))


def error_response(message: str, status_code: int = 400) -> JSONResponse:
    return create_response(
        data=None,
        success=False,
        status_code=status_code,
        message=message,
    )
