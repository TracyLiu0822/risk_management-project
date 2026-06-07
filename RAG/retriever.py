"""Local course-material retrieval used by the MVP tutor flow."""

from __future__ import annotations

import math
import re
from pathlib import Path
from typing import Any

from app.config import settings


TOKEN_PATTERN = re.compile(r"[\u4e00-\u9fff]|[a-zA-Z0-9_]+")
SUPPORTED_SUFFIXES = {".md", ".txt"}


class Retriever:
    """Index Markdown/text course materials and rank chunks lexically."""

    def __init__(
        self,
        material_dir: str | Path | None = None,
        top_k: int | None = None,
        similarity_threshold: float | None = None,
        chunk_size: int = 1200,
        chunk_overlap: int = 150,
    ) -> None:
        self.material_dir = Path(material_dir or settings.COURSE_MATERIAL_DIR)
        self.top_k = top_k or settings.RAG_TOP_K
        self.similarity_threshold = (
            similarity_threshold
            if similarity_threshold is not None
            else settings.RAG_MIN_SCORE
        )
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    @staticmethod
    def _tokens(text: str) -> set[str]:
        return {token.lower() for token in TOKEN_PATTERN.findall(text)}

    def _split_text(self, text: str) -> list[str]:
        paragraphs = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
        chunks: list[str] = []
        current = ""

        for paragraph in paragraphs:
            candidate = f"{current}\n\n{paragraph}".strip()
            if current and len(candidate) > self.chunk_size:
                chunks.append(current)
                current = f"{current[-self.chunk_overlap:]}\n\n{paragraph}".strip()
            else:
                current = candidate

        if current:
            chunks.append(current)
        return chunks

    def _documents(self) -> list[dict[str, Any]]:
        if not self.material_dir.exists():
            return []

        documents: list[dict[str, Any]] = []
        for path in sorted(self.material_dir.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in SUPPORTED_SUFFIXES:
                continue

            text = path.read_text(encoding="utf-8")
            for index, chunk in enumerate(self._split_text(text), start=1):
                documents.append(
                    {
                        "id": f"{path.name}:{index}",
                        "content": chunk,
                        "metadata": {
                            "source": str(path.relative_to(self.material_dir)),
                            "title": path.stem.replace("_", " "),
                            "chunk_index": index,
                        },
                    }
                )
        return documents

    def _score(self, query: str, content: str) -> float:
        query_tokens = self._tokens(query)
        content_tokens = self._tokens(content)
        if not query_tokens or not content_tokens:
            return 0.0

        overlap = query_tokens & content_tokens
        coverage = len(overlap) / len(query_tokens)
        precision = len(overlap) / math.sqrt(len(content_tokens))
        phrase_bonus = 0.2 if query.lower() in content.lower() else 0.0
        return min(1.0, coverage * 0.75 + precision * 0.25 + phrase_bonus)

    def retrieve(
        self,
        query: str,
        top_k: int | None = None,
        similarity_threshold: float | None = None,
    ) -> dict[str, object]:
        selected_top_k = top_k or self.top_k
        threshold = (
            similarity_threshold
            if similarity_threshold is not None
            else self.similarity_threshold
        )

        ranked: list[dict[str, Any]] = []
        for document in self._documents():
            similarity = self._score(query, document["content"])
            if similarity >= threshold:
                ranked.append({**document, "similarity": similarity})

        ranked.sort(key=lambda item: item["similarity"], reverse=True)
        results = ranked[:selected_top_k]
        context = "\n\n---\n\n".join(
            f"来源: {item['metadata']['source']} | "
            f"相关度: {item['similarity']:.3f}\n{item['content']}"
            for item in results
        )

        return {
            "query": query,
            "top_k": selected_top_k,
            "similarity_threshold": threshold,
            "results": results,
            "context": context,
        }
