/**
 * AI 聊天框整体组件
 * 集成消息列表、消息气泡和输入框
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage, ChatContext } from '@/types/chat';
import ChatMessageComponent from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { LoadingDots } from '@/components/loading-dots';

interface ChatBoxProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

/**
 * ChatBox 组件
 */
export const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /**
   * 处理发送消息
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) {
      return;
    }

    setIsSending(true);
    try {
      await onSendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="hidden lg:flex flex-col h-full w-80 border-l border-gray-200 bg-white">
      {/* 聊天标题 */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">AI 学习助手</h2>
        <p className="text-xs text-gray-500 mt-0.5">有问题？我来帮你解答</p>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm text-gray-500 font-medium">开始提问吧！</p>
              <p className="text-xs text-gray-400 mt-1">
                有任何关于课程的问题，我都可以帮助你解答
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}

            {/* AI 正在生成回复 */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex-shrink-0 mr-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2.5">
                  <LoadingDots className="text-gray-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入框 */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isSending || isLoading}
      />
    </div>
  );
};

export default ChatBox;
