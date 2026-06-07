# Services

实际服务代码位于 `back_end/app/services/`。

| 服务 | 状态 | 说明 |
| --- | --- | --- |
| `auth_service.py` | 已实现 | 密码、Access/Refresh Token |
| `chat_history_service.py` | 已实现 | 保存记录、学生/教师分页 |
| `llm_service.py` | 已实现 | 可选 OpenAI HTTP 调用 |
| `tutor_service.py` | 已实现 | 组装 LLM 与 Retriever |
| `rag_service.py` | 已实现 | 上传、搜索、资料列表 |

旧文档中出现的 Course、Quiz、Notification、Teaching 等 Service 尚不存在。

2026-06-07：完成 Tutor 业务闭环、统一错误响应，并增加权限和集成测试。
