from __future__ import annotations
from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, Field, GenericModel

T = TypeVar("T")


class ChatHistoryCreate(BaseModel):
    question: str
    answer: str


class ChatHistoryResponse(BaseModel):
    id: str
    user_id: str
    question: str
    answer: str
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedResponse(GenericModel, Generic[T]):
    items: list[T] = Field(default_factory=list)
    total: int
    page: int
    size: int
    pages: int
