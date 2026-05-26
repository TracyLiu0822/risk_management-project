# Services 模块

后端业务逻辑服务层，实现所有核心业务功能。

## 概述

Services 模块包含所有的业务逻辑实现，与数据库、AI Agent 和外部服务交互。遵循分层架构，将业务逻辑与 API 路由分离。

## 目录结构

```
services/
├── __init__.py
├── auth_service.py             # 认证服务
├── user_service.py             # 用户管理服务
├── course_service.py           # 课程服务
├── student_service.py          # 学生服务
├── teacher_service.py          # 教师服务
├── quiz_service.py             # 测试服务
├── agent_service.py            # Agent 协调服务
├── rag_service.py              # RAG 服务
├── notification_service.py     # 通知服务
├── base_service.py             # 基础服务类
└── README.md
```

## 核心服务

### 1. AuthService (认证服务)

负责用户认证和授权。

**主要方法**:
```python
async def login(email: str, password: str) -> LoginResponse
async def register(data: RegisterRequest) -> User
async def refresh_token(refresh_token: str) -> AccessTokenResponse
async def validate_token(token: str) -> dict
```

**使用场景**:
- 用户登录/注册
- Token 管理
- 权限检查

### 2. CourseService (课程服务)

管理课程、章节和内容。

**主要方法**:
```python
async def get_courses() -> List[Course]
async def get_course(course_id: int) -> Course
async def get_chapters(course_id: int) -> List[Chapter]
async def get_chapter_content(course_id: int, chapter_id: int) -> Chapter
async def mark_chapter_complete(user_id: int, chapter_id: int) -> bool
```

**特点**:
- 课程结构化管理
- 进度追踪
- 内容版本控制

### 3. StudentService (学生服务)

处理学生相关的业务逻辑。

**主要方法**:
```python
async def get_student_profile(student_id: int) -> StudentProfile
async def update_profile(student_id: int, data: dict) -> StudentProfile
async def get_learning_progress(student_id: int) -> LearningProgress
async def get_quiz_history(student_id: int) -> List[QuizResult]
async def submit_quiz(student_id: int, quiz_id: int, answers: dict) -> QuizResult
async def get_learning_feedback(student_id: int) -> LearningFeedback
```

**关键功能**:
- 学习进度管理
- 测试结果处理
- 反馈生成

### 4. TeacherService (教师服务)

处理教师管理功能。

**主要方法**:
```python
async def get_teacher_classes(teacher_id: int) -> List[Class]
async def get_class_analytics(class_id: int) -> ClassAnalytics
async def get_student_list(class_id: int) -> List[StudentInfo]
async def grade_submission(submission_id: int, grade: int, feedback: str) -> bool
async def get_teaching_insights(class_id: int) -> TeachingInsights
```

### 5. QuizService (测试服务)

管理测试和评估。

**主要方法**:
```python
async def create_quiz(course_id: int, chapter_id: int, data: dict) -> Quiz
async def get_quiz(quiz_id: int) -> Quiz
async def submit_answer(quiz_id: int, question_id: int, answer: str) -> bool
async def evaluate_quiz(submission_id: int) -> QuizResult
```

### 6. AgentService (Agent 协调服务)

协调各个 AI Agent 的调用。

**主要方法**:
```python
async def ask_tutor(question: str, context: str) -> TutorResponse
async def grade_assignment(submission: str, rubric: dict) -> GradingResult
async def generate_quiz(topic: str, difficulty: str, count: int) -> List[Question]
async def analyze_teaching(class_id: int) -> TeachingAnalysis
```

### 7. RAGService (RAG 服务)

管理文档索引和语义搜索。

**主要方法**:
```python
async def upload_document(file: UploadFile) -> Document
async def index_document(doc_id: int) -> bool
async def search_documents(query: str, limit: int = 5) -> List[SearchResult]
async def retrieve_context(query: str, top_k: int = 3) -> str
```

## 使用示例

### 在 API 路由中使用 Service

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from services.student_service import StudentService

router = APIRouter()

@router.get("/profile")
async def get_profile(db: AsyncSession = Depends(get_db)):
    service = StudentService(db)
    profile = await service.get_student_profile(user_id=1)
    return profile
```

### 依赖注入

```python
from fastapi import Depends

async def get_student_service(db: AsyncSession = Depends(get_db)) -> StudentService:
    return StudentService(db)

@router.post("/submit-quiz")
async def submit_quiz(
    quiz_id: int,
    answers: dict,
    service: StudentService = Depends(get_student_service)
):
    result = await service.submit_quiz(student_id=1, quiz_id=quiz_id, answers=answers)
    return result
```

## 开发指南

### 创建新的 Service

```python
from services.base_service import BaseService

class CustomService(BaseService):
    async def get_data(self, id: int):
        # 实现查询逻辑
        query = select(Model).where(Model.id == id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def create_data(self, data: dict):
        # 实现创建逻辑
        obj = Model(**data)
        self.db.add(obj)
        await self.db.commit()
        return obj
```

### 错误处理

```python
from fastapi import HTTPException

async def get_user(user_id: int):
    user = await self.db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### 事务管理

```python
async def transfer_data(self, source_id: int, target_id: int):
    try:
        # 执行多个操作
        await self.db.execute(...)
        await self.db.execute(...)
        await self.db.commit()
    except Exception as e:
        await self.db.rollback()
        raise
```

## 最佳实践

1. **单一职责**: 每个 Service 只负责一个域
2. **异步操作**: 使用 async/await 进行异步数据库操作
3. **错误处理**: 提供清晰的错误消息
4. **日志记录**: 记录重要的业务操作
5. **缓存**: 使用缓存提高性能
6. **验证**: 在 Service 层进行数据验证

## 性能优化

- 使用数据库连接池
- 实现查询优化和索引
- 批量操作以减少数据库调用
- 实现缓存策略

## 依赖

- SQLAlchemy >= 2.0
- fastapi >= 0.104
- pydantic >= 2.0
- langchain >= 0.1.0

## 测试

```bash
# 运行服务测试
pytest tests/services/

# 运行特定服务测试
pytest tests/services/test_student_service.py

# 生成覆盖率报告
pytest --cov=services tests/
```

## 相关文档

- [API 文档](../docs/)
- [数据库模型](../database/)
- [错误处理](../docs/error-handling.md)
