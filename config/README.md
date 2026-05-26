# Config 模块

应用配置文件集中管理。

## 概述

Config 模块存储所有的配置参数，支持环境变量覆盖，便于不同环境下的部署。

## 目录结构

```
config/
├── __init__.py
├── settings.py                 # 主配置文件
├── database.py                 # 数据库配置
├── api.py                      # API 配置
├── ai.py                       # AI/LLM 配置
├── security.py                 # 安全配置
└── README.md
```

## 配置文件说明

### settings.py (主配置)

```python
# 应用信息
PROJECT_NAME = "Risk Management Platform"
PROJECT_VERSION = "1.0.0"
ENVIRONMENT = "development"  # development, staging, production

# 服务器配置
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True

# CORS 配置
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# 日志配置
LOG_LEVEL = "INFO"
LOG_FORMAT = "json"  # json or text
```

### database.py (数据库配置)

```python
# SQLite (开发环境)
DATABASE_URL = "sqlite:///./risk_management.db"

# PostgreSQL (生产环境)
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"

# 连接池配置
POOL_SIZE = 5
MAX_OVERFLOW = 10
POOL_TIMEOUT = 30
POOL_RECYCLE = 3600
```

### api.py (API 配置)

```python
# API 基础路由
API_PREFIX = "/api"
API_VERSION = "v1"

# 文件上传
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_FILE_TYPES = ["pdf", "txt", "md"]

# 分页
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
```

### ai.py (AI 配置)

```python
# LLM 配置
OPENAI_API_KEY = "your-api-key"
OPENAI_MODEL = "gpt-4"
OPENAI_TEMPERATURE = 0.7
OPENAI_MAX_TOKENS = 2000

# RAG 配置
RAG_ENABLED = True
VECTOR_STORE_TYPE = "chroma"  # chroma, pinecone, faiss
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Agent 配置
AGENTS_ENABLED = True
AGENT_TIMEOUT = 30  # 秒
```

### security.py (安全配置)

```python
# JWT 配置
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# 密码配置
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_NUMBERS = True

# API 密钥
API_KEY_HEADER = "X-API-Key"
```

## 使用环境变量

创建 `.env` 文件：

```env
# 应用配置
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=INFO

# 数据库配置
DATABASE_URL=sqlite:///./risk_management.db

# API 配置
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# AI 配置
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
RAG_ENABLED=True

# 安全配置
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
```

## 环境特定配置

### 开发环境

```python
# .env.development
ENVIRONMENT=development
DEBUG=True
DATABASE_URL=sqlite:///./risk_management.db
LOG_LEVEL=DEBUG
```

### 生产环境

```python
# .env.production
ENVIRONMENT=production
DEBUG=False
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
LOG_LEVEL=WARNING
CORS_ORIGINS=["https://yourdomain.com"]
```

### 测试环境

```python
# .env.test
ENVIRONMENT=test
DEBUG=True
DATABASE_URL=sqlite:///:memory:
LOG_LEVEL=DEBUG
```

## 配置覆盖

配置优先级 (从高到低):

1. 环境变量
2. .env 文件
3. 代码中的默认值

```python
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./risk_management.db")
    
    class Config:
        env_file = ".env"
```

## 最佳实践

1. **不提交敏感信息**: 不在版本控制中提交 `.env` 文件
2. **清晰的命名**: 使用明确的配置项名称
3. **默认值**: 为所有配置提供安全的默认值
4. **文档**: 为每个配置项添加注释说明
5. **验证**: 在应用启动时验证配置

## 配置验证

```python
def validate_config():
    """验证配置有效性"""
    assert settings.SECRET_KEY, "SECRET_KEY 必须设置"
    assert settings.DATABASE_URL, "DATABASE_URL 必须设置"
    
    if settings.ENVIRONMENT == "production":
        assert not settings.DEBUG, "生产环境不能启用 DEBUG"
        assert settings.OPENAI_API_KEY, "生产环境需要 OpenAI API 密钥"
```

## 导入配置

```python
from config.settings import settings
from config.database import DATABASE_URL
from config.ai import OPENAI_API_KEY

# 使用配置
print(settings.PROJECT_NAME)
print(DATABASE_URL)
print(OPENAI_API_KEY)
```

## 相关文档

- [环境变量设置指南](../docs/environment-setup.md)
- [安全最佳实践](../docs/security.md)
- [部署指南](../docs/deployment.md)
