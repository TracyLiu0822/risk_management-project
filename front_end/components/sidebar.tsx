/**
 * 左侧课程章节导航栏组件
 * 展示课程章节列表，支持选中高亮和展开/折叠
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CourseSection } from '@/types/course';

interface SidebarProps {
  sections: CourseSection[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  isOpen: boolean;
}

interface SectionItemProps {
  section: CourseSection;
  isSelected: boolean;
  onSelect: (sectionId: string) => void;
  level?: number;
}

/**
 * 单个章节项目组件
 */
const SectionItem: React.FC<SectionItemProps> = ({
  section,
  isSelected,
  onSelect,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = section.children && section.children.length > 0;
  const paddingLeft = level * 1.25; // 递归缩进

  return (
    <div>
      <button
        onClick={() => {
          onSelect(section.id);
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
        }}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isSelected
            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${12 + paddingLeft}px` }}
      >
        {/* 展开/折叠箭头 */}
        {hasChildren && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-4"></span>}

        {/* 章节标题 */}
        <span className="flex-1 text-left truncate">{section.title}</span>
      </button>

      {/* 子章节列表（递归渲染） */}
      {hasChildren && isExpanded && (
        <div>
          {section.children!.map((child) => (
            <SectionItem
              key={child.id}
              section={child}
              isSelected={isSelected}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Sidebar 组件
 */
export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  isOpen,
}) => {
  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex-1 p-4 space-y-1">
          {sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onSelect={onSelectSection}
            />
          ))}
        </div>
      </aside>

      {/* 移动端侧边栏（模态框） */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* 背景遮罩 */}
          <div className="fixed inset-0 bg-black bg-opacity-50" />

          {/* 侧边栏面板 */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-1">
              {sections.map((section) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={onSelectSection}
                />
              ))}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
