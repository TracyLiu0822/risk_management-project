# 单网址网页部署

最终平台采用一个进程、一个网址：

```text
浏览器
  GET /                    登录前首页
  GET /login/              登录页面
  GET /student/tutor/      学生页面
  GET /teacher/history/    教师页面
  POST /api/v1/...         后端 API
         │
         ▼
      FastAPI
         │
         ├── API 路由
         └── front_end/out 静态网页
```

## 构建网页

在仓库根目录运行：

```powershell
.\scripts\build_platform.ps1
```

脚本执行以下操作：

1. 安装前端依赖。
2. 强制生产网页使用同源 API。
3. 执行 Next.js 静态导出。
4. 检查 `front_end/out/index.html` 是否存在。

## 初始化并启动平台

```powershell
.\.venv\Scripts\alembic.exe upgrade head
.\.venv\Scripts\uvicorn.exe --app-dir back_end app.main:app --host 0.0.0.0 --port 8000
```

用户只需访问：

```text
http://服务器地址:8000/
```

打开根网址时看到登录前首页。登录、注册、学生页面、教师页面和 API 都使用同一个域名。

## 配置

```env
SERVE_FRONTEND=True
FRONTEND_DIST_DIR=./front_end/out
```

如果构建目录不存在，访问 `/` 会返回 HTTP 503，并给出构建命令；`/api/docs`、`/health` 和 API 仍然可用。

## 本地开发

开发期间仍可分别启动：

```powershell
# 后端
.\.venv\Scripts\uvicorn.exe --app-dir back_end app.main:app --reload

# 前端
Set-Location front_end
npm run dev
```

此时 `front_end/.env.local` 可以设置：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
