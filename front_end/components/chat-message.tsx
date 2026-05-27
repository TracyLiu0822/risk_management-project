/**
 * 单条聊天消息气泡组件
 * 支持用户消息（靠右）和 AI 消息（靠左）
 */

'use client';

import React from 'react';
import { ChatMessage } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessage;
}

/**
 * ChatMessage 组件
 */
export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* AI 消息气泡 */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
      )}

      {/* 消息内容 */}
      <div
        className={`max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* 用户消息头像 */}
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">U</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageComponent;
