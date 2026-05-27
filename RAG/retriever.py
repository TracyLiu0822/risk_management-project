"""检索器模块

职责：
- 执行语义检索
- 根据用户问题生成检索上下文
- 提供可配置的 top_k 和相似度阈值
"""

from typing import Dict, List, Optional

from .embedding_engine import EmbeddingEngine
from .vector_store import VectorStore


class Retriever:
    def __init__(
        self,
        embedding_engine: EmbeddingEngine,
        vector_store: VectorStore,
        top_k: int = 5,
        similarity_threshold: float = 0.3,
    ) -> None:
        self.embedding_engine = embedding_engine
        self.vector_store = vector_store
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold

    def retrieve(self, query: str, top_k: Optional[int] = None, similarity_threshold: Optional[float] = None) -> Dict[str, object]:
        top_k = top_k or self.top_k
        similarity_threshold = similarity_threshold or self.similarity_threshold

        query_embedding = self.embedding_engine.embed_text(query)
        hits = self.vector_store.query(query_embedding, top_k=top_k)
        filtered_hits = [hit for hit in hits if hit["similarity"] >= similarity_threshold]

        context_fragments = []
        for item in filtered_hits:
            metadata = item.get("metadata", {})
            context_fragments.append(
                f"来源: {metadata.get('source', 'unknown')} | chunk_index: {metadata.get('chunk_index')} | similarity: {item['similarity']:.4f}\n{item['content']}"
            )

        return {
            "query": query,
            "top_k": top_k,
            "similarity_threshold": similarity_threshold,
            "results": filtered_hits,
            "context": "\n\n---\n\n".join(context_fragments),
        }
