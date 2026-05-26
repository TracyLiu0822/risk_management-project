'use client';

import Link from 'next/link';
import { BookOpen, Users, Brain, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">Risk Management Platform</div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-primary-600">
              登录
            </Link>
            <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              注册
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-responsive py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          <span className="gradient-text">AI 赋能的金融风险管理学习平台</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          融合先进 AI 技术与教育方法，为本科生打造智能化的《金融风险管理》学习体验
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/login"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            学生登录
          </Link>
          <Link 
            href="/teacher/login"
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            教师登录
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-responsive">
          <h2 className="text-3xl font-bold text-center mb-12">
            核心功能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student Features */}
            <div className="card-hover">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">课程学习</h3>
              <p className="text-gray-600 text-sm">
                结构化的课程内容，由浅入深的学习路径，帮助学生建立知识框架
              </p>
            </div>

            {/* AI Tutor */}
            <div className="card-hover">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI 导师</h3>
              <p className="text-gray-600 text-sm">
                24/7 AI 问答，实时解答学生疑惑，提供个性化学习建议
              </p>
            </div>

            {/* Quiz & Assessment */}
            <div className="card-hover">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">测试评估</h3>
              <p className="text-gray-600 text-sm">
                自适应测试，及时反馈，帮助学生识别知识薄弱点
              </p>
            </div>

            {/* Learning Analytics */}
            <div className="card-hover">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">学习分析</h3>
              <p className="text-gray-600 text-sm">
                全方位学习数据分析，教师可优化教学策略
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20">
        <div className="container-responsive">
          <h2 className="text-3xl font-bold text-center mb-12">
            AI Agent 系统
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-3 text-primary-600">学生端 Agent</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>导师 Agent:</strong> 解答课程问题，指导学习</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>测试 Agent:</strong> 生成自适应题目，评估掌握情况</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-3 text-primary-600">教师端 Agent</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>评分 Agent:</strong> 自动评估作业，提供反馈</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>教学 Agent:</strong> 分析教学效果，提出建议</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-bold mb-4">
            开启您的学习之旅
          </h2>
          <p className="text-lg mb-8 opacity-90">
            加入数百名使用我们平台的学生，提升金融风险管理学习效果
          </p>
          <Link 
            href="/register"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            立即注册
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">关于平台</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">项目简介</a></li>
                <li><a href="#" className="hover:text-white">技术栈</a></li>
                <li><a href="#" className="hover:text-white">开发团队</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">快速链接</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">API 文档</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">联系方式</h4>
              <ul className="space-y-2 text-sm">
                <li>苏州大学商学院</li>
                <li>指导教师：刘亮 教授</li>
                <li>开发团队：陈晗之、刘雨暄</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 Risk Management Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
