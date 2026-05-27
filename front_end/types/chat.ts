/**
 * AI 聊天相关的类型定义
 * 用于消息管理和聊天服务
 */

export type MessageRole = 'user' | 'ai';

/** 单条聊天消息 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

/** 聊天服务的响应类型 */
export interface ChatServiceResponse {
  success: boolean;
  message: string;
  error?: string;
}

/** 聊天上下文 */
export interface ChatContext {
  messages: ChatMessage[];
  isLoading: boolean;
}
