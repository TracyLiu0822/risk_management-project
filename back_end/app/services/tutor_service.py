from __future__ import annotations
from app.services.llm_service import LLMService
from agents.tutor_agent import TutorAgent
from RAG.retriever import Retriever


class TutorService:
    """Service layer that instantiates TutorAgent with shared LLM service."""

    def __init__(
        self,
        llm: LLMService | None = None,
        retriever: Retriever | None = None,
    ):
        self.llm = llm or LLMService()
        self.agent = TutorAgent(
            llm_service=self.llm,
            retriever=retriever or Retriever(),
        )

    async def ask(self, question: str) -> dict[str, object]:
        return await self.agent.ask(question)
