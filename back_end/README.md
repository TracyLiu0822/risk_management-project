# Risk Management Platform - Backend

## 概述

这是面向《金融风险管理》课程的 AI 学习平台的后端服务。使用 FastAPI 框架构建，提供 RESTful API 接口。

## 技术栈

- **框架**: FastAPI 0.104+
- **异步**: Uvicorn + SQLAlchemy Async
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: SQLAlchemy 2.0+
- **认证**: JWT + Python-jose
- **AI/LLM**: LangChain + OpenAI
- **向量数据库**: ChromaDB / Pinecone
- **测试**: pytest + pytest-asyncio

## 项目结构

```
back_end/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 应用入口
│   ├── config.py               # 环境变量和配置
│   ├── database.py             # 数据库连接和会话管理
│   ├── routers/                # API 路由
│   │   ├── __init__.py
│   │   ├── auth.py             # 认证相关 API
│   │   ├── courses.py          # 课程相关 API
│   │   ├── students.py         # 学生相关 API
│   │   ├── teachers.py         # 教师相关 API
│   │   ├── agents.py           # AI Agent API
│   │   └── rag.py              # RAG 和文档管理 API
│   ├── models/                 # 数据库 ORM 模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── quiz.py
│   │   └── submission.py
│   ├── schemas/                # Pydantic 请求/响应模型
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── course.py
│   │   └── quiz.py
│   ├── services/               # 业务逻辑服务
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── course_service.py
│   │   └── quiz_service.py
│   ├── agents/                 # AI Agent 实现
│   │   ├── __init__.py
│   │   ├── tutor_agent.py
│   │   ├── grading_agent.py
│   │   ├── quiz_agent.py
│   │   └── teaching_agent.py
│   ├── rag/                    # RAG 实现
│   │   ├── __init__.py
│   │   ├── vector_store.py
│   │   ├── retriever.py
│   │   └── document_processor.py
│   ├── utils/                  # 工具函数
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   ├── decorators.py
│   │   └── validators.py
│   └── middleware/             # 中间件
│       ├── __init__.py
│       └── error_handler.py
├── tests/                      # 测试
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_courses.py
│   └── test_agents.py
├── migrations/                 # 数据库迁移脚本
├── requirements.txt            # Python 依赖
├── .env.example                # 环境变量示例
├── README.md                   # 本文件
└── main.py                     # 启动脚本
```

## 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，配置：
# - DATABASE_URL
# - SECRET_KEY
# - OPENAI_API_KEY
# 等其他必要的环境变量
```

### 3. 初始化数据库

```bash
# 使用 Alembic 进行迁移（如果配置了）
alembic upgrade head

# 或者直接运行应用，会自动创建表
```

### 4. 启动开发服务器

```bash
# 方式 1: 直接运行
python -m uvicorn app.main:app --reload

# 方式 2: 使用 main.py
python back_end/main.py

# 访问 API 文档
# Swagger UI: http://localhost:8000/api/docs
# ReDoc: http://localhost:8000/api/redoc
```

## API 文档

### 认证 (Authentication)

- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/refresh` - 刷新 Token
- `POST /api/v1/auth/logout` - 用户登出

### 课程 (Courses)

- `GET /api/v1/courses` - 获取课程列表
- `GET /api/v1/courses/{course_id}` - 获取课程详情
- `GET /api/v1/courses/{course_id}/chapters` - 获取章节列表
- `GET /api/v1/courses/{course_id}/chapters/{chapter_id}` - 获取章节详情

### 学生 (Students)

- `GET /api/v1/students/profile` - 获取学生信息
- `GET /api/v1/students/progress` - 获取学习进度
- `GET /api/v1/students/quiz-history` - 获取测试历史
- `POST /api/v1/students/submit-quiz/{quiz_id}` - 提交测试答案
- `POST /api/v1/students/ask-tutor` - 向 AI 导师提问

### 教师 (Teachers)

- `GET /api/v1/teachers/profile` - 获取教师信息
- `GET /api/v1/teachers/classes` - 获取课程列表
- `GET /api/v1/teachers/class/{class_id}/analytics` - 获取班级分析
- `POST /api/v1/teachers/class/{class_id}/grade-submission/{submission_id}` - 评分

### AI Agent

- `POST /api/v1/agents/tutor/ask` - 导师 Agent
- `POST /api/v1/agents/grading/evaluate` - 评分 Agent
- `POST /api/v1/agents/quiz/generate` - 测试 Agent
- `POST /api/v1/agents/teaching/analyze` - 教学 Agent

### RAG (检索增强生成)

- `POST /api/v1/rag/upload-document` - 上传文档
- `GET /api/v1/rag/search` - 语义搜索
- `GET /api/v1/rag/documents` - 获取文档列表
- `POST /api/v1/rag/retrieve-context` - 获取上下文

## 开发规范

### 代码结构

1. **路由层** (`routers/`): 定义 API 端点
2. **服务层** (`services/`): 实现业务逻辑
3. **数据层** (`models/`): 定义 ORM 模型
4. **Agent 层** (`agents/`): AI Agent 实现
5. **RAG 层** (`rag/`): 向量搜索和检索

### 异步编程

所有数据库操作使用异步 SQLAlchemy:

```python
from app.database import get_db

async def endpoint(db: AsyncSession = Depends(get_db)):
    result = await db.execute(...)
    return result
```

### 错误处理

使用 FastAPI 的异常处理:

```python
from fastapi import HTTPException

raise HTTPException(
    status_code=400,
    detail="错误信息"
)
```

### 测试

```bash
# 运行所有测试
pytest

# 运行特定文件
pytest tests/test_auth.py

# 生成覆盖率报告
pytest --cov=app tests/
```

## AI Agent 系统

### Tutor Agent (导师 Agent)
- 功能: 回答学生问题，解释概念
- 输入: 学生问题，课程上下文
- 输出: 详细解答，学习资源

### Grading Agent (评分 Agent)
- 功能: 评估学生作业，给出反馈
- 输入: 学生提交，标准答案
- 输出: 评分，反馈意见

### Quiz Agent (测试 Agent)
- 功能: 生成自适应测试题
- 输入: 章节，难度等级
- 输出: 测试题目，选项

### Teaching Agent (教学 Agent)
- 功能: 分析教学效果，给出建议
- 输入: 班级数据，学生成绩
- 输出: 分析报告，改进建议

## RAG 系统

### 功能
1. 文档上传和索引
2. 语义搜索
3. 向量存储
4. 上下文检索

### 集成流程
- 上传课程材料 → 分割文本 → 生成嵌入 → 存储向量 → 查询和检索

## 部署

### Docker 部署

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 生产环境配置

```bash
# 使用生产数据库 (PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname

# 配置 CORS
CORS_ORIGINS=["https://yourdomain.com"]

# 禁用调试
DEBUG=False

# 使用生产级应用服务器
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## 常见问题

### 数据库连接错误
- 检查 `DATABASE_URL` 环境变量
- 确保数据库服务正在运行

### OpenAI API 错误
- 验证 `OPENAI_API_KEY` 是否正确
- 检查 API 配额是否充足

### CORS 错误
- 确认前端地址在 `CORS_ORIGINS` 列表中

## 贡献指南

1. 创建功能分支: `git checkout -b feature/your-feature`
2. 提交更改: `git commit -am 'Add your feature'`
3. 推送分支: `git push origin feature/your-feature`
4. 创建 Pull Request

## 许可证

© 2024 苏州大学商学院

## 联系方式

- 开发团队: Chen Hanzheng, Liu Yuxuan
- 指导教师: Prof. Liang Liu
