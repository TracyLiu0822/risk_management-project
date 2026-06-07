# Database

实际 ORM 模型位于 `back_end/app/models/`。

## 当前表

### `users`

- `id`：UUID 字符串
- `email`：唯一邮箱
- `password_hash`
- `role`：`student` 或 `teacher`
- `created_at`

### `chat_history`

- `id`：UUID 字符串
- `user_id`：关联用户
- `question`
- `answer`
- `sources_json`：回答来源 JSON
- `created_at`

索引：`user_id + created_at`，用于历史分页。

## 迁移

```powershell
.\.venv\Scripts\alembic.exe upgrade head
```

初始迁移：`migrations/versions/20260607_0001_initial_mvp.py`

课程、章节、班级、选课、进度和测验表尚未创建。旧文档中对这些表的描述只是规划，不代表当前数据库状态。

## 2026-06-07 日志

- 增加聊天来源持久化。
- 修复 Alembic 模型未加载的问题。
- 新增可执行初始迁移。
- SQLite 和 PostgreSQL 均使用异步 URL。
