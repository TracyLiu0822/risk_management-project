'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import authService from '@/services/authService';
import tutorService from '@/services/tutorService';
import type { ChatHistoryItem, TutorAnswer } from '@/types/api';

export default function StudentTutorPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<TutorAnswer | null>(null);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const user = await authService.getProfile();
      if (user.role !== 'student') {
        router.replace('/teacher/history');
        return;
      }
      const result = await tutorService.getStudentHistory();
      setHistory(result.items);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await tutorService.ask(question);
      setAnswer(result);
      setQuestion('');
      await loadHistory();
    } catch {
      setError('暂时无法生成回答，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authService.logout();
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container-responsive flex items-center justify-between py-4">
          <h1 className="font-bold">学生 AI 导师</h1>
          <button onClick={() => void logout()} className="text-sm text-slate-600">退出登录</button>
        </div>
      </header>
      <div className="container-responsive grid gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <h2 className="text-xl font-semibold">向课程导师提问</h2>
              <p className="mt-1 text-sm text-slate-600">回答只使用当前课程资料，并附带来源。</p>
            </div>
            <textarea
              rows={5}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：VaR 有哪些局限？"
              minLength={2}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary-600 px-5 py-2 font-semibold text-white disabled:opacity-60"
            >
              {loading ? '检索并回答中...' : '提交问题'}
            </button>
          </form>

          {answer && (
            <article className="card">
              <h2 className="font-semibold">最新回答</h2>
              <p className="mt-4 whitespace-pre-wrap leading-7">{answer.answer}</p>
              <SourceList sources={answer.sources} />
            </article>
          )}
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">历史记录</h2>
          <div className="mt-4 space-y-5">
            {history.length === 0 && <p className="text-sm text-slate-500">还没有问答记录。</p>}
            {history.map((item) => (
              <article key={item.id} className="border-b pb-5 last:border-0">
                <p className="font-medium">{item.question}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.answer}</p>
                <SourceList sources={item.sources} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SourceList({ sources }: { sources: TutorAnswer['sources'] }) {
  if (sources.length === 0) {
    return <p className="mt-3 text-xs text-amber-700">本次没有匹配到课程来源。</p>;
  }
  return (
    <ul className="mt-4 space-y-1 text-xs text-slate-500">
      {sources.map((source) => (
        <li key={`${source.source_id}-${source.relevance_score}`}>
          {source.title} · {source.source_id} · 相关度 {source.relevance_score.toFixed(3)}
        </li>
      ))}
    </ul>
  );
}
