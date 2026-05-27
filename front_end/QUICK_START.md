/**
 * 快速启动指南 - 学生学习页面
 * 
 * 包含安装、启动和验证的简明步骤
 */

# 🚀 快速启动指南

## ⚡ 5分钟快速开始

### 步骤 1：进入项目目录

```bash
cd /Users/liuyuxuan/Desktop/risk_management_project/risk_management_project/front_end
```

### 步骤 2：安装依赖

```bash
# 安装所有 npm 包（包括新增的 katex）
npm install katex

# 或一次性安装：
npm install
npm install katex
```

> **如果 npm 不在 PATH 中：**
> 
> 请确保 Node.js 已安装，并检查：
> ```bash
> node --version  # 应该 ≥ 18.0.0
> npm --version   # 应该 ≥ 9.0.0
> ```

### 步骤 3：启动开发服务器

```bash
npm run dev
```

你应该看到：
```
> next dev
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

### 步骤 4：访问学习页面

打开浏览器，访问：
```
http://localhost:3000/course
```

### 步骤 5：验证功能

**左侧导航栏**
- ✅ 显示 5 个课程章节
- ✅ 点击章节名称能切换内容

**中间内容区**
- ✅ 显示 Markdown 格式的课程内容
- ✅ 代码块有高亮和语言标签
- ✅ 数学公式正确显示（如果显示失败，查看下方 FAQ）

**右侧聊天框**
- ✅ 显示"AI 学习助手"标题
- ✅ 可以输入消息
- ✅ 按 Enter 发送，Shift+Enter 换行

---

## 🔍 常见问题快速排查

### ❓ npm 命令不找到

```bash
# 方案 1：检查 Node 路径
which node
which npm

# 方案 2：使用 nvm（如果已安装）
nvm use 18
npm install

# 方案 3：使用 Homebrew 重新安装 Node
brew install node@18
npm install
```

### ❓ 数学公式不显示

**症状**：看到原始的 `$$...$$ ` 文本而不是公式

**解决方案**：
```bash
# 1. 检查 katex 是否安装
npm list katex

# 2. 如果未安装，手动安装
npm install katex

# 3. 重启开发服务器
# 停止服务器（Ctrl+C）然后重新运行：
npm run dev
```

### ❓ 代码块不高亮

**症状**：代码块显示为纯文本，没有彩色

**排查**：
1. 检查代码块格式：应该使用三个反引号 + 语言名称
   ```javascript
   // ✅ 正确
   code here
   ```
   
   ```
   // ❌ 错误（没有语言标识）
   code here
   ```

2. 支持的语言列表：JavaScript, Python, Java, C, C++, C#, Go, Rust, TypeScript, HTML, CSS, SQL, JSON, XML, Bash, etc.

### ❓ 页面显示空白

**排查步骤**：
1. 检查浏览器控制台（F12 -> Console）是否有错误
2. 检查开发服务器是否正在运行
3. 尝试访问首页：http://localhost:3000
4. 检查网络选项卡是否有 404 错误

### ❓ 聊天框无响应

**排查**：
1. 检查是否是移动端视图（宽度 < 1024px），聊天框在移动端隐藏
2. 尝试在桌面浏览器上测试
3. 检查浏览器控制台是否有错误信息

---

## 📋 验证清单

运行此命令来验证项目配置：

```bash
# 检查 TypeScript 类型
npm run type-check

# 检查代码规范
npm run lint

# 运行测试（如果配置了）
npm run test
```

---

## 🎯 测试各个功能

### 测试左侧导航

1. 点击不同的章节标题
2. 验证中间内容区域内容已更改
3. 验证当前选中的章节有蓝色背景

### 测试 Markdown 渲染

1. 观察第一章内容是否包含：
   - 标题（h1, h2, h3）
   - 代码块（有语言标签）
   - 表格
   - 链接
   - 加粗文本
   - 数学公式（$formula$）

### 测试聊天功能

1. 在右侧聊天框输入消息
2. 按 Enter 发送
3. 验证：
   - 消息出现在聊天框（蓝色气泡，靠右）
   - 出现加载动画（三个跳动圆点）
   - 1-3 秒后收到 AI 回复（灰色气泡，靠左）

### 测试响应式

1. 在浏览器中按 F12 打开开发者工具
2. 点击响应式设计模式（Ctrl+Shift+M）
3. 调整窗口宽度：
   - **< 768px**：侧边栏隐藏，显示汉堡菜单
   - **768-1024px**：组件逐步调整大小
   - **> 1024px**：三栏全显

---

## 🛠️ 常用开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# 代码规范检查和修复
npm run lint
npm run lint:fix

# 代码格式化
npm run format

# 运行测试
npm run test
npm run test:watch
npm run test:coverage
```

---

## 📚 文件修改指南

### 修改课程内容

编辑：`services/course-service.ts`

```typescript
const MOCK_COURSE: Course = {
  id: 'course-001',
  title: '修改标题',
  description: '修改描述',
  sections: [
    {
      id: 'section-001',
      title: '修改章节标题',
      slug: 'chapter-1',
      order: 1,
      content: '# 修改 Markdown 内容\n\n新的内容在这里...',
      children: [],
    },
    // 添加更多章节...
  ],
};
```

### 修改 AI 回复

编辑：`services/chat-service.ts`

```typescript
const MOCK_AI_RESPONSES = [
  '你的第一条回复',
  '你的第二条回复',
  '你的第三条回复',
  // 添加更多回复...
];
```

### 修改颜色主题

编辑：`tailwind.config.js`

```javascript
colors: {
  blue: { /* 修改蓝色 */ },
  purple: { /* 修改紫色 */ },
  // 自定义其他颜色...
}
```

---

## 🚨 调试技巧

### 启用详细的错误日志

在 `CourseLayout.tsx` 中添加日志：

```typescript
useEffect(() => {
  console.log('选中的章节 ID:', selectedSectionId);
  console.log('当前内容长度:', currentContent.length);
}, [selectedSectionId, currentContent]);
```

### 检查网络请求

在浏览器开发者工具中：
1. 打开 Network 选项卡
2. 重新加载页面
3. 查看是否有任何失败的请求

### 检查组件渲染

使用 React DevTools 浏览器扩展：
1. 打开开发者工具 -> Components 选项卡
2. 查看组件树
3. 检查 props 和 state

---

## 📞 需要帮助？

### 查看项目文档

- 详细指南：[COURSE_PAGE_README.md](./COURSE_PAGE_README.md)
- 完整总结：[COURSE_PAGE_SUMMARY.md](./COURSE_PAGE_SUMMARY.md)
- 本文件：[QUICK_START.md](./QUICK_START.md)

### 检查代码注释

每个文件顶部都有文件级注释，说明其用途：

```bash
# 查看文件说明
head -10 components/course-layout.tsx
head -10 services/course-service.ts
head -10 types/course.ts
```

### 查看错误信息

```bash
# 检查编译错误
npm run type-check 2>&1 | head -20

# 查看开发服务器日志
npm run dev 2>&1 | grep -i error
```

---

## ✅ 下一步

当一切正常运行时，你可以：

1. **自定义内容**
   - 修改课程章节
   - 添加新的学习材料
   - 自定义 AI 回复

2. **接入真实 API**
   - 替换 `course-service.ts` 中的 mock 数据
   - 替换 `chat-service.ts` 中的模拟回复
   - 连接到后端服务器

3. **扩展功能**
   - 添加用户认证
   - 添加进度保存
   - 添加笔记功能
   - 添加搜索功能

4. **部署到生产**
   - 构建：`npm run build`
   - 启动：`npm start`
   - 部署到 Vercel / Netlify

---

**需要帮助？** 查看详细的 [COURSE_PAGE_README.md](./COURSE_PAGE_README.md)
