/**
 * 课程整体布局组件
 * 组装左侧导航、中间内容、右侧聊天框的三栏布局
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Course, CourseSection } from '@/types/course';
import { ChatMessage } from '@/types/chat';
import Sidebar from '@/components/sidebar';
import MarkdownRenderer from '@/components/markdown-renderer';
import ChatBox from '@/components/chat-box';
import { HamburgerButton } from '@/components/hamburger-button';
import { sendChatMessage, validateMessage } from '@/services/chat-service';

interface CourseLayoutProps {
  course: Course;
}

/**
 * CourseLayout 组件
 */
export const CourseLayout: React.FC<CourseLayoutProps> = ({ course }) => {
  // 课程内容状态
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    course.sections[0]?.id || null
  );
  const [currentContent, setCurrentContent] = useState<string>('');

  // 聊天状态
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // 移动端侧边栏状态
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 初始化选中章节内容
  useEffect(() => {
    const findSection = (sections: CourseSection[]): CourseSection | undefined => {
      for (const section of sections) {
        if (section.id === selectedSectionId) {
          return section;
        }
        if (section.children) {
          const found = findSection(section.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const section = findSection(course.sections);
    if (section) {
      setCurrentContent(section.content);
      // 关闭移动端侧边栏
      setSidebarOpen(false);
      // 重置滚动位置
      const contentArea = document.querySelector('[data-scroll-target]');
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
    }
  }, [selectedSectionId, course.sections]);

  /**
   * 处理发送聊天消息
   */
  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      // 验证消息
      const validation = validateMessage(userMessage);
      if (!validation.valid) {
        alert(validation.error || '消息验证失败');
        return;
      }

      // 添加用户消息
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoadingChat(true);

      try {
        // 获取 AI 回复
        const response = await sendChatMessage(userMessage);

        if (response.success) {
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'ai',
            content: response.message,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          // 显示错误消息
          const errorMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'ai',
            content: response.error || '无法获取回复，请稍后重试',
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          content: '发生错误，请稍后重试',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoadingChat(false);
      }
    },
    []
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 左侧导航栏 */}
      <Sidebar
        sections={course.sections}
        selectedSectionId={selectedSectionId}
        onSelectSection={setSelectedSectionId}
        isOpen={sidebarOpen}
      />

      {/* 中间内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 头部 - 只在移动端显示 */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <HamburgerButton
            isOpen={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
          <div className="w-10" /> {/* 占位符保持对称 */}
        </div>

        {/* 内容展示区 */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          data-scroll-target
        >
          <div className="max-w-4xl mx-auto">
            {currentContent ? (
              <MarkdownRenderer content={currentContent} />
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">请选择一个章节开始学习</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 右侧聊天框 */}
      <ChatBox
        messages={messages}
        isLoading={isLoadingChat}
        onSendMessage={handleSendMessage}
      />

      {/* 移动端侧边栏遮罩关闭事件处理 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CourseLayout;
