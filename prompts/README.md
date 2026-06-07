# Prompts

当前生效 Prompt 只有：

```text
agents/prompts/tutor_prompt.txt
```

它要求 Tutor：

- 只使用检索上下文。
- 给出来源引用。
- 资料不足时拒绝推测。
- 不提供投资或法律建议。

根目录 `prompts/` 当前没有运行时代码，旧文档中 Grading、Quiz、Teaching Prompt 均为未来规划。

2026-06-07：重写 Tutor Prompt，修复乱码并强化引用和拒答规则。
