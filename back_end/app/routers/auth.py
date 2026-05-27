"""Authentication routes: register, login, me"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.auth import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import (
    register_user,
    authenticate_user,
    create_access_token,
)
from app.config import settings
from app.utils.response import create_response, error_response

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        user = await register_user(db, email=user_in.email, password=user_in.password, role=user_in.role)
        user_out = UserResponse.from_orm(user)
        return create_response(data=user_out.model_dump())
    except ValueError as ve:
        return error_response(str(ve), status_code=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return error_response("Registration failed", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, credentials.email, credentials.password)
    if not user:
        return error_response("Invalid credentials", status_code=status.HTTP_401_UNAUTHORIZED)

    token = await create_access_token(user_id=user.id, role=user.role)
    token_resp = TokenResponse(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return create_response(data=token_resp.model_dump())


@router.get("/me", response_model=dict)
async def me(current_user: User = Depends(get_current_user)):
    user_out = UserResponse.from_orm(current_user)
    return create_response(data=user_out.model_dump())
