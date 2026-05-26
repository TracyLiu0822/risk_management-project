# Risk Management Platform

## 项目简介

这是苏州大学商学院针对本科生的《金融风险管理》课程的现代化 AI 学习平台。通过融合先进的 AI 技术和教育方法，为学生和教师提供智能化的学习和教学体验。

### 项目特色

- **AI 赋能**: 集成四大 AI Agent（导师、评分、测试、教学分析）
- **RAG 增强**: 基于课程材料的智能检索和上下文感知
- **前后端分离**: 现代化的微服务架构设计
- **可扩展**: 模块化结构，便于功能扩展和维护

### 技术栈

```
前端: Next.js 14 + React 18 + TypeScript + Tailwind CSS
后端: FastAPI + Python + SQLAlchemy + Async/Await
AI: LangChain + OpenAI + 向量数据库 (ChromaDB/Pinecone)
```

---

## 核心愿景

1. **知识结构化学习**: 通过平台让学生前置学习基础知识，教师聚焦深化和前沿知识教学
2. **自主学习体系**: 建立"平台学习基础 + 课堂学习深化"的双重学习路径
3. **教学效率提升**: AI 助手减轻教师重复工作，让教师专注教学创新
4. **学习评价科学化**: 智能评测系统准确识别学生知识薄弱项，提供个性化反馈

---

## 项目结构

```
risk-management-project/
├── front_end/                  # 前端应用 (Next.js)
│   ├── app/                    # Next.js App Router
│   ├── components/             # React 组件
│   ├── services/               # API 服务
│   ├── types/                  # TypeScript 类型
│   ├── package.json            # NPM 依赖
│   └── README.md
│
├── back_end/                   # 后端应用 (FastAPI)
│   ├── app/                    # FastAPI 应用
│   │   ├── main.py             # 应用入口
│   │   ├── config.py           # 配置
│   │   ├── database.py         # 数据库
│   │   ├── routers/            # API 路由
│   │   ├── models/             # 数据模型
│   │   ├── schemas/            # 请求/响应模型
│   │   └── services/           # 业务服务
│   ├── requirements.txt        # Python 依赖
│   └── README.md
│
├── agents/                     # AI Agents
│   ├── tutor_agent.py          # 导师 Agent
│   ├── grading_agent.py        # 评分 Agent
│   ├── quiz_agent.py           # 测试 Agent
│   ├── teaching_agent.py       # 教学 Agent
│   ├── prompts/                # Prompt 文本
│   └── README.md
│
├── RAG/                        # RAG 系统
│   ├── document_processor.py   # 文档处理
│   ├── embedding_engine.py     # 嵌入生成
│   ├── vector_store.py         # 向量存储
│   ├── retriever.py            # 检索引擎
│   └── README.md
│
├── database/                   # 数据库模型
│   ├── models/                 # ORM 模型
│   ├── migrations/             # 数据库迁移
│   └── README.md
│
├── services/                   # 业务服务层
│   ├── auth_service.py         # 认证服务
│   ├── course_service.py       # 课程服务
│   ├── student_service.py      # 学生服务
│   ├── teacher_service.py      # 教师服务
│   ├── agent_service.py        # Agent 协调
│   └── README.md
│
├── config/                     # 配置管理
│   ├── settings.py             # 主配置
│   ├── database.py             # 数据库配置
│   └── README.md
│
├── prompts/                    # AI Prompt 库
│   ├── tutor_prompts.py        # 导师 Prompt
│   ├── grading_prompts.py      # 评分 Prompt
│   └── README.md
│
├── utils/                      # 工具函数
│   ├── logger.py               # 日志工具
│   ├── validators.py           # 验证工具
│   └── README.md
│
├── tests/                      # 测试
│   ├── test_auth.py            # 认证测试
│   ├── test_courses.py         # 课程测试
│   └── test_agents.py          # Agent 测试
│
├── docs/                       # 文档
│   ├── API.md                  # API 文档
│   ├── SETUP.md                # 设置指南
│   └── ARCHITECTURE.md         # 架构文档
│
├── scripts/                    # 脚本工具
│   ├── init_db.py              # 初始化数据库
│   └── seed_data.py            # 数据初始化
│
├── .env.example                # 环境变量示例
├── .gitignore                  # Git 忽略配置
├── WORKFLOW.md                 # 工作流规范
├── README.md                   # 项目文档（本文件）
└── docker-compose.yml          # Docker 编排
```

---

## 快速开始

### 前提条件

- Node.js >= 18.0.0
- Python >= 3.10
- PostgreSQL / SQLite
- Docker (可选)

### 后端设置

```bash
# 1. 进入后端目录
cd back_end

# 2. 创建虚拟环境
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 配置数据库等信息

# 5. 初始化数据库
python -m scripts.init_db

# 6. 启动后端服务
python -m uvicorn app.main:app --reload
# 访问 API 文档: http://localhost:8000/api/docs
```

### 前端设置

```bash
# 1. 进入前端目录
cd front_end

# 2. 安装依赖
npm install
# 或使用 yarn/pnpm
# yarn install
# pnpm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，配置 NEXT_PUBLIC_API_URL

# 4. 启动开发服务器
npm run dev

# 访问应用: http://localhost:3000
```

---

## API 概览

### 认证 (Authentication)
- `POST /api/v1/auth/login` - 登录
- `POST /api/v1/auth/register` - 注册
- `POST /api/v1/auth/refresh` - 刷新 Token

### 课程 (Courses)
- `GET /api/v1/courses` - 获取课程列表
- `GET /api/v1/courses/{id}` - 获取课程详情
- `GET /api/v1/courses/{id}/chapters` - 获取章节

### 学生 (Students)
- `GET /api/v1/students/profile` - 学生资料
- `GET /api/v1/students/progress` - 学习进度
- `POST /api/v1/students/submit-quiz/{id}` - 提交测试
- `POST /api/v1/students/ask-tutor` - 提问 AI 导师

### 教师 (Teachers)
- `GET /api/v1/teachers/classes` - 班级列表
- `GET /api/v1/teachers/class/{id}/analytics` - 班级分析
- `POST /api/v1/teachers/ask-teaching-assistant` - 教学助手

### AI Agents
- `POST /api/v1/agents/tutor/ask` - 导师 Agent
- `POST /api/v1/agents/grading/evaluate` - 评分 Agent
- `POST /api/v1/agents/quiz/generate` - 测试生成
- `POST /api/v1/agents/teaching/analyze` - 教学分析

### RAG (文档管理)
- `POST /api/v1/rag/upload-document` - 上传文档
- `GET /api/v1/rag/search` - 文档搜索
- `POST /api/v1/rag/retrieve-context` - 获取上下文

---

## 功能模块说明

### 🎓 学生端功能

| 功能 | 说明 | 关键 Agent |
|------|------|-----------|
| **课程学习** | 结构化的课程内容学习 | - |
| **AI 导师** | 24/7 问答辅助 | Tutor Agent |
| **自适应测试** | 根据学生水平调整难度 | Quiz Agent |
| **学习反馈** | 个性化学习建议 | - |
| **进度追踪** | 可视化学习进度 | - |

### 👨‍🏫 教师端功能

| 功能 | 说明 | 关键 Agent |
|------|------|-----------|
| **班级管理** | 学生管理和课程编排 | - |
| **学习分析** | 班级和个人学习数据分析 | Teaching Agent |
| **自动评分** | AI 辅助作业评估 | Grading Agent |
| **教学建议** | 基于数据的教学优化建议 | Teaching Agent |

### 🤖 AI Agent 系统

#### 导师 Agent (Tutor Agent)
- 回答学生问题
- 解释课程概念
- 提供学习资源
- 生成追问题目

#### 评分 Agent (Grading Agent)
- 自动评估作业
- 生成建设性反馈
- 识别知识薄弱点
- 提出改进建议

#### 测试 Agent (Quiz Agent)
- 生成章节测试题
- 自适应难度调整
- 评估答案
- 提供解释

#### 教学 Agent (Teaching Agent)
- 分析班级表现
- 识别高风险学生
- 提供教学建议
- 知识点有效性评估

### 📚 RAG (检索增强生成)

- 文档上传和索引
- 语义搜索和检索
- 向量化存储
- 上下文感知的 AI 回复

---

## 工程团队

### 学生开发团队

- **陈晗之** - 全栈开发 | 苏州大学商学院 | 23级金融学（双学位）
- **刘雨暄** - 全栈开发 | 苏州大学商学院 | 23级金融学（双学位）

### 指导教师

- **刘亮 教授** - 苏州大学商学院

---

## 开发规范

### 代码风格

- **Python**: PEP 8, Black 格式化
- **TypeScript/JavaScript**: Prettier, ESLint
- **提交**: 按照 [WORKFLOW.md](WORKFLOW.md) 规范

### 分支管理

```
main (生产分支)
  ├── feature/login         (功能分支)
  ├── feature/quiz-system
  └── bugfix/ui-issue       (修复分支)
```

详见 [WORKFLOW.md](WORKFLOW.md)

### 测试要求

- 单元测试覆盖 >= 70%
- 集成测试覆盖关键流程
- 本地测试通过后再提交 PR

---

## 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 生产环境检查清单

- [ ] 环境变量配置完整
- [ ] 数据库备份已设置
- [ ] SSL/TLS 证书已配置
- [ ] 日志和监控已启用
- [ ] API 速率限制已配置
- [ ] CORS 策略已设置
- [ ] 依赖漏洞已检查

---

## 文档

各模块详细文档：

- [前端 README](front_end/README.md)
- [后端 README](back_end/README.md)
- [Agents README](agents/README.md)
- [RAG README](RAG/README.md)
- [Services README](services/README.md)
- [Database README](database/README.md)
- [Config README](config/README.md)
- [Prompts README](prompts/README.md)
- [Utils README](utils/README.md)

---

## 依赖版本要求

### 后端
- Python >= 3.10
- FastAPI >= 0.104
- SQLAlchemy >= 2.0
- LangChain >= 0.1.0
- OpenAI >= 1.3.0

### 前端
- Node.js >= 18.0.0
- Next.js >= 14.0.0
- React >= 18.0.0
- TypeScript >= 5.0.0

---

## 许可证

© 2024 苏州大学商学院

---

## 常见问题

### Q: 如何获取 OpenAI API 密钥？
A: 访问 [platform.openai.com](https://platform.openai.com)，注册账户并获取 API 密钥。

### Q: 支持哪些浏览器？
A: Chrome、Firefox、Safari、Edge 最新两个版本。

### Q: 如何贡献代码？
A: 按照 WORKFLOW.md 创建功能分支，提交 PR，通过代码审查后合并。

---

## 联系方式

- **项目地址**: [GitHub](https://github.com/TracyLiu0822/risk_management_project)
- **问题报告**: 在项目中提交 Issue
- **邮箱**: support@riskmanagement.edu.cn

---

## 致谢

感谢苏州大学商学院的支持和指导，感谢所有贡献者的努力和付出。
