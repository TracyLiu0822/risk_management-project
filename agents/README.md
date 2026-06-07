# Agents

## 当前实现

只有 `TutorAgent` 已实现并接入业务。

Tutor Agent 的职责：

- 调用 `RAG.Retriever` 获取课程片段。
- 截断上下文，避免提示词无限增长。
- 为片段生成 `[1]`、`[2]` 引用映射。
- 有 OpenAI Key 时调用 LLM。
- 没有 Key 时返回带来源的保守摘录。
- 检索不到内容时明确拒绝推测。

Prompt：`agents/prompts/tutor_prompt.txt`

## 尚未实现

- Grading Agent
- Quiz Agent
- Teaching Agent

对应 API 仍返回占位内容，`/api/v1/agents/status` 将它们标记为 `planned`，不得在文档或 UI 中宣称已可用。

## 2026-06-07 开发日志

- 修复构造 Tutor Agent 时缺少 Retriever 的运行时错误。
- 修复 Prompt 中文乱码。
- 增加无 API Key 降级路径。
- 增加来源和相关度输出。
- 增加检索与完整 Tutor 闭环测试。

下一步 Agent 工作不是立即增加新 Agent，而是先建立 Tutor 评测问题集，衡量回答相关性、引用正确率和拒答质量。
