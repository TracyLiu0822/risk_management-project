# Utils

当前通用工具只有：

```text
back_end/app/utils/response.py
```

该文件负责统一 API 响应：

```json
{
  "success": true,
  "data": {}
}
```

错误响应：

```json
{
  "success": false,
  "data": null,
  "message": "error message"
}
```

2026-06-07：增加 FastAPI `jsonable_encoder`，修复日期对象导致注册接口返回 500 的问题。

旧文档中的 logger、cache、crypto、decorator 等工具尚未实现。
