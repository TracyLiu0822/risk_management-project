# Configuration

实际配置位于 `back_end/app/config.py`，通过 Pydantic Settings 读取环境变量。

## 必需配置

```env
SECRET_KEY=replace-with-a-random-secret
TEACHER_REGISTRATION_CODE=replace-with-a-private-code
DATABASE_URL=sqlite+aiosqlite:///./risk_management.db
SERVE_FRONTEND=True
# FRONTEND_DIST_DIR=./front_end/out
```

## 可选配置

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4
COURSE_MATERIAL_DIR=./docs/course_materials
RAG_TOP_K=5
RAG_MIN_SCORE=0.05
```

没有 `OPENAI_API_KEY` 时 Tutor 仍可运行，但只会整理检索片段。

2026-06-07：增加教师注册码、课程资料目录和 RAG 参数；修正 SQLite 异步 URL。
