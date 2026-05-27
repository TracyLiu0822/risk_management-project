/**
 * Markdown 渲染组件（修复：清理语法错误，使用标准 CSS keyframes，动态加载 KaTeX auto-render）
 */

'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const htmlContent = useMemo(() => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (code, lang) => {
        try {
          if (lang && hljs.getLanguage(lang)) {
            return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`;
          }
        } catch (e) {
          console.error('代码高亮失败:', e);
        }
        return `<pre class="hljs"><code>${hljs.highlightAuto(code).value}</code></pre>`;
      },
    });

    const originalFence = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
      const token = tokens[idx];
      const info = token.info ? String(token.info).trim() : '';
      const lang = info.split(/\s+/g)[0] || '';

      const rendered = originalFence ? originalFence(tokens, idx, options, env, renderer) : `<pre class="hljs"><code>${md.utils.escapeHtml(token.content)}</code></pre>`;

      if (lang) {
        return `<div class="relative"><div class="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-700 rounded-bl">${lang}</div>${rendered}</div>`;
      }

      return rendered;
    };

    return md.render(content || '');
  }, [content]);

  useEffect(() => {
    if (!containerRef.current) return;
    import('katex/dist/contrib/auto-render.mjs')
      .then((mod) => {
        const renderMathInElement = (mod as any).default || (mod as any).renderMathInElement || (mod as any);
        try {
          renderMathInElement(containerRef.current!, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
            ],
          });
        } catch (e) {
          console.error('KaTeX 渲染失败:', e);
        }
      })
      .catch((e) => console.error('加载 KaTeX auto-render 失败:', e));
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="markdown-content prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
