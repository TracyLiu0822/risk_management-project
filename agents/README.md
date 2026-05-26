# Agents 模块

AI 智能体系统，包含四个核心 Agent 和相关的辅助功能。

## 概述

Agents 模块实现了平台的核心 AI 功能，包括导师、评分、测试生成和教学分析。每个 Agent 都可以独立配置和扩展。

## 目录结构

```
agents/
├── __init__.py
├── tutor_agent.py              # 导师 Agent - 学生问答
├── grading_agent.py            # 评分 Agent - 作业评估
├── quiz_agent.py               # 测试 Agent - 题目生成
├── teaching_agent.py           # 教学 Agent - 效果分析
├── base_agent.py               # 基础 Agent 类
├── prompts/                    # 各 Agent 的 Prompt
│   ├── tutor_prompts.py
│   ├── grading_prompts.py
│   ├── quiz_prompts.py
│   └── teaching_prompts.py
├── utils/                      # Agent 工具函数
│   ├── llm_utils.py
│   ├── context_builder.py
│   └── response_formatter.py
├── config/                     # Agent 配置
│   └── agent_config.py
└── README.md
```

## 核心 Agents

### 1. Tutor Agent (导师 Agent)

**功能**: 回答学生问题，解释课程概念

**关键方法**:
- `answer_question(question: str, context: str)` - 回答问题
- `explain_concept(concept: str)` - 解释概念
- `generate_follow_up_questions()` - 生成追问

**配置**:
- 模型: GPT-4
- 温度: 0.7
- 最大 Token: 2000

### 2. Grading Agent (评分 Agent)

**功能**: 自动评估学生作业，提供构建性反馈

**关键方法**:
- `grade_submission(submission: str, rubric: dict)` - 评分
- `generate_feedback(grade: int, submission: str)` - 生成反馈
- `identify_improvements()` - 建议改进

**配置**:
- 模型: GPT-4
- 温度: 0.3 (更严格)
- 最大 Token: 1500

### 3. Quiz Agent (测试 Agent)

**功能**: 生成自适应测试题目，根据学生水平调整难度

**关键方法**:
- `generate_questions(topic: str, difficulty: str, count: int)` - 生成题目
- `evaluate_answer(question: str, answer: str)` - 评估答案
- `adjust_difficulty()` - 调整难度

**配置**:
- 模型: GPT-4
- 温度: 0.5
- 最大 Token: 1000

### 4. Teaching Agent (教学 Agent)

**功能**: 分析教学效果，提供改进建议

**关键方法**:
- `analyze_class_performance()` - 分析班级表现
- `identify_struggling_students()` - 识别困难学生
- `generate_recommendations()` - 生成建议

**配置**:
- 模型: GPT-4
- 温度: 0.6
- 最大 Token: 2500

## 使用示例

### 使用 Tutor Agent

```python
from agents.tutor_agent import TutorAgent

tutor = TutorAgent()

# 回答学生问题
response = await tutor.answer_question(
    question="什么是系统性风险?",
    context="第3章：风险类型"
)

print(response.answer)
print(response.resources)
```

### 使用 Grading Agent

```python
from agents.grading_agent import GradingAgent

grader = GradingAgent()

# 评分作业
result = await grader.grade_submission(
    submission="学生的作业内容...",
    rubric={
        "accuracy": 30,
        "clarity": 40,
        "completeness": 30
    }
)

print(f"分数: {result.score}")
print(f"反馈: {result.feedback}")
```

### 使用 Quiz Agent

```python
from agents.quiz_agent import QuizAgent

quiz = QuizAgent()

# 生成题目
questions = await quiz.generate_questions(
    topic="金融风险管理基础",
    difficulty="intermediate",
    count=5
)

for q in questions:
    print(q.text)
    print(q.options)
```

### 使用 Teaching Agent

```python
from agents.teaching_agent import TeachingAgent

teacher_agent = TeachingAgent()

# 分析教学效果
analysis = await teacher_agent.analyze_class_performance(
    class_id=1,
    period="week"  # week, month, semester
)

print(analysis.insights)
print(analysis.recommendations)
```

## 开发指南

### 创建自定义 Agent

```python
from agents.base_agent import BaseAgent

class CustomAgent(BaseAgent):
    def __init__(self):
        super().__init__("custom")
    
    async def process(self, input_data: dict) -> dict:
        # 实现自定义逻辑
        return {"result": "..."}
```

### 配置 Agent

在 `config/agent_config.py` 中配置：

```python
AGENT_CONFIG = {
    "tutor": {
        "model": "gpt-4",
        "temperature": 0.7,
        "max_tokens": 2000,
    },
    # ... 其他 Agent 配置
}
```

### 测试 Agent

```python
import pytest
from agents.tutor_agent import TutorAgent

@pytest.mark.asyncio
async def test_tutor_agent():
    tutor = TutorAgent()
    response = await tutor.answer_question(
        question="测试问题",
        context="测试上下文"
    )
    assert response.answer is not None
```

## Prompt 管理

所有 Agent 的 Prompt 文本存储在 `prompts/` 目录下，便于维护和优化：

```python
# prompts/tutor_prompts.py
SYSTEM_PROMPT = """
You are an expert tutor for financial risk management...
"""

QUESTION_PROMPT = """
Answer the following question about {topic}:
{question}

Provide a clear, detailed explanation...
"""
```

## 最佳实践

1. **上下文管理**: 总是传递相关的课程上下文
2. **错误处理**: 实现重试逻辑和错误降级
3. **缓存**: 缓存相同的查询结果以提高性能
4. **监控**: 记录 Agent 的调用和响应质量
5. **评估**: 定期评估 Agent 的输出质量

## 依赖

- langchain >= 0.1.0
- openai >= 1.3.0
- pydantic >= 2.0

## 性能优化

- 批量处理请求以减少 API 调用次数
- 实现请求队列和速率限制
- 使用缓存存储常见问题的答案
- 监控 Token 使用情况以控制成本

## 故障排除

### Agent 响应缓慢
- 检查网络连接
- 验证 OpenAI API 密钥是否有效
- 检查 Token 限制是否过低

### 质量问题
- 优化 Prompt 文本
- 调整温度参数
- 提供更好的上下文

## 相关文档

- [API 文档](../docs/)
- [配置指南](./config/)
- [故障排除](../docs/troubleshooting.md)
