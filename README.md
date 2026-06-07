# Risk Management Platform

面向《金融风险管理》课程的 AI 学习平台。当前版本聚焦一个可以演示和继续扩展的 MVP：

```text
学生注册/登录
→ 基于课程资料提问
→ 本地 RAG 检索
→ AI 或保守摘录回答
→ 保存问题、答案和来源
→ 教师查看学生问答记录
```

> 项目状态更新于 2026-06-07。本文只描述仓库中已经存在并经过核对的功能。

最终部署为一个网页网址：访问 `/` 进入登录前首页，网页和 `/api/v1/...`
接口均由同一个 FastAPI 服务提供。

## 当前状态

### 已完成（P0）

- FastAPI + Next.js 前后端骨架。
- 学生和教师注册、登录、JWT Access/Refresh Token。
- 教师注册码保护，防止公开创建教师账号。
- 学生向 Tutor Agent 提问。
- Markdown/TXT 课程资料本地检索，PDF 上传后转换为文本。
- 回答携带来源和相关度。
- 没有 OpenAI Key 时使用检索片段生成保守回答。
- 配置 OpenAI Key 时调用 Chat Completions。
- 问题、回答和来源保存到 SQLite/PostgreSQL。
- 学生查看自己的问答历史。
- 教师查看全部学生问答历史。
- 登录、注册、学生问答、教师审阅四个最小前端页面。

### 已完成（P1）

- 学生/教师角色权限校验。
- Access Token 自动刷新。
- 统一 API 响应结构。
- Alembic 初始迁移。
- RAG、完整问答闭环和权限边界测试。
- 后端测试覆盖率 71%。
- Python 3.13 兼容依赖范围。
- README、模块状态和项目日志按实际代码更新。

### 尚未实现

- 课程、章节、班级和学习进度数据库模型。
- Quiz、Grading、Teaching 三个 Agent。
- 自动评分、出题和教学分析。
- 前端课程页、进度页和分析仪表板。
- 生产部署、限流、审计日志和监控。
- 语义向量检索。当前生产路径使用本地词法检索；`embedding_engine.py`
  和 `vector_store.py` 是未接入 MVP 的实验代码。

## 技术结构

```text
front_end/                 Next.js 前端
back_end/app/              FastAPI API、服务和 ORM
agents/                    Tutor Agent 和 Prompt
RAG/                       文档处理与本地检索
docs/course_materials/     默认课程资料
migrations/                Alembic 迁移
tests/                     后端自动化测试
docs/PROGRESS.md           当前进度与下一阶段
docs/CHANGELOG.md          变更日志
```

## 本地启动

### 1. 后端

在仓库根目录执行：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r back_end\requirements.txt
Copy-Item .env.example .env
```

修改 `.env`，至少设置：

```env
SECRET_KEY=replace-with-a-random-secret
TEACHER_REGISTRATION_CODE=replace-with-a-private-teacher-code
DATABASE_URL=sqlite+aiosqlite:///./risk_management.db
OPENAI_API_KEY=
```

初始化数据库并启动：

```powershell
.\.venv\Scripts\alembic.exe upgrade head
.\.venv\Scripts\uvicorn.exe --app-dir back_end app.main:app --reload
```

- API：<http://localhost:8000>
- Swagger：<http://localhost:8000/api/docs>
- 健康检查：<http://localhost:8000/health>

### 2. 前端

```powershell
Set-Location front_end
Copy-Item .env.example .env.local
npm install
npm run dev
```

访问 <http://localhost:3000>。

### 3. 构建统一网页平台

```powershell
Set-Location ..
.\scripts\build_platform.ps1
.\.venv\Scripts\uvicorn.exe --app-dir back_end app.main:app --host 0.0.0.0 --port 8000
```

此时用户只访问 <http://localhost:8000/>，无需单独访问前端端口。

## 核心 API

| 方法 | 路径 | 权限 | 状态 |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | 公开 | 已实现 |
| POST | `/api/v1/auth/login` | 公开 | 已实现 |
| POST | `/api/v1/auth/refresh` | Refresh Token | 已实现 |
| GET | `/api/v1/auth/me` | 登录 | 已实现 |
| POST | `/api/v1/students/ask-tutor` | 学生 | 已实现 |
| GET | `/api/v1/students/chat-history` | 学生 | 已实现 |
| GET | `/api/v1/teachers/chat-history` | 教师 | 已实现 |
| POST | `/api/v1/rag/upload-document` | 教师 | 已实现 |
| GET | `/api/v1/rag/search` | 登录 | 已实现 |
| GET | `/api/v1/rag/documents` | 教师 | 已实现 |
| POST | `/api/v1/agents/grading/evaluate` | - | 占位 |
| POST | `/api/v1/agents/quiz/generate` | - | 占位 |
| POST | `/api/v1/agents/teaching/analyze` | - | 占位 |

## 测试

```powershell
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m pytest -q --cov=back_end\app --cov=agents --cov=RAG
```

2026-06-07 的验证结果：

- `8 passed`
- 总覆盖率 `71%`
- Python 静态编译检查通过
- Alembic `upgrade head` 通过
- FastAPI 应用成功加载 43 条路由
- FastAPI 静态网页托管、前端页面路由和 API 优先级测试通过
- 前端代码已完成；本次环境未获 npm 联网权限，因此尚未执行构建验证

## 开发约定

- 当前阶段不要并行扩展四个 Agent，先保持 Tutor 闭环稳定。
- 新功能必须包含路由、服务、权限、测试和文档。
- README 中规划中的能力必须标记为“占位”或“未实现”。
- 课程资料放入 `docs/course_materials/`，支持 `.md` 和 `.txt`。
- 教师通过 API 上传 PDF 时，系统会提取文本后参与检索。

进一步信息：

- [当前进度](docs/PROGRESS.md)
- [变更日志](docs/CHANGELOG.md)
- [后端说明](back_end/README.md)
- [前端说明](front_end/README.md)
- [Agent 说明](agents/README.md)
- [RAG 说明](RAG/README.md)
- [单网址部署](docs/DEPLOYMENT.md)
