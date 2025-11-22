import React from 'react';

const MessageRenderer = ({ content, type }) => {
  if (type === 'user') {
    return <div className="message-text">{content}</div>;
  }

  // Enhanced AI response formatting
  const formatAIResponse = (text) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Handle code blocks
      if (paragraph.includes('```')) {
        const parts = paragraph.split('```');
        return (
          <div key={index} className="paragraph">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                // This is a code block
                const lines = part.split('\n');
                const language = lines[0] || '';
                const code = lines.slice(1).join('\n');
                
                return (
                  <div key={partIndex} className="code-block">
                    <div className="code-header">
                      <div className="code-controls">
                        <div className="window-dot dot-red"></div>
                        <div className="window-dot dot-yellow"></div>
                        <div className="window-dot dot-green"></div>
                      </div>
                      <span className="code-language">{language}</span>
                      <button 
                        className="copy-code-btn"
                        onClick={() => navigator.clipboard.writeText(code)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy code
                      </button>
                    </div>
                    <pre className="code-content">
                      <code>{code}</code>
                    </pre>
                  </div>
                );
              } else {
                // Regular text
                return <span key={partIndex}>{formatInlineElements(part)}</span>;
              }
            })}
          </div>
        );
      }
      
      // Handle bullet points
      if (paragraph.includes('•') || paragraph.includes('*')) {
        const lines = paragraph.split('\n');
        const listItems = [];
        let currentText = '';
        
        lines.forEach(line => {
          if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
            if (currentText) {
              listItems.push({ type: 'text', content: currentText });
              currentText = '';
            }
            listItems.push({ 
              type: 'bullet', 
              content: line.replace(/^[\s•*]+/, '').trim() 
            });
          } else {
            currentText += (currentText ? '\n' : '') + line;
          }
        });
        
        if (currentText) {
          listItems.push({ type: 'text', content: currentText });
        }
        
        return (
          <div key={index} className="paragraph">
            {listItems.map((item, itemIndex) => {
              if (item.type === 'bullet') {
                return (
                  <div key={itemIndex} className="bullet-point">
                    <span className="bullet">•</span>
                    <span className="bullet-text">{formatInlineElements(item.content)}</span>
                  </div>
                );
              } else {
                return (
                  <div key={itemIndex} className="text-content">
                    {formatInlineElements(item.content)}
                  </div>
                );
              }
            })}
          </div>
        );
      }
      
      // Handle headings
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)[0].length;
        const text = paragraph.replace(/^#+\s*/, '');
        const HeadingTag = `h${Math.min(level, 6)}`;
        
        return (
          <HeadingTag key={index} className={`heading heading-${level}`}>
            {formatInlineElements(text)}
          </HeadingTag>
        );
      }
      
      // Regular paragraph
      return (
        <div key={index} className="paragraph">
          {formatInlineElements(paragraph)}
        </div>
      );
    });
  };

  const formatInlineElements = (text) => {
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Handle links (basic)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="message-link">$1</a>'
    );
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="ai-response">
      {formatAIResponse(content)}
    </div>
  );
};

export default MessageRenderer;