from typing import Any, Optional

from fastapi.responses import JSONResponse


def create_response(data: Any = None, success: bool = True, status_code: int = 200) -> JSONResponse:
    payload = {"success": success, "data": data}
    return JSONResponse(status_code=status_code, content=payload)


def error_response(message: str, status_code: int = 400) -> JSONResponse:
    return create_response(data={"message": message}, success=False, status_code=status_code)
