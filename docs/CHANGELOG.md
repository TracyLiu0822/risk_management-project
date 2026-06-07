# 变更日志

## 2026-06-07

### 单网址网页入口

- Next.js 配置为静态导出到 `front_end/out`。
- 前端生产模式默认调用同源 API。
- FastAPI 在根路径托管首页、登录页和业务页面。
- API、Swagger 和健康检查优先于静态网页路由。
- 增加 `scripts/build_platform.ps1` 统一构建脚本。
- 增加网页托管和缺失构建产物测试，总测试数增加到 8。

### P0：业务闭环

- 修复 Tutor Agent 缺少 Retriever 导致接口无法运行的问题。
- 实现本地 Markdown/TXT 课程资料检索。
- 增加 PDF 上传后文本提取。
- 实现无 OpenAI Key 时的保守摘录回答。
- 学生提问后保存问题、回答和来源。
- 实现学生问答历史。
- 实现教师查看学生问答记录。
- 新增登录、注册、学生 Tutor、教师审阅页面。

### P1：可靠性

- 统一前后端 Bearer Token 契约。
- 实现 Refresh Token。
- 增加学生/教师角色校验。
- 增加教师注册码。
- 修复统一响应的日期序列化。
- 增加 Alembic 初始迁移和模型加载。
- 精简并升级 Python 3.13 兼容依赖。
- 修复损坏的 Tutor Prompt 和前端首页文本。
- 新增 RAG、完整闭环、越权访问和教师注册码测试。

### 验证

- 后端测试：8 passed。
- 覆盖率：71%。
- Alembic 初始迁移：通过。
- Python compileall：通过。
- 前端构建：未执行，原因是当前执行环境未获 npm 联网权限。

## 2026-05-27

- 建立 FastAPI、Next.js、Agent 和 RAG 初始工程骨架。
- 增加认证、聊天历史、LLM 和 Tutor 的初版服务。
- 增加 Chroma/OpenAI Embedding 实验代码。

该日期的实现多数为骨架或占位接口，不能视为完整业务功能。
