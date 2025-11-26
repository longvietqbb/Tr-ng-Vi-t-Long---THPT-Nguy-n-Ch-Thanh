import React, { useEffect, useRef } from 'react';

// Declaration for the global objects loaded via CDN
declare const marked: any;
declare const MathJax: any;

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && typeof marked !== 'undefined') {
      // 1. Render Markdown to HTML
      marked.setOptions({
        breaks: true,
        gfm: true
      });
      
      // Sanitize/Prepare content if necessary before parsing (optional)
      const rawHtml = marked.parse(content);
      containerRef.current.innerHTML = rawHtml;

      // 2. Trigger MathJax Typesetting
      if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        MathJax.typesetPromise([containerRef.current])
          .then(() => {
            // MathJax rendering complete
          })
          .catch((err: any) => console.error('MathJax typeset failed:', err));
      }
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={`math-content break-words ${className}`}
    />
  );
};

export default MarkdownRenderer;