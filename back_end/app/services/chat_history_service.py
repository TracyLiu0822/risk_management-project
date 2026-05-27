from math import ceil
from typing import Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat_history import ChatHistory
from app.schemas.chat_history import ChatHistoryResponse, PaginatedResponse


class ChatService:
    """Chat history business layer for asynchronous storage and pagination."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chat_history(self, user_id: str, question: str, answer: str) -> ChatHistory:
        chat = ChatHistory(user_id=user_id, question=question, answer=answer)
        self.db.add(chat)
        await self.db.commit()
        await self.db.refresh(chat)
        return chat

    async def get_user_chat_history(self, user_id: str, page: int = 1, size: int = 20) -> PaginatedResponse[ChatHistoryResponse]:
        offset = (page - 1) * size
        query = (
            select(ChatHistory)
            .where(ChatHistory.user_id == user_id)
            .order_by(ChatHistory.created_at.desc())
            .offset(offset)
            .limit(size)
        )

        total_query = select(func.count()).select_from(ChatHistory).where(ChatHistory.user_id == user_id)

        result = await self.db.execute(query)
        items = result.scalars().all()

        count_result = await self.db.execute(total_query)
        total = count_result.scalar_one() or 0
        pages = ceil(total / size) if total else 1

        return PaginatedResponse[
            ChatHistoryResponse
        ](
            items=[ChatHistoryResponse.from_orm(item) for item in items],
            total=total,
            page=page,
            size=size,
            pages=pages,
        )
