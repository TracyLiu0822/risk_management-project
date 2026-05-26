# Risk Management Platform - Frontend

## 概述

这是面向《金融风险管理》课程的 AI 学习平台的前端应用。使用 Next.js 14 和 React 18 构建，提供现代化的用户界面和交互体验。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 库**: React 18
- **语言**: TypeScript 5
- **样式**: Tailwind CSS
- **状态管理**: Zustand + React Query
- **表单**: React Hook Form + Zod
- **HTTP 客户端**: Axios
- **图表**: Recharts
- **图标**: Lucide React
- **测试**: Jest + React Testing Library

## 项目结构

```
front_end/
├── app/                        # Next.js App Router (主应用)
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   ├── globals.css             # 全局样式
│   ├── providers.tsx           # 应用提供者
│   ├── (auth)/                 # 认证相关页面
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (student)/              # 学生页面
│   │   ├── dashboard/          # 学生仪表板
│   │   ├── courses/            # 课程学习
│   │   ├── quiz/               # 测试页面
│   │   └── profile/            # 个人资料
│   ├── (teacher)/              # 教师页面
│   │   ├── dashboard/          # 教师仪表板
│   │   ├── classes/            # 班级管理
│   │   ├── analytics/          # 分析报告
│   │   └── profile/            # 个人资料
│   └── api/                    # API 路由 (可选)
├── components/                 # 可复用组件
│   ├── ui/                     # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/                 # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── forms/                  # 表单组件
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ...
│   └── ...
├── services/                   # API 服务
│   ├── api.config.ts           # API 配置
│   ├── api.client.ts           # HTTP 客户端
│   ├── auth.service.ts         # 认证服务
│   ├── course.service.ts       # 课程服务
│   ├── student.service.ts      # 学生服务
│   ├── teacher.service.ts      # 教师服务
│   ├── agent.service.ts        # Agent 服务
│   └── rag.service.ts          # RAG 服务
├── hooks/                      # 自定义 React Hooks
│   ├── useAuth.ts
│   ├── useCourse.ts
│   ├── useStudent.ts
│   └── ...
├── contexts/                   # React Context
│   ├── AuthContext.tsx
│   ├── StudentContext.tsx
│   └── ...
├── utils/                      # 工具函数
│   ├── helpers.ts
│   ├── validators.ts
│   ├── formatters.ts
│   └── ...
├── types/                      # TypeScript 类型定义
│   ├── index.ts                # 主类型文件
│   ├── api.ts                  # API 相关类型
│   └── ...
├── styles/                     # 样式文件
│   └── ...
├── public/                     # 静态资源
│   ├── favicon.ico
│   ├── images/
│   └── ...
├── tests/                      # 测试文件
│   ├── __tests__/
│   └── ...
├── package.json                # NPM 依赖
├── tsconfig.json               # TypeScript 配置
├── tailwind.config.js          # Tailwind 配置
├── postcss.config.js           # PostCSS 配置
├── next.config.js              # Next.js 配置
├── .eslintrc.json              # ESLint 配置
├── .prettierrc.json            # Prettier 配置
├── .env.example                # 环境变量示例
├── README.md                   # 本文件
└── jest.config.js              # Jest 配置
```

## 快速开始

### 1. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 2. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local 文件
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 开发规范

### 文件命名
- 组件: PascalCase (例: `LoginForm.tsx`)
- Hooks: camelCase 以 `use` 开头 (例: `useAuth.ts`)
- 工具: camelCase (例: `formatters.ts`)

### 组件结构

```typescript
'use client';  // 如果是客户端组件

import { ReactNode } from 'react';
import { useHook } from '@/hooks/useHook';

interface ComponentProps {
  title: string;
  children?: ReactNode;
}

export function MyComponent({ title, children }: ComponentProps) {
  return (
    <div className="p-4">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### API 调用

```typescript
import { apiClient } from '@/services/api.client';
import API_CONFIG from '@/services/api.config';

// GET 请求
const courses = await apiClient.get(API_CONFIG.COURSES.LIST);

// POST 请求
const response = await apiClient.post(API_CONFIG.AUTH.LOGIN, {
  email: 'user@example.com',
  password: 'password',
});
```

### 状态管理

使用 Zustand 管理全局状态：

```typescript
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email, password) => {
    // 实现登录逻辑
  },
  logout: () => {
    set({ user: null });
  },
}));
```

### 表单处理

使用 React Hook Form + Zod：

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // 提交表单
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* 其他表单字段 */}
    </form>
  );
}
```

## 页面功能说明

### 学生端 (Student)

#### 仪表板 (`/student/dashboard`)
- 学习进度概览
- 最近课程
- 待完成作业
- 学习建议

#### 课程学习 (`/student/courses/:courseId`)
- 章节列表
- 课程内容展示
- 学习笔记
- 完成标记

#### 测试页面 (`/student/quiz/:quizId`)
- 题目展示
- 答题交互
- 实时反馈
- 得分显示

#### 个人资料 (`/student/profile`)
- 基本信息编辑
- 学习统计
- 成就展示
- 设置管理

### 教师端 (Teacher)

#### 仪表板 (`/teacher/dashboard`)
- 班级概览
- 学生列表
- 最近活动
- 快捷操作

#### 班级管理 (`/teacher/classes/:classId`)
- 学生信息
- 学习进度追踪
- 作业管理
- 成绩记录

#### 分析报告 (`/teacher/analytics/:classId`)
- 学习效果分析
- 知识点掌握情况
- 学生分组统计
- 教学改进建议

## 命令行工具

```bash
# 开发
npm run dev          # 启动开发服务器
npm run lint         # 运行 ESLint
npm run format       # 格式化代码
npm run type-check   # 类型检查

# 构建
npm run build        # 生产构建
npm start            # 启动生产服务器

# 测试
npm test             # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 生成覆盖率报告
```

## 环境变量

创建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000

# 应用信息
NEXT_PUBLIC_APP_NAME=Risk Management Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# 认证配置
NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/api/auth/callback

# 其他配置
NEXT_PUBLIC_ENVIRONMENT=development
```

## 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker 部署

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

## 常见问题

### 关于环境变量
- 所有以 `NEXT_PUBLIC_` 开头的变量会在浏览器中暴露
- 不要在 `NEXT_PUBLIC_` 变量中放置敏感信息

### 关于性能
- 使用 `next/Image` 进行图片优化
- 使用动态导入优化包大小
- 实现虚拟滚动处理大列表

### 关于调试
- 使用浏览器开发工具的 React DevTools 扩展
- 在 `next.config.js` 中配置 source maps

## 贡献指南

1. 创建功能分支: `git checkout -b feature/your-feature`
2. 提交更改: `git commit -am 'Add your feature'`
3. 推送分支: `git push origin feature/your-feature`
4. 创建 Pull Request

## 许可证

© 2024 苏州大学商学院

## 联系方式

- 开发团队: Chen Hanzheng, Liu Yuxuan
- 指导教师: Prof. Liang Liu
- 邮箱: support@riskmanagement.edu.cn
