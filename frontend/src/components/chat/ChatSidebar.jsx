import React from 'react';
import './ChatSidebar.css';


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, open }) => {


  
  return (
    <aside className={`chat-sidebar ${open ? 'open' : ''} desktop-visible`} aria-label="Previous chats">
      <div className="sidebar-top">
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New chat
        </button>
      </div>
      
      <div className="sidebar-header">
        <h2>Recent</h2>
      </div>
      
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          <div
            key={c._id}
            className={"chat-list-item-wrapper " + (c._id === activeChatId ? 'active' : '')}
          >
            <button
              className="chat-list-item"
              onClick={() => onSelectChat(c._id)}
            >
              <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="title-line">{c.title}</span>
            </button>
            <button
              className="delete-chat-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(c._id);
              }}
              aria-label="Delete chat"
              title="Delete chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        ))}
        {chats.length === 0 && (
          <div className="empty-state">
            <p className="empty-hint">No conversations yet</p>
            <p className="empty-subtext">Start a new chat to begin</p>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default ChatSidebar;
