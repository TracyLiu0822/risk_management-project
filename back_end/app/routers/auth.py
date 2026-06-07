"""Authentication routes: register, login, me"""

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    RefreshTokenRequest,
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
)
from app.services.auth_service import (
    register_user,
    authenticate_user,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.config import settings
from app.utils.response import create_response, error_response

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        if user_in.role == "teacher" and (
            not settings.TEACHER_REGISTRATION_CODE
            or user_in.teacher_code != settings.TEACHER_REGISTRATION_CODE
        ):
            return error_response(
                "Invalid teacher registration code",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        user = await register_user(db, email=user_in.email, password=user_in.password, role=user_in.role)
        user_out = UserResponse.model_validate(user)
        return create_response(data=user_out.model_dump())
    except ValueError as ve:
        return error_response(str(ve), status_code=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return error_response("Registration failed", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, credentials.email, credentials.password)
    if not user:
        return error_response("Invalid credentials", status_code=status.HTTP_401_UNAUTHORIZED)

    access_token = await create_access_token(user_id=user.id, role=user.role)
    refresh_token = await create_refresh_token(user_id=user.id, role=user.role)
    token_resp = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return create_response(data=token_resp.model_dump())


@router.post("/refresh", response_model=dict)
async def refresh(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        token_payload = await verify_token(payload.refresh_token)
    except Exception:
        return error_response("Invalid refresh token", status_code=status.HTTP_401_UNAUTHORIZED)

    if token_payload.get("token_type") != "refresh":
        return error_response("Invalid refresh token", status_code=status.HTTP_401_UNAUTHORIZED)

    user = (
        await db.execute(select(User).where(User.id == token_payload.get("user_id")))
    ).scalar_one_or_none()
    if not user or user.role != token_payload.get("role"):
        return error_response("Invalid refresh token", status_code=status.HTTP_401_UNAUTHORIZED)

    access_token = await create_access_token(
        user_id=user.id,
        role=user.role,
    )
    refresh_token = await create_refresh_token(
        user_id=user.id,
        role=user.role,
    )
    return create_response(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        ).model_dump()
    )


@router.post("/logout", response_model=dict)
async def logout():
    return create_response(data=None, message="Logged out")


@router.get("/me", response_model=dict)
async def me(current_user: User = Depends(get_current_user)):
    user_out = UserResponse.model_validate(current_user)
    return create_response(data=user_out.model_dump())
