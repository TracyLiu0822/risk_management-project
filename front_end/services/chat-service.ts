/**
 * AI 聊天服务层
 * 提供 AI 聊天回复接口，当前使用 mock 数据
 * TODO: 替换为真实 API 调用
 */

import { ChatServiceResponse } from '@/types/chat';

/** AI 回复的 Mock 数据池 */
const MOCK_AI_RESPONSES = [
  '这是一个很好的问题！根据课程内容，我认为关键是理解风险管理的核心原则。你可以通过以下方式深入学习：\n1. 阅读更多相关案例\n2. 完成练习题\n3. 观看补充视频',

  '让我帮你分析一下这个问题。首先，我们需要考虑几个关键因素：\n- 市场环境\n- 组织的风险偏好\n- 可用的风险管理工具\n\n根据 Basel III 框架，你还应该考虑资本充足率的要求。',

  '非常好！你指出了风险管理中的一个重要方面。在实践中，很多机构都面临类似的挑战。我建议：\n1. 建立强大的风险文化\n2. 实施有效的控制措施\n3. 定期进行压力测试和情景分析',

  '这涉及到数学模型和实际应用的结合。根据本章所学，我们可以使用 VaR 或 CVaR 来量化风险。在你的具体场景中，我建议使用历史模拟法或参数法。',

  '很有见地！你已经掌握了本章的核心内容。下一步，我建议你：\n1. 深入学习衍生品和对冲工具\n2. 研究真实的案例研究\n3. 尝试自己进行风险计算',

  '根据课程内容，这个问题的答案取决于多个因素。让我为你详细解释：\n\n首先，我们需要理解基本概念...（请继续阅读课程内容以获取完整答案）',
];

/**
 * 发送聊天消息并获取 AI 回复
 * TODO: 替换为真实 API 调用
 */
export async function sendChatMessage(userMessage: string): Promise<ChatServiceResponse> {
  try {
    // 模拟网络延迟 (1-3 秒)
    const delay = Math.random() * 2000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 从 mock 数据中随机选择一个回复
    const randomIndex = Math.floor(Math.random() * MOCK_AI_RESPONSES.length);
    const aiReply = MOCK_AI_RESPONSES[randomIndex];

    return {
      success: true,
      message: aiReply,
    };
  } catch (error) {
    return {
      success: false,
      message: '',
      error: '获取 AI 回复失败，请稍后重试',
    };
  }
}

/**
 * 验证消息内容
 * TODO: 根据实际需求调整验证规则
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return {
      valid: false,
      error: '消息内容不能为空',
    };
  }

  if (message.length > 5000) {
    return {
      valid: false,
      error: '消息内容过长，不能超过 5000 字符',
    };
  }

  return {
    valid: true,
  };
}
