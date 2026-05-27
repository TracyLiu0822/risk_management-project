/**
 * 加载动画组件（三个跳动圆点）
 * 用于显示 AI 正在生成回复
 */

'use client';

import React from 'react';

interface LoadingDotsProps {
  className?: string;
}

/**
 * LoadingDots 组件
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-8px);
            opacity: 0.6;
          }
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          animation: bounce 1.4s infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
      <span className="loading-dot text-gray-400" />
      <span className="loading-dot text-gray-400" />
      <span className="loading-dot text-gray-400" />
    </div>
  );
};

export default LoadingDots;
