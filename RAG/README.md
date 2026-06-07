# RAG

## 当前生产路径

当前 MVP 使用无需外部向量数据库的本地检索：

1. 扫描 `docs/course_materials/` 下的 Markdown/TXT。
2. 按段落和字符长度切块。
3. 对中英文 Token 计算词法相关度。
4. 返回 Top K 片段、来源和分数。
5. Tutor Agent 使用这些片段回答。

这个方案便于本地演示和测试，但不是最终语义向量检索。

## 资料管理

- 教师可通过 `POST /api/v1/rag/upload-document` 上传 `.pdf`、`.md`、`.txt`。
- PDF 会提取文本并保存为 TXT。
- 上传文件名会增加随机 ID，避免覆盖。
- 默认资料包含 `risk_management_basics.md`。

## 文件状态

- `retriever.py`：当前已接入。
- `document_processor.py`：当前 PDF 上传使用。
- `embedding_engine.py`：实验代码，未接入。
- `vector_store.py`：实验代码，未接入。

## 2026-06-07 开发日志

- 将 Retriever 改为有默认构造参数的本地实现。
- 增加资料目录配置、文件上传和索引状态。
- 移除文档分块对 LangChain 的强依赖。
- 增加相关与不相关查询测试。

下一步：为资料增加课程/章节元数据，再引入向量检索，并用固定问题集比较词法检索与向量检索效果。
