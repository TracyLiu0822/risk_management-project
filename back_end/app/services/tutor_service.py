from __future__ import annotations
from typing import Any

from app.services.llm_service import LLMService
from agents.tutor_agent import TutorAgent


class TutorService:
    """Service layer that instantiates TutorAgent with shared LLM service."""

    def __init__(self, llm: LLMService | None = None):
        self.llm = llm or LLMService()
        self.agent = TutorAgent(llm_service=self.llm)

    async def ask(self, question: str) -> str:
        return await self.agent.ask(question)
