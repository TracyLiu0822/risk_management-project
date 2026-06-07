'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import authService from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [teacherCode, setTeacherCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.register({
        email,
        password,
        role,
        teacher_code: role === 'teacher' ? teacherCode : undefined,
      });
      router.push(user.role === 'teacher' ? '/teacher/history' : '/student/tutor');
    } catch {
      setError('注册失败。邮箱可能已被使用，或输入不符合要求。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">创建账号</h1>
          <p className="mt-1 text-sm text-slate-600">密码至少 8 位。</p>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">邮箱</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        {role === 'teacher' && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">教师注册码</span>
            <input
              type="password"
              value={teacherCode}
              onChange={(event) => setTeacherCode(event.target.value)}
              required
            />
          </label>
        )}
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium">身份</span>
          <select value={role} onChange={(event) => setRole(event.target.value as 'student' | 'teacher')}>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
          </select>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? '创建中...' : '注册并登录'}
        </button>
        <p className="text-center text-sm text-slate-600">
          已有账号？ <Link href="/login" className="text-primary-700">登录</Link>
        </p>
      </form>
    </main>
  );
}
