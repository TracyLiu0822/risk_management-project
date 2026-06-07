import Link from 'next/link';
import { BookOpen, Brain, History, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: '课程资料检索',
    description: '从教师维护的课程资料中检索相关内容。',
    icon: BookOpen,
  },
  {
    title: 'AI 导师问答',
    description: '回答附带资料来源，降低无依据生成的风险。',
    icon: Brain,
  },
  {
    title: '学习记录',
    description: '学生可以回顾问题、答案和引用来源。',
    icon: History,
  },
  {
    title: '教师审阅',
    description: '教师可以查看学生问答记录并发现共性问题。',
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="container-responsive flex items-center justify-between py-4">
          <span className="text-xl font-bold text-primary-700">Risk Management Platform</span>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-md px-4 py-2 text-primary-700">
              登录
            </Link>
            <Link href="/register" className="rounded-md bg-primary-600 px-4 py-2 text-white">
              注册
            </Link>
          </div>
        </div>
      </nav>

      <section className="container-responsive py-20 text-center">
        <p className="mb-3 font-semibold text-primary-600">金融风险管理课程 MVP</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          基于课程资料、可追溯来源的 AI 学习助手
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          当前版本聚焦一条完整业务闭环：学生提问、资料检索、AI 回答、记录保存和教师审阅。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white">
            开始使用
          </Link>
          <Link href="/teacher/history" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold">
            教师审阅入口
          </Link>
        </div>
      </section>

      <section className="container-responsive grid gap-6 pb-20 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="card">
            <Icon className="mb-4 text-primary-600" />
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
