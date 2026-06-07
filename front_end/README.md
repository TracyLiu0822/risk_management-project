# Frontend

Next.js 14 + React 18 + TypeScript + Tailwind CSS 前端。

生产构建使用 Next.js 静态导出，输出到 `front_end/out`，随后由 FastAPI
托管。生产环境的 API 地址默认为当前网页域名。

## 已实现页面

| 路径 | 功能 |
| --- | --- |
| `/` | MVP 首页 |
| `/login` | 学生/教师登录 |
| `/register` | 学生注册、带注册码的教师注册 |
| `/student/tutor` | 提问、查看回答来源和本人历史 |
| `/teacher/history` | 教师查看学生问答记录 |

## API 约定

- `api.client.ts` 统一解包 `{ success, data, message }`。
- Access/Refresh Token 存储在 Local Storage。
- 请求自动附加 Bearer Token。
- 401 时只发起一个 Refresh 请求，成功后重试原请求。

## 启动

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

验证命令：

```powershell
npm run type-check
npm run build
```

统一平台构建建议从仓库根目录运行：

```powershell
.\scripts\build_platform.ps1
```

## 2026-06-07 开发日志

- 替换损坏的首页 JSX 和中文文本。
- 新增登录、注册、学生 Tutor 和教师审阅页。
- 删除未使用的课程/CRUD Tutor 客户端。
- 前后端统一 Bearer Token 和刷新协议。
- 精简 `package.json` 到当前页面实际依赖。

当前执行环境无法访问 npm registry，因此本轮没有完成 `type-check/build`。同事安装依赖后应首先执行上述两条验证命令。

下一步前端重点：教师资料上传、课程筛选、分页、加载骨架和错误边界。
