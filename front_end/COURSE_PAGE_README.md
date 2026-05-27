/**
 * 课程学习页面 - 使用指南
 * 
 * 本目录包含学生学习页面的所有必要文件和组件
 */

# 学生学习页面 - 完整开发指南

## 📋 项目概述

这是一个基于 Next.js 14+ App Router 的现代化学生学习平台，提供以下功能：

- ✅ **三栏布局**：左侧课程导航 + 中间内容展示 + 右侧 AI 聊天助手
- ✅ **Markdown 渲染**：支持 GitHub 风格、代码高亮、KaTeX 数学公式
- ✅ **响应式设计**：桌面端三栏全显，移动端自适应折叠
- ✅ **AI 聊天助手**：Mock 数据实现，易于替换为真实 API
- ✅ **现代 UI**：TailwindCSS 3+ 样式，参考主流教育平台设计

## 📁 项目结构

```
front_end/
├── app/
│   ├── course/                    # 课程页面路由
│   │   └── page.tsx              # 页面入口（加载状态 + 课程数据）
│   ├── layout.tsx                 # 全局布局
│   ├── page.tsx                   # 首页
│   └── globals.css                # 全局样式
├── components/
│   ├── course-layout.tsx           # 整体三栏布局容器
│   ├── sidebar.tsx                 # 左侧章节导航栏
│   ├── markdown-renderer.tsx       # 中间 Markdown 渲染器
│   ├── chat-box.tsx               # 右侧聊天框
│   ├── chat-message.tsx            # 聊天消息气泡
│   ├── chat-input.tsx             # 聊天输入框
│   ├── loading-dots.tsx            # 加载动画（3 个跳动圆点）
│   └── hamburger-button.tsx        # 移动端菜单按钮
├── services/
│   ├── course-service.ts          # 课程数据服务（含 Mock 数据）
│   └── chat-service.ts            # AI 聊天服务（含 Mock 回复池）
├── types/
│   ├── course.ts                  # 课程相关类型定义
│   └── chat.ts                    # 聊天相关类型定义
├── tailwind.config.js              # TailwindCSS 配置
├── tsconfig.json                   # TypeScript 配置（已设置严格模式）
└── package.json                    # 项目依赖配置
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd front_end
npm install
# 或使用 yarn / pnpm
yarn install
# pnpm install
```

### 2. 安装额外依赖包

项目使用了以下额外包进行 Markdown 渲染和数学公式支持：

```bash
npm install katex
# katex 用于渲染数学公式（$...$ 和 $$...$$）
```

现有已安装的相关包：
- `markdown-it@^14.0.0` - Markdown 解析
- `highlight.js@^11.9.0` - 代码高亮
- `@tailwindcss/typography@^0.5.10` - Prose 样式

### 3. 启动开发服务器

```bash
npm run dev
# 访问 http://localhost:3000/course
```

### 4. 生产构建

```bash
npm run build
npm start
```

## 📝 文件说明

### 核心组件

#### `course-layout.tsx`
- **作用**：整体三栏布局，管理课程选择和聊天状态
- **状态**：selectedSectionId, currentContent, messages, isLoadingChat
- **功能**：
  - 处理章节选择和内容切换
  - 管理聊天消息列表
  - 协调左侧导航和内容区域的交互

#### `sidebar.tsx`
- **作用**：左侧课程章节导航
- **特性**：
  - 支持展开/折叠子章节
  - 当前选中章节高亮显示
  - 移动端自动折叠为汉堡菜单
  - 递归渲染多层次章节

#### `markdown-renderer.tsx`
- **作用**：将 Markdown 内容转换为 React 组件
- **支持**：
  - GitHub 风格 Markdown 表格
  - 代码块语法高亮（使用 highlight.js）
  - KaTeX 数学公式（行内和块级）
  - 自定义样式（使用 TailwindCSS @apply）

#### `chat-box.tsx`
- **作用**：AI 聊天面板的整体容器
- **功能**：
  - 显示聊天消息列表
  - 自动滚动到最新消息
  - 集成聊天输入框
  - 显示 AI 加载状态

#### `chat-input.tsx`
- **作用**：聊天消息输入框
- **交互**：
  - Enter 键发送消息
  - Shift+Enter 换行
  - 自动调整高度
  - 禁用发送按钮（空输入时）

### 服务层

#### `course-service.ts`
```typescript
// Mock 课程数据包含：
- 5 个章节（风险管理基础、市场风险、信用风险、流动性风险、操作风险）
- 每个章节包含详细的 Markdown 内容
- 包括标题、代码块、表格、数学公式等示例

// 导出函数：
- getCourse() - 获取完整课程数据
- getCourseSection(sectionId) - 获取单个章节
```

#### `chat-service.ts`
```typescript
// Mock AI 回复池：6 条不同的教学回复

// 导出函数：
- sendChatMessage(userMessage) - 发送消息并获取 AI 回复
- validateMessage(message) - 验证消息（长度限制等）
```

### 类型定义

#### `types/course.ts`
```typescript
- CourseSection 接口 - 章节数据结构
- Course 接口 - 完整课程数据
- GetCourseSectionResponse 接口 - API 响应类型
- GetCourseResponse 接口 - API 响应类型
```

#### `types/chat.ts`
```typescript
- MessageRole 类型 - 'user' | 'ai'
- ChatMessage 接口 - 单条消息数据
- ChatServiceResponse 接口 - API 响应类型
- ChatContext 接口 - 聊天上下文
```

## 🎨 样式设计

### 配色方案
- **主色**：蓝色系 (`blue-600`, `blue-700`)
- **次色**：紫色系 (`purple-500`)
- **背景**：浅灰色 (`gray-50`)
- **卡片**：白色 (`white`) + 圆角 (`rounded-lg`, `rounded-2xl`)

### 响应式断点
- **移动端**：< 768px - 单栏布局 + 汉堡菜单
- **平板**：768px - 1024px - 逐步展开
- **桌面**：>= 1024px - 三栏全显 (lg: prefix)

### 关键组件的响应式处理
```
侧边栏 (Sidebar):
- 桌面端：固定宽度 (w-64) + 可见
- 移动端：隐藏 + 模态框展示（z-40）

内容区 (Content):
- 统一全屏高度 (h-screen) + 内部滚动 (overflow-y-auto)

聊天框 (ChatBox):
- 桌面端：固定宽度 (w-80) + 可见
- 移动端：隐藏 (hidden lg:flex)
```

## 🔄 数据流向

```
用户交互：
┌─────────────────┐
│  用户点击章节   │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ CourseLayout 更新   │
│ selectedSectionId   │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ useEffect 查找章节    │
│ 内容并设置         │
│ currentContent       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ MarkdownRenderer      │
│ 渲染内容             │
└──────────────────────┘

聊天流程：
┌──────────────────┐
│ 用户输入消息      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ ChatInput 收集输入    │
│ 调用 onSendMessage   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ 验证消息内容        │
│ validateMessage()     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ 添加用户消息到列表   │
│ setIsLoadingChat      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ sendChatMessage()     │
│ 获取 AI 回复         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ 添加 AI 消息到列表   │
│ 关闭 loading 状态    │
└──────────────────────┘
```

## 🔧 自定义和扩展

### 替换 Mock 数据为真实 API

1. **课程服务** - `services/course-service.ts`
```typescript
// 当前实现（Mock）：
export async function getCourse(): Promise<GetCourseResponse> {
  return { success: true, data: MOCK_COURSE };
}

// 替换为 API 调用：
export async function getCourse(): Promise<GetCourseResponse> {
  try {
    const response = await fetch('/api/courses/current');
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, data: {}, error: '加载失败' };
  }
}
```

2. **聊天服务** - `services/chat-service.ts`
```typescript
// 当前实现（Mock）：
export async function sendChatMessage(userMessage: string) {
  return { success: true, message: '随机回复' };
}

// 替换为 API 调用：
export async function sendChatMessage(userMessage: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    return { success: true, message: data.reply };
  } catch (error) {
    return { success: false, message: '', error: '获取回复失败' };
  }
}
```

### 修改样式主题

编辑 `tailwind.config.js` 中的颜色配置：
```javascript
colors: {
  primary: { ... },  // 主色
  secondary: { ... }, // 次色
  // 自定义您的颜色方案
}
```

### 添加新的 Markdown 支持

在 `markdown-renderer.tsx` 中扩展 markdown-it 插件：
```typescript
const md = new MarkdownIt({...})
  .use(require('markdown-it-plugin-name'))
  .use(require('another-plugin'));
```

## 📚 依赖包说明

| 包名 | 版本 | 用途 |
|-----|------|------|
| next | ^14.1.0 | React 框架 |
| react | ^18.2.0 | UI 库 |
| typescript | ^5.3.3 | 类型检查 |
| tailwindcss | ^3.4.1 | 样式框架 |
| lucide-react | ^0.294.0 | 图标库 |
| markdown-it | ^14.0.0 | Markdown 解析 |
| highlight.js | ^11.9.0 | 代码高亮 |
| katex | ^0.16.0+ | 数学公式渲染 |

## 🐛 常见问题

### 数学公式不显示？
- 确保已安装 katex：`npm install katex`
- 检查公式格式：`$inline$` 或 `$$block$$`
- 浏览器控制台查看是否有 KaTeX 错误

### 代码块没有高亮？
- highlight.js 已安装
- 检查代码块格式：\`\`\`language ... \`\`\`
- 支持语言：https://highlightjs.org/download/

### 移动端侧边栏显示异常？
- 检查 z-index 层级（侧边栏 z-40，遮罩 z-30）
- 确保视口单位正确（lg: breakpoint at 1024px）

### 聊天消息不更新？
- 检查消息 ID 是否唯一（使用 timestamp）
- 确保异步函数正确 await
- 浏览器控制台查看错误

## 📞 支持和联系

如有问题，请查看：
- TODO 注释：service 文件中标记了需要替换的 API 调用
- 类型定义：types/ 目录中的接口定义
- 组件注释：每个组件文件顶部的说明

---

**最后更新**：2024年
**版本**：1.0.0
**作者**：教育平台团队
