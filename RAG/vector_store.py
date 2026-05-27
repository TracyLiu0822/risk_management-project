"""向量存储层模块

职责：
- 负责 ChromaDB 集合初始化
- 支持批量写入文档向量
- 支持基于元数据筛选和相似度查询
"""

import os
from typing import Any, Dict, List, Optional

import chromadb
from chromadb.config import Settings


class VectorStore:
    def __init__(self, persist_directory: Optional[str] = None, collection_name: str = "rag_documents") -> None:
        self.persist_directory = persist_directory or os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
        self.collection_name = collection_name
        self.client = chromadb.Client(
            Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=self.persist_directory,
                anonymized_telemetry=False,
            )
        )
        self.collection = self.client.get_or_create_collection(name=self.collection_name)

    def add_documents(self, documents: List[Dict[str, Any]], embeddings: List[List[float]]) -> None:
        if len(documents) != len(embeddings):
            raise ValueError("documents 和 embeddings 长度必须一致")

        ids = [doc["id"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]
        texts = [doc["content"] for doc in documents]

        self.collection.add(
            ids=ids,
            documents=texts,
            metadatas=metadatas,
            embeddings=embeddings,
        )
        self.client.persist()

    def query(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        metadata_filter: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=metadata_filter,
        )

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]
        ids = results.get("ids", [[]])[0]

        items: List[Dict[str, Any]] = []
        for doc_id, document, metadata, distance in zip(ids, documents, metadatas, distances):
            similarity = 1.0 - distance if distance is not None else 0.0
            items.append(
                {
                    "id": doc_id,
                    "content": document,
                    "metadata": metadata,
                    "distance": distance,
                    "similarity": max(0.0, min(similarity, 1.0)),
                }
            )

        return items
