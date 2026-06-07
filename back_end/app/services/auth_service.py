from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import anyio

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def hash_password(password: str) -> str:
    return await anyio.to_thread.run_sync(pwd_context.hash, password)


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return await anyio.to_thread.run_sync(pwd_context.verify, plain_password, hashed_password)


async def register_user(db: AsyncSession, email: str, password: str, role: str = "student") -> User:
    # Ensure email uniqueness
    q = select(User).where(User.email == email)
    result = await db.execute(q)
    existing = result.scalar_one_or_none()
    if existing:
        raise ValueError("Email already registered")

    hashed = await hash_password(password)
    user = User(email=email, password_hash=hashed, role=role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    q = select(User).where(User.email == email)
    result = await db.execute(q)
    user = result.scalar_one_or_none()
    # Do not reveal whether email exists — generic failure on mismatch
    if not user:
        return None

    valid = await verify_password(password, user.password_hash)
    if not valid:
        return None

    return user


def _create_token_payload(user_id: str, role: str, expires_delta: timedelta) -> Dict[str, Any]:
    expire = datetime.now(timezone.utc) + expires_delta
    return {
        "user_id": user_id,
        "role": role,
        "token_type": "access",
        "exp": expire
    }


def create_access_token_sync(user_id: str, role: str, expires_minutes: int) -> str:
    payload = _create_token_payload(user_id, role, timedelta(minutes=expires_minutes))
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token


async def create_access_token(user_id: str, role: str, expires_minutes: Optional[int] = None) -> str:
    expires = expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    # encoding is CPU-light; keep sync for jose
    return await anyio.to_thread.run_sync(create_access_token_sync, user_id, role, expires)


def create_refresh_token_sync(user_id: str, role: str, expires_days: int) -> str:
    payload = _create_token_payload(user_id, role, timedelta(days=expires_days))
    payload["token_type"] = "refresh"
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def create_refresh_token(user_id: str, role: str) -> str:
    return await anyio.to_thread.run_sync(
        create_refresh_token_sync,
        user_id,
        role,
        settings.REFRESH_TOKEN_EXPIRE_DAYS,
    )


def verify_token_sync(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        raise


async def verify_token(token: str) -> Dict[str, Any]:
    return await anyio.to_thread.run_sync(verify_token_sync, token)
