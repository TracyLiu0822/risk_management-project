# Utils 模块

后端通用工具函数集。

## 概述

Utils 模块提供在整个应用中复用的工具函数，包括日志、验证、格式化、密码处理等。

## 目录结构

```
utils/
├── __init__.py
├── logger.py                   # 日志工具
├── validators.py               # 数据验证
├── formatters.py               # 数据格式化
├── crypto.py                   # 密码和加密
├── decorators.py               # 装饰器
├── exceptions.py               # 自定义异常
└── README.md
```

## 核心工具

### logger.py (日志)

```python
from utils.logger import get_logger

logger = get_logger(__name__)

# 不同日志级别
logger.debug("调试信息")
logger.info("一般信息")
logger.warning("警告信息")
logger.error("错误信息")
logger.critical("严重错误")
```

### validators.py (验证)

```python
from utils.validators import validate_email, validate_password

# 验证邮箱
is_valid = validate_email("user@example.com")

# 验证密码强度
strength = validate_password("MyPassword123!")
```

### formatters.py (格式化)

```python
from utils.formatters import format_datetime, format_score

# 格式化日期时间
formatted = format_datetime(datetime.now())

# 格式化分数
score_str = format_score(85.5)  # "85.5/100"
```

### crypto.py (加密)

```python
from utils.crypto import hash_password, verify_password

# 密码哈希
hashed = hash_password("plaintext_password")

# 验证密码
is_correct = verify_password("plaintext_password", hashed)
```

### decorators.py (装饰器)

```python
from utils.decorators import async_timer, cache_result

@async_timer
async def slow_function():
    # 函数执行时间记录
    pass

@cache_result(ttl=300)
async def expensive_query():
    # 结果缓存 5 分钟
    pass
```

### exceptions.py (异常)

```python
from utils.exceptions import ValidationError, AuthenticationError

# 使用自定义异常
if not is_valid:
    raise ValidationError("Invalid input")

if not authenticated:
    raise AuthenticationError("Invalid credentials")
```

## 常用函数

### 日志记录

```python
# 简单日志
logger.info(f"用户登录: {user_id}")

# 结构化日志
logger.info("user_login", extra={
    "user_id": user_id,
    "email": email,
    "timestamp": datetime.now()
})
```

### 数据验证

```python
# 验证多个字段
from pydantic import BaseModel, validator

class UserInput(BaseModel):
    email: str
    password: str
    
    @validator('email')
    def email_must_be_valid(cls, v):
        if not validate_email(v):
            raise ValueError('Invalid email')
        return v
```

### 异步处理

```python
from utils.async_helpers import gather_with_timeout, retry_async

# 并发执行多个任务，设置超时
results = await gather_with_timeout(
    [task1(), task2(), task3()],
    timeout=10
)

# 重试异步函数
result = await retry_async(
    async_function,
    max_retries=3,
    backoff_factor=2
)
```

### 缓存管理

```python
from utils.cache import cache_get, cache_set, cache_delete

# 设置缓存
await cache_set("user:123", user_data, ttl=3600)

# 获取缓存
user_data = await cache_get("user:123")

# 删除缓存
await cache_delete("user:123")
```

## 最佳实践

1. **DRY 原则**: 避免重复代码，将通用逻辑提取到 utils
2. **单一职责**: 每个工具函数只做一件事
3. **类型提示**: 为所有函数提供类型提示
4. **文档**: 为公共函数添加 docstring
5. **测试**: 为工具函数编写单元测试

## 示例：创建新工具函数

```python
# utils/string_helpers.py

from typing import Optional

def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    截断文本到指定长度。
    
    Args:
        text: 要截断的文本
        max_length: 最大长度（默认 100）
        suffix: 省略号后缀（默认 "..."）
    
    Returns:
        截断后的文本
    
    Example:
        >>> truncate_text("Hello world", max_length=5)
        'Hello...'
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix
```

## 性能优化

- 使用装饰器实现缓存
- 批量处理操作
- 异步 I/O 操作
- 连接池管理

## 依赖

- pydantic >= 2.0
- python-jose >= 3.3.0
- passlib >= 1.7.4

## 相关文档

- [错误处理](../docs/error-handling.md)
- [日志配置](../docs/logging.md)
- [缓存策略](../docs/caching.md)
