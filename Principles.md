````
# risk-management-project 工作纪律（学生开发团队版）

> 面向 AI 教育平台项目的团队协作与工程化开发规范  
> 适用于学生开发团队、小型 AI 产品团队、课程项目团队

---

# 一、核心原则

---

## 1. main 分支必须永远可运行

`main` 分支必须始终保持：

- 项目能正常启动
- 没有明显报错
- 不存在未完成半成品
- 不上传无法运行代码

禁止：

- 本地未测试直接 push
- 将实验代码直接上传 main
- 上传 dependency 已损坏代码
- 上传“先存一下”的代码

---

## 2. 不直接开发 main

所有功能开发必须基于 feature branch。

示例：

```bash
git checkout -b feature/login
git checkout -b feature/chat
git checkout -b feature/rag
```

开发完成后：

1. push feature branch
2. 发 Pull Request
3. review
4. merge 回 main

禁止：

```bash
git push origin main
```

作为日常开发方式。

---

# 二、每日开发流程

---

## 每天开始开发前

先同步最新代码：

```bash
git checkout main
git pull origin main
```

然后创建自己的功能分支：

```bash
git checkout -b feature/xxx
```

---

## 开发完成后

提交代码：

```bash
git add .
git commit -m "feat: add login api"
```

上传分支：

```bash
git push origin feature/xxx
```

然后发 PR。

---

# 四、开发纪律

---

## 1. 一次 Commit 只做一件事

禁止：

一个 commit 同时：

- 改 UI
- 改数据库
- 改 AI
- 改权限
- 改部署

正确方式：

一次 commit 只解决一个问题。

---

## 2. 不同时修改同一个模块

开发前明确职责边界。

例如：

### 成员 A

负责：

- backend
- database
- AI service

### 成员 B

负责：

- frontend
- dashboard
- UI

减少 merge conflict。

---

## 3. 不上传垃圾文件

必须维护 `.gitignore`

必须忽略：

```gitignore
venv/
node_modules/
__pycache__/
.env
.vscode/
dist/
build/
```

## 4. 不上传密钥

禁止上传：

```text
OPENAI_API_KEY
数据库密码
token
.env
```

所有密钥统一放：

```text
.env
```

并加入 `.gitignore`

---

## Review 纪律

即使只有两个人：

也必须 review。

Review 内容：

- 代码逻辑
- 文件结构
- 命名规范
- 是否影响其他模块
- 是否存在重复代码

---

# 六、工程结构纪律

---

## 文件命名统一

---

## 推荐命名

```text
auth_service.py
chat_controller.py
quiz_model.py
student_repository.py
```

---

## 模块化开发

禁止：

```text
一个文件 5000 行
```

推荐：

```text
auth/
chat/
rag/
quiz/
analytics/
```

---

# 七、Issue 管理

---

所有任务尽量写 GitHub Issue。

示例：

```text
#12 学生登录系统
#13 AI 聊天页面
#14 数据库用户表
#15 教师 Dashboard
```

commit 关联：

```bash
git commit -m "feat: add login api (#12)"
```

---

# 八、文档纪律

---

README 必须持续更新。

至少包括：

- 项目介绍
- 技术栈
- 如何运行
- 环境配置
- 文件结构
- API 说明
- 开发规范

---

# 九、AI 项目特别纪律

---

## 1. Prompt 单独管理

不要把 Prompt 写死在代码里。

推荐：

```text
prompts/
```

统一管理。

---

## 2. 记录 AI 调用日志

至少记录：

- 用户问题
- prompt
- model
- response
- token 消耗

否则后期无法 debug。

---

## 3. 不随便改 Prompt

Prompt 修改必须：

- commit
- review
- 记录效果

---

## 4. 不让 AI 逻辑污染业务逻辑

禁止：

```python
# 所有 AI 逻辑写在 controller 里
```

推荐：

```text
services/
agents/
prompts/
rag/
```

模块化管理。

---

# 十一、当前阶段目标（非常重要）

---

现阶段：

不要追求：

- 微服务
- Kubernetes
- 超复杂 Agent
- 超前 DevOps
- 分布式系统

当前最重要：

```text
完整跑通业务闭环
```

即：

```text
学生提问
→ AI 回答
→ 数据存储
→ 教师查看
```

---

# 十二、推荐工程目录（当前阶段）

---

```text
risk-management-project/
│
├── frontend/
├── backend/
├── docs/
├── prompts/
├── database/
├── scripts/
├── .github/
├── .gitignore
├── README.md
└── WORKFLOW.md
```

---

# 十三、推荐技术栈（当前阶段）

---

## 前端

- React
- Next.js
- TypeScript
- TailwindCSS

---

## 后端

- Python
- FastAPI

---

## 数据库

- PostgreSQL

---

## AI 相关

- OpenAI API
- LangChain（后期）
- RAG（后期）

---

# 十四、团队每日 Checklist

---

## 开发前

- [ ] pull 最新 main
- [ ] 确认当前 branch
- [ ] 确认任务目标

---

## 开发中

- [ ] 不修改别人模块
- [ ] 不提交垃圾代码
- [ ] 保持模块化

---

## 提交前

- [ ] 本地运行成功
- [ ] 删除 debug 输出
- [ ] commit message 合规
- [ ] 检查是否泄露密钥

---

## merge 前

- [ ] Review 完成
- [ ] PR 描述完整
- [ ] main 可运行

---

# 十六、当前项目阶段目标（MVP）

---

当前只需要优先完成：

```text
学生提问
→ AI 回答
→ 数据存储
→ 教师查看记录
```

先跑通完整闭环。

不要一开始就：

- 多智能体
- 自动出题
- 金融 MCP
- 大规模 RAG
- 自动评测系统

---


