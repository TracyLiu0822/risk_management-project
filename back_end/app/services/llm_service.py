from __future__ import annotations
from typing import List, Dict, Any, Optional
import os
import httpx

from app.config import settings


class LLMService:
    """Simple LLM service using OpenAI Chat Completions via HTTPX async client.

    This avoids creating an OpenAI client inside agents and centralizes API calls.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, timeout: int = 30):
        self.api_key = api_key or (os.getenv("OPENAI_API_KEY") or settings.OPENAI_API_KEY)
        self.model = model or settings.OPENAI_MODEL
        self.timeout = timeout
        if isinstance(self.api_key, str) and not self.api_key:
            # allow None for tests, but production requires key
            self.api_key = None

    async def chat_completion(self, messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 800) -> str:
        if not self.api_key:
            raise RuntimeError("OpenAI API key not configured")

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "n": 1,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        # Extract text from response
        choices = data.get("choices") or []
        if not choices:
            return ""
        return choices[0].get("message", {}).get("content", "").strip()

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key)
