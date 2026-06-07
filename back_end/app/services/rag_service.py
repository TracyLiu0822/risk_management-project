from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.config import settings
from RAG.document_processor import DocumentProcessor
from RAG.retriever import Retriever


class RAGService:
    """Manage local course materials used by the MVP retriever."""

    ALLOWED_SUFFIXES = {".md", ".txt", ".pdf"}

    def __init__(self, material_dir: str | Path | None = None) -> None:
        self.material_dir = Path(material_dir or settings.COURSE_MATERIAL_DIR)
        self.material_dir.mkdir(parents=True, exist_ok=True)

    async def upload_document(self, file: UploadFile) -> dict[str, object]:
        original_name = Path(file.filename or "document").name
        suffix = Path(original_name).suffix.lower()
        if suffix not in self.ALLOWED_SUFFIXES:
            raise ValueError("Only PDF, Markdown, and text files are supported")

        document_id = uuid4().hex
        raw = await file.read()
        if not raw:
            raise ValueError("Uploaded document is empty")

        if suffix == ".pdf":
            pdf_path = self.material_dir / f"{document_id}.pdf"
            pdf_path.write_bytes(raw)
            chunks = DocumentProcessor().process_pdf(str(pdf_path))
            text_path = self.material_dir / f"{document_id}-{Path(original_name).stem}.txt"
            text_path.write_text(
                "\n\n".join(chunk["content"] for chunk in chunks),
                encoding="utf-8",
            )
            pdf_path.unlink(missing_ok=True)
            stored_path = text_path
        else:
            stored_path = self.material_dir / f"{document_id}-{original_name}"
            text = raw.decode("utf-8")
            stored_path.write_text(text, encoding="utf-8")

        return {
            "document_id": document_id,
            "filename": original_name,
            "stored_name": stored_path.name,
            "status": "indexed",
        }

    def search(self, query: str, limit: int = 5) -> dict[str, object]:
        return Retriever(material_dir=self.material_dir).retrieve(query, top_k=limit)

    def list_documents(self) -> list[dict[str, object]]:
        return [
            {
                "filename": path.name,
                "size": path.stat().st_size,
                "updated_at": path.stat().st_mtime,
            }
            for path in sorted(self.material_dir.iterdir())
            if path.is_file() and path.suffix.lower() in {".md", ".txt"}
        ]
