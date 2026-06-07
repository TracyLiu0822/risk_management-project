"""PDF extraction and deterministic text chunking."""

import re
from pathlib import Path
from typing import Dict, List

from pypdf import PdfReader


class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200) -> None:
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be smaller than chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def load_pdf(self, file_path: str) -> str:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"PDF document does not exist: {file_path}")

        pages = [(page.extract_text() or "") for page in PdfReader(path).pages]
        text = "\n\n".join(pages).strip()
        if not text:
            raise ValueError(f"No text could be extracted from PDF: {file_path}")
        return text

    @staticmethod
    def clean_text(text: str) -> str:
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
        return re.sub(r"\s+\n", "\n", text).strip()

    def split_text(self, text: str) -> List[str]:
        if not text:
            return []

        chunks = []
        start = 0
        while start < len(text):
            end = min(len(text), start + self.chunk_size)
            if end < len(text):
                split_at = max(text.rfind("\n", start, end), text.rfind("。", start, end))
                if split_at > start:
                    end = split_at + 1
            chunks.append(text[start:end].strip())
            if end >= len(text):
                break
            start = max(start + 1, end - self.chunk_overlap)
        return [chunk for chunk in chunks if chunk]

    def process_pdf(self, file_path: str) -> List[Dict[str, object]]:
        cleaned_text = self.clean_text(self.load_pdf(file_path))
        documents = []
        for index, chunk in enumerate(self.split_text(cleaned_text), start=1):
            documents.append(
                {
                    "id": f"{Path(file_path).stem}-{index}",
                    "content": chunk,
                    "metadata": {
                        "source": str(file_path),
                        "chunk_index": index,
                        "chunk_size": len(chunk),
                    },
                }
            )
        return documents
