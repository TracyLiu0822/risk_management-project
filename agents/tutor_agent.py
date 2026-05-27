from __future__ import annotations
from pathlib import Path
from typing import Any, Dict, List, Optional

from RAG.retriever import Retriever


class TutorAgent:
    """TutorAgent 负责多轮教学问答的检索增强、上下文拼接与结果解析。"""

    MAX_CONTEXT_CHARS = 11000
    SOURCE_TAG_TEMPLATE = "[{index}]"

    def __init__(
        self,
        llm_service: Any,
        retriever: Retriever,
        prompt_path: Path | str | None = None,
    ) -> None:
        self.llm = llm_service
        self.retriever = retriever
        if prompt_path is None:
            base = Path(__file__).resolve().parent
            prompt_path = base / "prompts" / "tutor_prompt.txt"
        self.prompt_template = Path(prompt_path).read_text(encoding="utf-8")

    def _estimate_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    def _truncate_context(self, fragments: List[str]) -> List[str]:
        selected: List[str] = []
        total_chars = 0
        for fragment in fragments:
            if total_chars + len(fragment) > self.MAX_CONTEXT_CHARS:
                break
            selected.append(fragment)
            total_chars += len(fragment)
        return selected

    def _format_source_list(self, hits: List[Dict[str, Any]]) -> str:
        entries = []
        for index, hit in enumerate(hits, start=1):
            metadata = hit.get("metadata", {})
            source_id = metadata.get("source", "unknown")
            title = metadata.get("title", source_id)
            relevance = hit.get("similarity", 0.0)
            entries.append(f"[{index}] {title} | source_id={source_id} | relevance={relevance:.3f}")
        return "\n".join(entries)

    def _build_context(self, query: str, top_k: int = 5, similarity_threshold: float = 0.3) -> Dict[str, object]:
        retrieval = self.retriever.retrieve(query, top_k=top_k, similarity_threshold=similarity_threshold)
        filtered_hits = retrieval["results"]
        prioritized = sorted(filtered_hits, key=lambda item: item["similarity"], reverse=True)

        fragments = []
        sources: List[Dict[str, object]] = []
        for index, hit in enumerate(prioritized, start=1):
            shot = f"{self.SOURCE_TAG_TEMPLATE.format(index=index)} {hit['content']}"
            fragments.append(shot)
            metadata = hit.get("metadata", {})
            sources.append(
                {
                    "source_id": metadata.get("source", "unknown"),
                    "title": metadata.get("title", metadata.get("source", "unknown")),
                    "relevance_score": round(hit.get("similarity", 0.0), 4),
                }
            )

        truncated = self._truncate_context(fragments)
        return {
            "query": query,
            "context": "\n\n".join(truncated),
            "sources": sources[: len(truncated)],
            "retrieval": retrieval,
        }

    def _build_prompt(self, query: str, context: str, source_list: str) -> str:
        return self.prompt_template.replace("{context}", context).replace("{question}", query).replace(
            "{source_list}", source_list
        )

    async def ask(self, question: str) -> Dict[str, object]:
        retrieval_context = self._build_context(question)
        if not retrieval_context["sources"]:
            return {
                "answer": "当前课程资料未能检索到与该问题直接相关的内容。请尝试更明确地描述问题或询问其他课程模块。",
                "sources": [],
            }

        prompt = self._build_prompt(
            question, retrieval_context["context"], self._format_source_list(retrieval_context["retrieval"]["results"])
        )

        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": question},
        ]

        raw_answer = await self.llm.chat_completion(messages=messages)
        answer_text = self._extract_answer(raw_answer)

        return {
            "answer": answer_text,
            "sources": retrieval_context["sources"],
        }

    def _extract_answer(self, raw_answer: str) -> str:
        return raw_answer.strip()
