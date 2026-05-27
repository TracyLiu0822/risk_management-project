"""PDF 文档处理模块

职责：
- 读取 PDF 文档内容
- 执行文本清洗与规范化
- 采用递归字符分割策略生成重叠文本块
"""

import re
from pathlib import Path
from typing import Dict, List

from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter


class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", " ", ""],
        )

    def load_pdf(self, file_path: str) -> str:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"PDF 文档不存在: {file_path}")

        reader = PdfReader(path)
        pages: List[str] = []
        for page in reader.pages:
            page_text = page.extract_text() or ""
            pages.append(page_text)

        if not pages:
            raise ValueError(f"无法从 PDF 文件中提取文本: {file_path}")

        return "\n\n".join(pages)

    @staticmethod
    def clean_text(text: str) -> str:
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
        text = re.sub(r"\s+\n", "\n", text)
        return text.strip()

    def split_text(self, text: str) -> List[str]:
        return self.text_splitter.split_text(text)

    def process_pdf(self, file_path: str) -> List[Dict[str, object]]:
        raw_text = self.load_pdf(file_path)
        cleaned_text = self.clean_text(raw_text)

        if len(cleaned_text) < 1:
            raise ValueError(f"PDF 文档内容为空: {file_path}")

        chunks = self.split_text(cleaned_text)
        documents = []

        for index, chunk in enumerate(chunks, start=1):
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
