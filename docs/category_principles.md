# risk-management-project 工程目录设计手册

> 本文档用于解释项目工程目录的设计逻辑、各模块职责以及为什么这样拆分。  
> 目标是让项目在未来多人协作、AI 功能扩展、课程内容增加时仍然保持：
>
> - 可维护
> - 可扩展
> - 可协作
> - 可阅读

---

# 一、完整工程目录（推荐结构）

```text
risk-management-project/
│
├── frontend/
├── backend/
├── prompts/
├── docs/
├── database/
├── scripts/
├── tests/
├── .github/
│
├── .gitignore
├── .env.example
├── README.md
├── WORKFLOW.md
├── requirements.txt
└── docker-compose.yml（后期）
```

---

# 二、项目根目录（Project Root）

项目根目录：

```text
risk-management-project/
```

是整个工程的总入口。

这里放：

- 前端
- 后端
- 文档
- 自动化脚本
- GitHub 配置
- 环境配置

---

## 为什么根目录不能乱？

很多新手喜欢：

```text
aaa.py
test.py
final_v2.py
```

直接堆在根目录。

三个月后：

项目会完全失控。

所以：

根目录只放：

```text
全局级别文件
```

---

# 三、frontend/

```text
frontend/
```

---

## 作用

前端负责：

```text
用户能看到的一切
```

包括：

- 登录页面
- 学生学习页面
- AI 聊天页面
- 教师 Dashboard
- 测试页面

---

## 为什么前后端分离？

因为：

前端负责：

```text
展示
交互
UI
```

后端负责：

```text
数据
逻辑
AI
数据库
```

这是现代 Web 工程最核心的边界之一。

---

# 四、frontend 内部结构

---

## 推荐结构

```text
frontend/
│
├── app/
├── components/
├── services/
├── styles/
├── public/
└── package.json
```

---

# 五、frontend/app/

```text
app/
```

---

## 作用

这里放：

```text
页面（Pages）
```

例如：

```text
app/
│
├── login/
├── dashboard/
├── course/
├── chat/
└── teacher/
```

---

## 为什么这样拆？

因为：

```text
页面 = 功能入口
```

页面负责：

- 组织布局
- 调用组件
- 请求数据

而不是：

```text
把所有代码写一个文件
```

---

# 六、frontend/components/

```text
components/
```

---

## 作用

放：

```text
可复用 UI 组件
```

例如：

```text
Navbar.tsx
ChatBox.tsx
Sidebar.tsx
QuizCard.tsx
LoadingSpinner.tsx
```

---

## 为什么必须拆组件？

因为：

```text
UI 一定会重复
```

例如：

- 导航栏
- 聊天框
- 卡片
- 按钮

如果不拆：

```text
复制粘贴 UI
```

后期会：

- 修改困难
- 风格不统一
- bug 到处复制

---

# 七、frontend/services/

```text
services/
```

---

## 作用

这里放：

```text
前端请求后端 API 的逻辑
```

例如：

```text
auth.ts
chat.ts
quiz.ts
course.ts
```

---

## 为什么这样设计？

错误方式：

```typescript
每个页面直接 fetch()
```

后果：

```text
API 地址到处乱飞
```

未来：

```text
/chat
改成
/api/chat
```

你会改疯。

---

## 正确方式

统一：

```text
services/chat.ts
```

页面只调用：

```typescript
sendMessage()
```

这样：

```text
后端改 API
只改一个地方
```

---

# 八、backend/

```text
backend/
```

---

## 作用

这是：

```text
整个 AI 平台真正核心
```

负责：

- AI 调用
- 数据库
- 权限
- 用户
- 测试系统
- 教师分析
- RAG
- Agent

---

# 九、backend 推荐结构

```text
backend/
│
├── app/
├── tests/
├── requirements.txt
└── main.py
```

---

# 十、backend/main.py

---

## 作用

项目启动入口。

例如：

```python
uvicorn.run(app)
```

类似：

```text
程序总开关
```

---

# 十一、backend/app/

```text
app/
```

---

## 作用

真正业务逻辑区。

推荐：

```text
app/
│
├── api/
├── services/
├── models/
├── database/
├── agents/
├── rag/
├── prompts/
├── auth/
├── utils/
└── config/
```

---

# 十二、api/

```text
api/
```

---

## 作用

接口层（API Layer）。

例如：

```text
chat.py
auth.py
quiz.py
teacher.py
```

里面可能：

```python
@app.post("/chat")
```

---

## 为什么单独拆 api？

因为：

```text
API 不应该写业务逻辑
```

API 只负责：

```text
接收请求
返回结果
```

真正逻辑：

```text
services/
```

---

# 十三、services/

```text
services/
```

---

## 作用

业务逻辑层。

这是：

```text
真正核心中的核心
```

例如：

```text
chat_service.py
quiz_service.py
analytics_service.py
report_service.py
```

---

## 为什么必须有 service 层？

错误方式：

```python
@app.post("/chat")
def chat():
    调数据库
    调AI
    拼prompt
    存消息
```

问题：

```text
API 和逻辑耦合
```

后期：

- 无法维护
- 无法测试
- 无法扩展

---

## 正确流程

```text
API
↓
Service
↓
Database / Agent
```

---

# 十四、models/

```text
models/
```

---

## 作用

数据库结构定义。

例如：

```text
User
Course
Quiz
Message
Report
```

---

## 为什么单独拆？

因为：

```text
数据库结构是整个系统基础
```

如果混在业务逻辑里：

后期数据库会失控。

---

# 十五、database/

```text
database/
```

---

## 作用

数据库连接与配置。

例如：

```text
connection.py
session.py
migrations/
```

---

## 为什么分离 models 和 database？

因为：

```text
models = 数据结构
database = 数据库连接
```

这是两件事。

---

# 十六、agents/

```text
agents/
```

---

## 作用

AI 智能体模块。

你项目未来：

- 答复 Agent
- 评议 Agent
- 出题 Agent
- 助教 Agent

都会在这里。

例如：

```text
tutor_agent.py
grading_agent.py
quiz_agent.py
teaching_agent.py
```

---

## 为什么单独拆 Agent？

因为：

```text
AI 逻辑会越来越复杂
```

未来可能有：

- tool calling
- memory
- workflow
- planning
- 多 Agent 协作

必须隔离。

---

# 十七、rag/

```text
rag/
```

---

## 作用

知识库系统。

未来：

```text
embedding
vector database
retrieval
reranking
chunking
```

都在这里。

---

## 为什么现在就预留？

因为：

```text
未来一定会扩展
```

工程化：

```text
提前建立边界
```

比后期重构便宜很多。

---

# 十八、prompts/

```text
prompts/
```

---

## 作用

统一管理 Prompt。

例如：

```text
tutor_prompt.txt
grading_prompt.txt
quiz_prompt.txt
```

---

## 为什么不能写死代码？

错误：

```python
prompt = """
你是金融老师...
"""
```

问题：

- 修改困难
- 无法版本管理
- 无法多人协作

---

## 正确方式

Prompt 文件化。

这样：

- Git 可追踪
- 方便实验
- 方便 review

---

# 十九、utils/

```text
utils/
```

---

## 作用

工具函数。

例如：

```text
logger.py
validators.py
helpers.py
```

---

## 为什么需要？

避免：

```text
重复代码
```

---

# 二十、config/

```text
config/
```

---

## 作用

项目配置管理。

例如：

- model 名称
- token 限制
- API 地址
- timeout

---

## 为什么必须有 config？

因为：

```text
配置一定会改
```

如果：

到处硬编码：

后期会非常难维护。

---

# 二十一、docs/

```text
docs/
```

---

## 作用

项目文档中心。

例如：

```text
architecture.md
api.md
database_design.md
deployment.md
```

---

## 为什么需要 docs？

README 是：

```text
项目首页
```

docs 是：

```text
项目知识库
```

README 应该简洁。

复杂内容：

应该进入 docs。

---

# 二十二、scripts/

```text
scripts/
```

---

## 作用

自动化脚本。

例如：

```text
init_db.py
create_admin.py
import_books.py
```

---

## 为什么单独拆？

因为：

这些：

```text
不是业务逻辑
```

而是：

```text
工程辅助工具
```

---

# 二十三、tests/

```text
tests/
```

---

## 作用

测试代码。

例如：

- 登录测试
- API 测试
- Agent 测试

---

## 为什么必须有测试？

因为未来：

你改一个地方。

可能另一个地方悄悄坏掉。

测试本质上是：

```text
防止系统退化
```

---

# 二十四、.github/

```text
.github/
```

---

## 作用

GitHub 自动化配置。

里面通常：

```text
.github/workflows/
```

未来：

- 自动测试
- 自动部署
- CI/CD

都会放这里。

---

# 二十五、README.md

---

## 作用

项目门面。

任何人打开项目：

第一眼看 README。

应该包括：

- 项目介绍
- 技术栈
- 如何运行
- 项目结构

---

# 二十六、WORKFLOW.md

---

## 作用

团队开发规范。

包括：

- Git 纪律
- commit 规范
- PR 规范
- 开发流程

---

# 二十七、.gitignore

---

## 作用

指定：

```text
哪些文件不要上传 GitHub
```

例如：

```text
venv/
node_modules/
.env
```

---

## 为什么重要？

Git 仓库应该：

```text
轻量
干净
可同步
```

而不是：

```text
整个电脑备份
```

---

# 二十八、.env.example

---

## 作用

告诉队友：

```text
项目需要哪些环境变量
```

例如：

```env
OPENAI_API_KEY=
DATABASE_URL=
SECRET_KEY=
```

但：

```text
不包含真正密钥
```

---

# 二十九、真正的工程化核心思想

你现在最需要建立的：

不是：

```text
会多少技术
```

而是：

```text
边界感
```

例如：

- UI 不碰数据库
- API 不碰 AI 逻辑
- Prompt 不写死代码
- Agent 独立管理
- 数据结构集中定义

---

# 三十、最后一句话

软件工程真正难的地方：

从来不是：

```text
写功能
```

而是：

```text
控制复杂度
```

目录结构本质上就是：

```text
对复杂系统进行分区管理
```
````
