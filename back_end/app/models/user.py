import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str):
    STUDENT = "student"
    TEACHER = "teacher"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole.STUDENT, UserRole.TEACHER, name="user_roles"), nullable=False, default=UserRole.STUDENT)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def set_password(self, password: str, hash_func) -> None:
        """Set password hash using provided hash function (sync or async wrapper)."""
        self.password_hash = hash_func(password)

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
