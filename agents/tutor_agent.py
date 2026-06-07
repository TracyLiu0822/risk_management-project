from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

from RAG.retriever import Retriever


class TutorAgent:
    """Answer course questions with retrieved context and source citations."""

    MAX_CONTEXT_CHARS = 11000
    SOURCE_TAG_TEMPLATE = "[{index}]"

    def __init__(
        self,
        llm_service: Any,
        retriever: Retriever | None = None,
        prompt_path: Path | str | None = None,
    ) -> None:
        self.llm = llm_service
        self.retriever = retriever or Retriever()
        if prompt_path is None:
            base = Path(__file__).resolve().parent
            prompt_path = base / "prompts" / "tutor_prompt.txt"
        self.prompt_template = Path(prompt_path).read_text(encoding="utf-8")

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
            entries.append(
                f"[{index}] {title} | source_id={source_id} | "
                f"relevance={relevance:.3f}"
            )
        return "\n".join(entries)

    def _build_context(
        self,
        query: str,
        top_k: int = 5,
        similarity_threshold: float = 0.05,
    ) -> Dict[str, object]:
        retrieval = self.retriever.retrieve(
            query,
            top_k=top_k,
            similarity_threshold=similarity_threshold,
        )
        prioritized = sorted(
            retrieval["results"],
            key=lambda item: item["similarity"],
            reverse=True,
        )

        fragments = []
        sources: List[Dict[str, object]] = []
        for index, hit in enumerate(prioritized, start=1):
            fragments.append(
                f"{self.SOURCE_TAG_TEMPLATE.format(index=index)} {hit['content']}"
            )
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
        return (
            self.prompt_template.replace("{context}", context)
            .replace("{question}", query)
            .replace("{source_list}", source_list)
        )

    async def ask(self, question: str) -> Dict[str, object]:
        retrieval_context = self._build_context(question)
        if not retrieval_context["sources"]:
            return {
                "answer": (
                    "当前课程资料中没有检索到与该问题直接相关的内容。"
                    "请换一种更具体的表述，或请教师补充相应课程资料。"
                ),
                "sources": [],
            }

        hits = retrieval_context["retrieval"]["results"]
        if getattr(self.llm, "is_configured", False):
            prompt = self._build_prompt(
                question,
                retrieval_context["context"],
                self._format_source_list(hits),
            )
            raw_answer = await self.llm.chat_completion(
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": question},
                ]
            )
            answer_text = raw_answer.strip()
        else:
            answer_text = self._build_extract_answer(question, hits)

        return {
            "answer": answer_text,
            "sources": retrieval_context["sources"],
        }

    @staticmethod
    def _build_extract_answer(question: str, hits: List[Dict[str, Any]]) -> str:
        excerpts = []
        for index, hit in enumerate(hits[:3], start=1):
            content = " ".join(hit["content"].split())
            excerpts.append(f"[{index}] {content[:360]}")

        return (
            f"根据当前课程资料，关于“{question}”可以先从以下内容理解：\n\n"
            + "\n\n".join(excerpts)
            + "\n\n以上回答仅依据已检索到的课程资料整理。"
        )
