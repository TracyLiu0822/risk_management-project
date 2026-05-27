from pydantic import BaseModel


class TutorAskRequest(BaseModel):
    question: str
