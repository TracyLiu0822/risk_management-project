'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import authService from '@/services/authService';
import tutorService from '@/services/tutorService';
import type { ChatHistoryItem } from '@/types/api';

export default function TeacherHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      const user = await authService.getProfile();
      if (user.role !== 'teacher') {
        router.replace('/student/tutor');
        return;
      }
      const result = await tutorService.getTeacherHistory();
      setHistory(result.items);
    } catch {
      setError('无法读取记录，请确认已使用教师账号登录。');
    }
  }, [router]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function logout() {
    await authService.logout();
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container-responsive flex items-center justify-between py-4">
          <div>
            <h1 className="font-bold">教师问答审阅</h1>
            <p className="text-sm text-slate-500">查看学生问题、回答和检索来源。</p>
          </div>
          <button onClick={() => void logout()} className="text-sm text-slate-600">退出登录</button>
        </div>
      </header>
      <section className="container-responsive py-8">
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="space-y-5">
          {history.length === 0 && !error && <div className="card text-slate-500">暂无学生问答记录。</div>}
          {history.map((item) => (
            <article key={item.id} className="card">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-semibold">{item.student_email ?? item.user_id}</p>
                <time className="text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleString('zh-CN')}
                </time>
              </div>
              <h2 className="mt-4 font-medium">问题：{item.question}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.answer}</p>
              <ul className="mt-4 space-y-1 text-xs text-slate-500">
                {item.sources.map((source) => (
                  <li key={`${item.id}-${source.source_id}`}>
                    来源：{source.title}（{source.source_id}）
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
