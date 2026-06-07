# 项目协作流程

## 分支与提交

- `main` 必须保持可启动。
- 功能从 `feature/<name>` 分支开发。
- 一次提交只解决一个明确问题。
- 禁止提交 `.env`、数据库文件、虚拟环境和 `node_modules`。

## 完成定义

一个任务只有满足以下条件才算完成：

1. 路由或页面已经接入真实业务，不是固定占位返回。
2. 角色和权限边界明确。
3. 至少覆盖成功路径与一个失败/拒绝路径。
4. 本地测试、类型检查或构建结果已记录。
5. README、`docs/PROGRESS.md` 和 `docs/CHANGELOG.md` 已同步。

## 每日流程

开发前：

```powershell
git status
git pull origin main
git checkout -b feature/<task>
```

提交前：

```powershell
.\.venv\Scripts\python.exe -m pytest -q
Set-Location front_end
npm run type-check
npm run build
```

如果某项验证因环境原因无法执行，必须在 PR 和变更日志中写明。

## 当前职责边界

### 已稳定模块

- 认证和角色权限
- Tutor 本地 RAG 问答
- 聊天记录
- 教师问答审阅

修改这些模块必须运行完整后端测试。

### 下一阶段模块

- 课程、章节、班级、选课、学习进度
- 资料与课程/章节的关联
- 班级范围的教师权限

### 暂缓模块

- Grading Agent
- Quiz Agent
- Teaching Agent
- Kubernetes、微服务和复杂 DevOps

## Prompt 纪律

- Prompt 必须放在独立文件并进入版本控制。
- 修改 Prompt 时记录目标、样例和验证结果。
- AI 输出不能替代业务权限、数据库约束或确定性计算。
- 新增 Agent 前必须先准备固定评测集。

## 文档纪律

- “已实现”必须能在代码中定位并通过接口调用。
- 占位接口必须明确标记为“占位”。
- 不为尚不存在的文件创建文档链接。
- 每个里程碑完成后更新具体日期和验证结果。
