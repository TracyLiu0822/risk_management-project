# Backend

FastAPI 后端，负责认证、权限、Tutor 问答、RAG 资料管理和聊天记录。

生产部署时，后端还负责托管 `front_end/out`，因此打开后端根网址就是平台首页。

## 已实现

- `auth`：注册、登录、刷新 Token、当前用户、退出。
- `students`：Tutor 提问、本人聊天历史。
- `teachers`：全部学生聊天历史。
- `rag`：资料上传、资料列表、搜索、上下文检索、索引状态。
- `agents/tutor`：与学生 Tutor 接口相同的问答闭环。
- 异步 SQLAlchemy、SQLite/PostgreSQL、Alembic。

课程、进度、测验和教学分析路由仍是占位接口。

## 分层

```text
app/main.py             应用入口
app/routers/            HTTP 路由和权限
app/services/           业务逻辑
app/models/             SQLAlchemy 模型
app/schemas/            Pydantic 输入输出
app/dependencies.py     当前用户和角色依赖
```

## 启动

从仓库根目录：

```powershell
.\.venv\Scripts\alembic.exe upgrade head
.\.venv\Scripts\uvicorn.exe --app-dir back_end app.main:app --reload
```

生产网页模式：

```powershell
.\scripts\build_platform.ps1
.\.venv\Scripts\uvicorn.exe --app-dir back_end app.main:app --host 0.0.0.0 --port 8000
```

静态网页目录由 `FRONTEND_DIST_DIR` 配置，默认是 `front_end/out`。

## 认证约定

- API 使用 `Authorization: Bearer <access_token>`。
- Access Token 默认 30 分钟。
- Refresh Token 默认 7 天。
- 教师注册必须提供 `.env` 中的 `TEACHER_REGISTRATION_CODE`。
- 当前 Refresh Token 未做服务端撤销，属于 MVP 实现。

## 问答事务

`POST /api/v1/students/ask-tutor` 执行：

1. 验证学生身份。
2. 检索课程资料。
3. 调用 OpenAI 或生成降级回答。
4. 在同一请求内保存问题、答案和来源。
5. 返回 `answer`、`sources` 和 `chat_id`。

## 测试日志

2026-06-07：

- `pytest -q`：8 passed。
- 覆盖率：71%。
- 应用加载：42 routes。
- Alembic `upgrade head`：通过。
- 根首页、登录页面、静态资源以及 API 路由优先级测试通过。

下一步后端重点：课程/班级模型、班级级权限隔离、上传资料元数据。
