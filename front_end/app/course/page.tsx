/**
 * 学生学习页面
 * 课程学习的主入口页面
 * 集成课程导航、内容展示和 AI 聊天助手
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Course } from '@/types/course';
import { CourseLayout } from '@/components/course-layout';
import { getCourse } from '@/services/course-service';

/**
 * CoursePage 组件
 */
export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载课程数据
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const response = await getCourse();

        if (response.success) {
          setCourse(response.data);
          setError(null);
        } else {
          setError(response.error || '加载课程失败');
          // 即使失败也使用默认数据继续显示
          setCourse(response.data);
        }
      } catch (err) {
        console.error('加载课程数据时出错:', err);
        setError('加载课程数据失败，请刷新重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">加载课程中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">加载课程失败</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return <CourseLayout course={course} />;
}
