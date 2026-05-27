/**
 * 汉堡菜单按钮组件
 * 用于移动端展示/隐藏侧边栏
 */

'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * HamburgerButton 组件
 */
export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="切换菜单"
    >
      {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
    </button>
  );
};

export default HamburgerButton;
