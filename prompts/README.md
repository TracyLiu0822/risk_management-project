# Prompts 模块

AI Agent 的 Prompt 文本库。

## 概述

Prompts 模块集中管理所有 AI Agent 使用的 Prompt，便于版本控制、优化和复用。

## 目录结构

```
prompts/
├── __init__.py
├── tutor_prompts.py            # 导师 Agent Prompt
├── grading_prompts.py          # 评分 Agent Prompt
├── quiz_prompts.py             # 测试 Agent Prompt
├── teaching_prompts.py         # 教学 Agent Prompt
├── system_prompts.py           # 通用 System Prompt
├── templates/                  # Prompt 模板
│   ├── question_answering.py
│   ├── grading_rubric.py
│   └── analysis_template.py
└── README.md
```

## Prompt 结构

### System Prompt

定义 AI 的角色和行为准则：

```python
# system_prompts.py

TUTOR_SYSTEM_PROMPT = """
您是一位专业的金融风险管理课程导师。您具有以下特点：

1. 专业性：深入理解金融风险管理的所有概念
2. 耐心：能够清晰解释复杂概念
3. 互动性：提出追问帮助学生深化理解
4. 鼓励性：给予学生正面反馈和支持

请根据学生的问题提供清晰、准确的解答。如果问题超出课程范围，请礼貌地指出。
"""

GRADING_SYSTEM_PROMPT = """
您是一位公正、专业的学术评分专家。您的职责是：

1. 根据给定的评分标准进行评分
2. 提供具体、可操作的反馈
3. 指出学生的优点和改进空间
4. 给出改进建议

评分时要公平公正，注重学生的学习成长。
"""
```

### Question-Answering Prompt

处理学生问题：

```python
# tutor_prompts.py

QUESTION_ANSWERING_PROMPT = """
学生问题：{question}

相关课程内容：
{context}

请根据上述课程内容和您的专业知识，为学生的问题提供详细的答案。

答案应该：
1. 清晰准确地回答问题
2. 引用相关的课程内容
3. 提供实际例子帮助理解
4. 如适当，提出可进一步思考的问题

答案：
"""

# 字段说明
# {question} - 学生的问题
# {context} - 从 RAG 检索的相关课程内容
```

### Grading Prompt

评估作业：

```python
# grading_prompts.py

GRADING_PROMPT = """
请根据以下评分标准对学生的提交进行评分。

学生提交内容：
{submission}

评分标准：
{rubric}

相关参考资料：
{reference}

请进行如下评分：
1. 为每个标准项目给出分数
2. 总分（满分 100）
3. 主要优点
4. 需要改进的方面
5. 具体改进建议

评分结果（JSON 格式）：
{
  "total_score": 0,
  "rubric_scores": {},
  "strengths": [],
  "improvements": [],
  "suggestions": []
}
"""
```

### Quiz Generation Prompt

生成测试题目：

```python
# quiz_prompts.py

QUIZ_GENERATION_PROMPT = """
请为以下主题生成 {count} 道 {difficulty} 难度的测试题目。

主题：{topic}
难度：{difficulty}（easy, medium, hard）

要求：
1. 题目应该覆盖主题的关键概念
2. 题目类型：多选题（选择最合适的选项）
3. 每道题有 4 个选项（A, B, C, D）
4. 只有一个正确答案
5. 题目应该逻辑清晰，没有歧义

请以 JSON 格式返回题目：
[
  {
    "id": 1,
    "text": "题目内容",
    "options": ["A选项", "B选项", "C选项", "D选项"],
    "correct_answer": "A",
    "explanation": "为什么这是正确答案的解释"
  }
]
"""
```

### Teaching Analysis Prompt

分析教学效果：

```python
# teaching_prompts.py

TEACHING_ANALYSIS_PROMPT = """
基于以下班级学习数据进行分析：

班级数据：
{class_data}

学生成绩分布：
{grade_distribution}

学习进度信息：
{progress_data}

请进行全面分析，包括：
1. 班级总体学习情况
2. 知识点掌握情况排名
3. 学生分组（优秀、良好、需要帮助）
4. 识别的主要学习困难
5. 针对性的教学改进建议

分析结果（结构化格式）：
{
  "overall_performance": "...",
  "knowledge_ranking": [...],
  "student_groups": {...},
  "main_challenges": [...],
  "recommendations": [...]
}
"""
```

## Prompt 最佳实践

### 1. 清晰的指示

```python
# ✅ 好的例子
GOOD_PROMPT = """
请总结以下文本的要点，使用 3-5 个句子：
{text}
"""

# ❌ 不好的例子
BAD_PROMPT = """
总结一下：
{text}
"""
```

### 2. 明确的格式

```python
# ✅ 指定输出格式
FORMAT_PROMPT = """
请以以下 JSON 格式返回结果：
{
  "answer": "...",
  "confidence": 0-100,
  "sources": []
}
"""
```

### 3. 上下文提供

```python
# ✅ 提供相关背景
CONTEXT_PROMPT = """
根据以下课程内容回答问题：

课程背景：{course_info}
相关内容：{relevant_content}

问题：{question}
"""
```

### 4. 约束和限制

```python
# ✅ 明确约束
CONSTRAINED_PROMPT = """
请回答以下问题，但：
- 只使用提供的课程材料
- 避免假设或推测
- 如果不确定，请说 "我不确定"

问题：{question}
"""
```

## 使用示例

### 在 Agent 中使用 Prompt

```python
from prompts import tutor_prompts
from RAG.rag_pipeline import RAGPipeline

class TutorAgent:
    async def answer_question(self, question: str):
        # 检索相关内容
        pipeline = RAGPipeline()
        context = await pipeline.retrieve_context(question)
        
        # 构建 prompt
        prompt = tutor_prompts.QUESTION_ANSWERING_PROMPT.format(
            question=question,
            context=context["formatted"]
        )
        
        # 调用 LLM
        response = await self.llm.generate(
            system_prompt=tutor_prompts.TUTOR_SYSTEM_PROMPT,
            user_prompt=prompt
        )
        
        return response
```

### 动态 Prompt 模板

```python
# templates/question_answering.py

class QuestionAnsweringTemplate:
    def __init__(self, question: str, context: str):
        self.question = question
        self.context = context
    
    def get_prompt(self) -> str:
        return f"""
学生问题：{self.question}

相关课程内容：
{self.context}

请提供详细的解答...
"""
```

## Prompt 版本管理

为重要的 Prompt 进行版本管理：

```python
# tutor_prompts.py

# v1.0 - 初始版本
TUTOR_SYSTEM_PROMPT_v1 = "..."

# v2.0 - 改进版本（添加了更多指导）
TUTOR_SYSTEM_PROMPT_v2 = "..."

# 使用最新版本
TUTOR_SYSTEM_PROMPT = TUTOR_SYSTEM_PROMPT_v2
```

## 测试和优化

### A/B 测试

```python
# 测试不同的 Prompt 版本
prompts_to_test = [
    tutor_prompts.TUTOR_SYSTEM_PROMPT_v1,
    tutor_prompts.TUTOR_SYSTEM_PROMPT_v2,
]

for prompt in prompts_to_test:
    results = await evaluate_prompt(prompt, test_questions)
    print(f"Prompt 评分: {results.average_score}")
```

### 迭代改进

1. 设定基准：测量当前 Prompt 的性能
2. 进行修改：根据反馈改进 Prompt
3. 测试：使用相同的测试集进行测试
4. 评估：比较改进前后的结果

## Prompt 工程资源

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Prompt Engineering Techniques](https://github.com/dair-ai/Prompt-Engineering-Guide)
- [Chain of Thought Prompting](https://arxiv.org/abs/2201.11903)

## 相关文档

- [Agent 文档](../agents/README.md)
- [RAG 文档](../RAG/README.md)
- [LLM 配置](../config/ai.py)
