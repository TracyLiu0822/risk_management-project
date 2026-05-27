# RAG 模块

检索增强生成 (Retrieval-Augmented Generation) 系统，用于优化 AI Agent 的上下文感知能力。

## 概述

RAG 模块实现了文档管理、向量化、语义搜索和上下文检索功能，帮助 AI Agent 基于课程材料生成更准确的响应。

## 目录结构

```
RAG/
├── __init__.py
├── document_processor.py        # 文档处理
├── embedding_engine.py          # 嵌入生成
├── vector_store.py              # 向量存储管理
├── retriever.py                 # 检索引擎
├── rag_pipeline.py              # RAG 处理管道
├── config/
│   └── rag_config.py            # RAG 配置
├── loaders/                     # 文档加载器
│   ├── pdf_loader.py
│   ├── text_loader.py
│   └── markdown_loader.py
├── processors/                  # 文档处理器
│   ├── text_splitter.py
│   ├── cleaner.py
│   └── metadata_extractor.py
└── README.md
```

## 核心组件

### 1. DocumentProcessor (文档处理器)

处理上传的文档，转换为可索引的格式。

**功能**:
- 文件格式识别
- 文本提取
- 元数据提取
- 文本分割

**使用**:
```python
from RAG.document_processor import DocumentProcessor

processor = DocumentProcessor()

# 处理 PDF
doc = await processor.process_pdf("course_material.pdf")
chunks = doc.chunks  # 分割后的文本块
metadata = doc.metadata  # 文档元数据
```

### 2. EmbeddingEngine (嵌入引擎)

将文本转换为向量表示。

**配置**:
```python
# 使用预训练的开源模型
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# 向量维度
EMBEDDING_DIMENSION = 384
```

**使用**:
```python
from RAG.embedding_engine import EmbeddingEngine

engine = EmbeddingEngine()

# 生成嵌入
embedding = await engine.embed_text("什么是系统性风险?")
embeddings = await engine.embed_texts(["文本1", "文本2", "文本3"])
```

### 3. VectorStore (向量存储)

存储和管理文档向量。

**支持的后端**:
- ChromaDB (本地)
- Pinecone (云端)
- FAISS (高性能)

**配置**:
```python
# 选择向量存储
VECTOR_STORE_TYPE = "chroma"  # or "pinecone", "faiss"

# ChromaDB 配置
CHROMA_PERSIST_DIR = "./vector_db"

# Pinecone 配置
PINECONE_INDEX = "course-documents"
PINECONE_API_KEY = "your-api-key"
```

**使用**:
```python
from RAG.vector_store import VectorStore

store = VectorStore()

# 添加文档
await store.add_documents([
    {
        "id": "doc_001",
        "text": "文档内容",
        "metadata": {"source": "chapter_1"}
    }
])

# 搜索相似文档
results = await store.search("系统性风险", top_k=5)
```

### 4. Retriever (检索引擎)

执行语义搜索和上下文检索。

**使用**:
```python
from RAG.retriever import Retriever

retriever = Retriever()

# 检索相关文档
results = await retriever.retrieve(
    query="什么是系统性风险?",
    top_k=3,
    threshold=0.7  # 相似度阈值
)

# 格式化为上下文
context = retriever.format_context(results)
```

### 5. RAGPipeline (RAG 管道)

端到端的 RAG 处理流程。

**流程**:
1. 文档上传
2. 文本分割
3. 嵌入生成
4. 向量存储
5. 查询处理
6. 结果检索和排序

**使用**:
```python
from RAG.rag_pipeline import RAGPipeline

pipeline = RAGPipeline()

# 索引文档
await pipeline.index_document("course_material.pdf")

# 检索上下文
context = await pipeline.retrieve_context(
    query="学生的问题",
    top_k=3
)

# 结果格式化
formatted_context = pipeline.format_for_llm(context)
```

## 数据流

```
上传文档
    ↓
提取文本
    ↓
分割文本
    ↓
生成嵌入
    ↓
存储向量
    ↓
用户查询
    ↓
检索相似文档
    ↓
排序和格式化
    ↓
返回上下文
```

## 今日进展 (2026-05-27)

- 已更新平台提示词以支持基于检索的回答并强制引用来源，相关改动位于 `agents/prompts/tutor_prompt.txt`，提示词现在要求仅使用检索到的上下文并输出来源列表。
- 新增包入口 `RAG/__init__.py`，确保 `RAG` 目录可被 Python 作为包导入。
- 对 `agents/tutor_agent.py`、`RAG/retriever.py` 与提示词文件执行了静态语法检查，未发现语法错误。

下一步建议：

- 将 `RAG` 的索引与检索流程纳入单元测试，验证 `retrieve_context` 的稳定性与边界行为。
- 优化文档分割与重排逻辑，确保返回上下文长度与质量控制。

## 使用示例

### 完整的 RAG 工作流

```python
from RAG.rag_pipeline import RAGPipeline
from fastapi import UploadFile

pipeline = RAGPipeline()

# 1. 上传和索引文档
async def index_course_materials(file: UploadFile):
    await pipeline.index_document(file)
    return {"status": "indexed"}

# 2. 检索课程上下文
async def get_context_for_question(question: str):
    context = await pipeline.retrieve_context(question, top_k=5)
    return {
        "question": question,
        "context": context["formatted"],
        "sources": context["sources"]
    }

# 3. 在 Agent 中使用
from agents.tutor_agent import TutorAgent

async def answer_student_question(question: str):
    # 检索相关上下文
    context = await pipeline.retrieve_context(question)
    
    # 调用 Tutor Agent
    tutor = TutorAgent()
    response = await tutor.answer_question(
        question=question,
        context=context["formatted"]
    )
    
    return response
```

### 文档上传 API

```python
from fastapi import APIRouter, UploadFile, File
from RAG.rag_pipeline import RAGPipeline

router = APIRouter()
pipeline = RAGPipeline()

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    document = await pipeline.index_document(file)
    return {
        "document_id": document.id,
        "filename": document.filename,
        "status": "indexed"
    }

@router.get("/search")
async def search_documents(query: str, limit: int = 5):
    results = await pipeline.retrieve_context(query, top_k=limit)
    return {
        "query": query,
        "results": results["formatted"],
        "count": len(results["sources"])
    }
```

## 配置

在 `config/rag_config.py` 中配置 RAG 参数：

```python
RAG_CONFIG = {
    # 嵌入配置
    "embedding": {
        "model": "sentence-transformers/all-MiniLM-L6-v2",
        "device": "cpu",  # or "cuda" for GPU
    },
    
    # 向量存储配置
    "vector_store": {
        "type": "chroma",  # or "pinecone", "faiss"
        "persist_dir": "./vector_db",
    },
    
    # 检索配置
    "retrieval": {
        "top_k": 5,
        "similarity_threshold": 0.5,
        "rerank": True,  # 是否进行重排
    },
    
    # 文档处理配置
    "processing": {
        "chunk_size": 1000,
        "chunk_overlap": 200,
        "supported_formats": ["pdf", "txt", "md"],
    }
}
```

## 最佳实践

1. **定期更新**: 定期索引新的课程材料
2. **质量检查**: 验证文档的内容质量
3. **性能监控**: 监控检索的速度和相关性
4. **清理过期内容**: 删除过期或不相关的文档
5. **元数据管理**: 为文档添加清晰的元数据标签

## 性能优化

- **批量索引**: 批量处理多个文档以提高效率
- **缓存**: 缓存常见查询的结果
- **异步处理**: 使用异步 I/O 处理文档
- **向量数据库**: 使用优化的向量数据库以加快搜索

## 故障排除

### 索引缓慢
- 检查文档大小
- 调整 `chunk_size` 参数
- 使用 GPU 加速嵌入生成

### 检索结果不相关
- 优化查询表述
- 调整 `similarity_threshold`
- 增加 `top_k` 值

### 内存不足
- 减少 `chunk_size`
- 使用流式处理大文件
- 定期清理向量存储

## 依赖

- langchain >= 0.1.0
- chromadb >= 0.4.0
- sentence-transformers >= 2.2.0
- faiss-cpu >= 1.7.0
- pypdf >= 3.0.0

## 相关文档

- [向量数据库比较](../docs/vector-stores.md)
- [嵌入模型说明](../docs/embeddings.md)
- [API 文档](../docs/rag-api.md)
