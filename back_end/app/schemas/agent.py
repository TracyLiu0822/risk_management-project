from pydantic import BaseModel, Field


class TutorAskRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=2000)


class TutorSource(BaseModel):
    source_id: str
    title: str
    relevance_score: float


class TutorAskResponse(BaseModel):
    answer: str
    sources: list[TutorSource] = Field(default_factory=list)
    chat_id: str | None = None
