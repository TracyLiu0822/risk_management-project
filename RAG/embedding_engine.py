"""嵌入生成模块

职责：
- 读取 OpenAI API Key
- 调用 OpenAI Embeddings API
- 批量生成文本向量
"""

import os
from typing import List, Optional

import openai


class EmbeddingEngine:
    def __init__(self, api_key: Optional[str] = None, model: str = "text-embedding-3-small") -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY 环境变量未设置")

        self.model = model
        openai.api_key = self.api_key

    def embed_text(self, text: str) -> List[float]:
        embeddings = self.embed_texts([text])
        return embeddings[0]

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []

        response = openai.Embedding.create(model=self.model, input=texts)
        data = response.get("data", [])
        return [item["embedding"] for item in data]
