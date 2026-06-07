'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import authService from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.login({ email, password });
      router.push(user.role === 'teacher' ? '/teacher/history' : '/student/tutor');
    } catch {
      setError('登录失败，请检查邮箱和密码。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="mt-1 text-sm text-slate-600">学生和教师使用同一登录入口。</p>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">邮箱</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? '登录中...' : '登录'}
        </button>
        <p className="text-center text-sm text-slate-600">
          还没有账号？ <Link href="/register" className="text-primary-700">注册</Link>
        </p>
      </form>
    </main>
  );
}
