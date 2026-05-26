# Database 模块

数据库模型和数据持久化层。

## 概述

Database 模块定义了所有的 SQLAlchemy ORM 模型，实现了数据表的结构和关系。

## 目录结构

```
database/
├── __init__.py
├── models/                     # ORM 模型
│   ├── __init__.py
│   ├── user.py                 # 用户模型
│   ├── course.py               # 课程模型
│   ├── quiz.py                 # 测试模型
│   ├── submission.py           # 提交模型
│   ├── progress.py             # 进度模型
│   └── rag.py                  # RAG 文档模型
├── migrations/                 # 数据库迁移
├── seeds/                      # 数据初始化
│   └── init_data.py
└── README.md
```

## ORM 模型

### User (用户)

```python
class User(Base):
    __tablename__ = "users"
    
    id: int
    email: str  # 唯一
    password_hash: str
    name: str
    role: str  # "student" or "teacher"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
```

### Course (课程)

```python
class Course(Base):
    __tablename__ = "courses"
    
    id: int
    title: str
    description: str
    instructor_id: int  # 外键
    duration_weeks: int
    cover_image: str
    created_at: datetime
```

### Chapter (章节)

```python
class Chapter(Base):
    __tablename__ = "chapters"
    
    id: int
    course_id: int  # 外键
    title: str
    description: str
    order: int
    created_at: datetime
```

### Section (小节)

```python
class Section(Base):
    __tablename__ = "sections"
    
    id: int
    chapter_id: int  # 外键
    title: str
    content: str
    video_url: str
    order: int
```

### Quiz (测试)

```python
class Quiz(Base):
    __tablename__ = "quizzes"
    
    id: int
    chapter_id: int  # 外键
    title: str
    description: str
    time_limit_minutes: int
    created_at: datetime
```

### Question (题目)

```python
class Question(Base):
    __tablename__ = "questions"
    
    id: int
    quiz_id: int  # 外键
    text: str
    type: str  # "multiple_choice", "short_answer", "essay"
    options: list  # JSON
    correct_answer: str
    order: int
```

### Progress (学习进度)

```python
class Progress(Base):
    __tablename__ = "progress"
    
    id: int
    user_id: int  # 外键
    course_id: int  # 外键
    chapter_id: int  # 外键
    completed: bool
    completion_percentage: float
    last_accessed: datetime
```

### QuizSubmission (测试提交)

```python
class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"
    
    id: int
    quiz_id: int  # 外键
    student_id: int  # 外键
    answers: dict  # JSON
    score: float
    feedback: str
    submitted_at: datetime
```

### Document (RAG 文档)

```python
class Document(Base):
    __tablename__ = "documents"
    
    id: int
    filename: str
    file_path: str
    file_type: str
    file_size: int
    indexed: bool
    created_at: datetime
    metadata: dict  # JSON
```

## 关键关系

```
User
  ├─ 1:N → Course (作为讲师)
  ├─ 1:N → Progress
  └─ 1:N → QuizSubmission

Course
  ├─ 1:N → Chapter
  ├─ 1:N → Progress
  └─ N:1 ← User (讲师)

Chapter
  ├─ 1:N → Section
  ├─ 1:N → Quiz
  └─ 1:N → Progress

Section
  └─ N:1 ← Chapter

Quiz
  ├─ 1:N → Question
  └─ 1:N → QuizSubmission

Question
  └─ N:1 ← Quiz

Progress
  ├─ N:1 ← User
  ├─ N:1 ← Course
  └─ N:1 ← Chapter

QuizSubmission
  ├─ N:1 ← Quiz
  └─ N:1 ← User

Document
  └─ RAG 文档存储
```

## 索引和约束

### 重要索引

```python
# 性能优化索引
Index('idx_user_email', User.email, unique=True)
Index('idx_course_instructor', Course.instructor_id)
Index('idx_chapter_course', Chapter.course_id)
Index('idx_progress_user_course', Progress.user_id, Progress.course_id)
Index('idx_quiz_submission_student', QuizSubmission.student_id)
```

### 约束

```python
# 唯一约束
UniqueConstraint('user_id', 'course_id', name='uq_progress_user_course')

# 外键约束
ForeignKey('users.id', ondelete='CASCADE')
```

## 迁移

使用 Alembic 进行数据库迁移：

```bash
# 初始化 Alembic
alembic init migrations

# 创建新迁移
alembic revision --autogenerate -m "描述变更"

# 执行迁移
alembic upgrade head

# 查看历史
alembic history

# 回退迁移
alembic downgrade -1
```

## 初始化数据

在 `seeds/init_data.py` 中定义初始数据：

```python
async def init_database():
    # 创建初始课程
    course = Course(
        title="金融风险管理",
        description="本科生课程",
        instructor_id=1,
        duration_weeks=16
    )
    
    # 添加章节
    chapter = Chapter(
        course_id=course.id,
        title="风险基础",
        order=1
    )
    
    # 提交
    db.add_all([course, chapter])
    await db.commit()
```

## 使用示例

### 查询

```python
from sqlalchemy import select
from database.models import User, Course

# 简单查询
user = await db.get(User, 1)

# 复杂查询
query = select(Course).join(User).where(User.id == 1)
courses = await db.execute(query)
```

### 创建

```python
user = User(
    email="student@example.com",
    password_hash=hashed_password,
    name="Student Name",
    role="student"
)
db.add(user)
await db.commit()
```

### 更新

```python
user = await db.get(User, 1)
user.name = "New Name"
await db.commit()
```

### 删除

```python
user = await db.get(User, 1)
await db.delete(user)
await db.commit()
```

## 最佳实践

1. **关系管理**: 使用 SQLAlchemy 的关系映射
2. **延迟加载**: 避免 N+1 查询问题
3. **事务处理**: 使用事务保证数据一致性
4. **索引优化**: 为频繁查询的字段创建索引
5. **数据验证**: 在模型层进行数据验证

## 性能优化

- 使用数据库连接池
- 创建适当的索引
- 使用查询优化和 eager loading
- 定期运行数据库维护命令

## 相关文档

- [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/)
- [Alembic 迁移指南](https://alembic.sqlalchemy.org/)
- [数据库设计最佳实践](../docs/db-design.md)
