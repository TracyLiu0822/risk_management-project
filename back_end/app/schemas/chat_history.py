from __future__ import annotations
from datetime import datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ChatHistoryCreate(BaseModel):
    question: str
    answer: str


class ChatHistoryResponse(BaseModel):
    id: str
    user_id: str
    student_email: str | None = None
    question: str
    answer: str
    sources: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T] = Field(default_factory=list)
    total: int
    page: int
    size: int
    pages: int
