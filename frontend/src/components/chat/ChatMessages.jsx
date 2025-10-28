import React, { useEffect, useRef } from 'react';
import './ChatMessages.css';
import MessageRenderer from './MessageRenderer';

const ChatMessages = ({ messages, isSending }) => {
  const bottomRef = useRef(null);
  
  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages.length, isSending]);

  const formatTime = (timestamp) => {
    return new Date(timestamp || Date.now()).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="messages" aria-live="polite">
      {messages.map((m, index) => (
        <div key={index} className={`msg msg-${m.type}`}>
          <div className="msg-header">
            <div className="msg-avatar">
              {m.type === 'user' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </div>
            <div className="msg-info">
              <div className="msg-role">{m.type === 'user' ? 'You' : 'AI Assistant'}</div>
              <div className="msg-time">{formatTime(m.timestamp)}</div>
            </div>
          </div>
          <div className="msg-bubble">
            <div className="msg-content">
              <MessageRenderer content={m.content} type={m.type} />
            </div>
          </div>
          <div className="msg-actions" role="group" aria-label="Message actions">
            <button 
              type="button" 
              className="action-btn" 
              aria-label="Copy message" 
              onClick={() => navigator.clipboard.writeText(m.content)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            {m.type === 'ai' && (
              <>
                <button type="button" className="action-btn" aria-label="Like response">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 10v11" />
                    <path d="M15 21H9a2 2 0 0 1-2-2v-9l5-7 1 1a2 2 0 0 1 .5 1.3V9h5a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2Z" />
                  </svg>
                </button>
                <button type="button" className="action-btn" aria-label="Dislike response">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 14V3" />
                    <path d="M9 3h6a2 2 0 0 1 2 2v9l-5 7-1-1a2 2 0 0 1-.5-1.3V15H5a2 2 0 0 1-2-2l2-8a2 2 0 0 1 2-2Z" />
                  </svg>
                </button>
                
              </>
            )}
          </div>
        </div>
      ))}
      {isSending && (
        <div className="msg msg-ai pending">
          <div className="msg-header">
            <div className="msg-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="msg-info">
              <div className="msg-role">AI Assistant</div>
              <div className="msg-time">Thinking...</div>
            </div>
          </div>
          <div className="msg-bubble">
            <div className="typing-indicator">
              <div className="gemini-typing">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
