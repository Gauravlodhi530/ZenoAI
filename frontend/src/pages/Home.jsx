import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatMobileBar from "../components/chat/ChatMobileBar.jsx";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatMessages from "../components/chat/ChatMessages.jsx";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import "../components/chat/ChatLayout.css";
import { useDispatch, useSelector } from "react-redux";
import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats,
  deleteChat as deleteChatAction,
} from "../store/chatSlice.js";
import { logout } from "../store/authSlice.js";
import {  SOCKET_URL, apiClient } from '../config/api';

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const input = useSelector((state) => state.chat.input);
  const isSending = useSelector((state) => state.chat.isSending);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleNewChat = async () => {
    let title = window.prompt("Enter a title for the new chat:", "");
    if (title) title = title.trim();
    if (!title) return;

    try {
      
      
      const response = await apiClient.post('/api/chat', { title });
      
      // Add the new chat to Redux state
      dispatch(startNewChat(response.data.chat));
      
      // Clear messages for new chat
      setMessages([]);
      
      // Close sidebar on mobile
      setSidebarOpen(false);
    } catch (error) {
  
      console.error("Error creating new chat:", error);
      alert("Failed to create new chat. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Disconnect socket
      if (socket) {
        socket.disconnect();
      }
      
      // Clear all auth data
      dispatch(logout());
      
      // Clear all localStorage items
      localStorage.removeItem('persist:root');
      localStorage.removeItem('user');
      localStorage.clear();
      
 
      navigate('/login', { replace: true });// Redirect to login page
    }
  };

  useEffect(() => {
    // Get token from Redux state or localStorage as fallback
    const authToken = token || localStorage.getItem('token');
    
    // If no token, redirect to login
    if (!authToken) {
      console.warn("No token found, redirecting to login");
      navigate('/login', { replace: true });
      return;
    }

    // Ensure token is in localStorage for axios interceptor
    if (authToken && !localStorage.getItem('token')) {
      localStorage.setItem('token', authToken);
    }

    // Fetch chats
    apiClient
      .get('/api/chat/chats')
      .then((response) => {
        dispatch(setChats(response.data.chats.reverse()));
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
        // If 401, token might be invalid, redirect to login
        if (error.response?.status === 401) {
          dispatch(logout());
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      });

    // Setup socket with authentication
    const tempSocket = io(SOCKET_URL, { 
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: authToken
      }
    });

    tempSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    tempSocket.on("ai-response", (messagePayload) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          content: messagePayload.content,
          timestamp: Date.now(),
        },
      ]);
      dispatch(sendingFinished());
    });

    tempSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // If authentication error, redirect to login
      if (error.message?.includes("Authentication error")) {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    });

    setSocket(tempSocket);

    // Cleanup on unmount
    return () => {
      if (tempSocket) {
        tempSocket.disconnect();
      }
    };
  }, [dispatch, navigate, token]);

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || !activeChatId || isSending || !socket?.connected) {
      return;
    }

    dispatch(sendingStarted());

    const newMessages = [
      ...messages,
      {
        type: "user",
        content: trimmed,
        timestamp: Date.now(),
      },
    ];

    setMessages(newMessages);
    dispatch(setInput(""));

    socket.emit("ai-message", {
      chat: activeChatId,
      content: trimmed,
    });

    setTimeout(() => {
      if (isSending) {
        dispatch(sendingFinished());
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content:
              "Sorry, I'm taking longer than expected to respond. Please try again.",
            timestamp: Date.now(),
          },
        ]);
      }
    }, 30000);
  };

  const getMessages = async (chatId) => {
    try {
      const response = await apiClient.get(`/api/chat/messages/${chatId}`);

      setMessages(
        response.data.messages.map((m) => ({
          type: m.role === "user" ? "user" : "ai",
          content: m.content,
          timestamp: new Date(m.createdAt).getTime() || Date.now(),
        }))
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      await apiClient.delete(`/api/chat/${chatId}`);
      
      dispatch(deleteChatAction(chatId));
      
      // Clear messages if the deleted chat was active
      if (activeChatId === chatId) {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };

  return (
    <div className="chat-layout minimal">
      <div className="gemini-header">
        <div className="header-left">
          <h1 className="app-title">ZenoAI</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <span className="user-greeting">
              Hello, {user?.fullName?.firstName || "User"}
            </span>
            <div className="user-menu">
              <div className="user-avatar-btn">
                {(user?.fullName?.firstName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="user-dropdown">
                <div className="user-info-dropdown">
                  <div className="user-name">
                    {user?.fullName?.firstName} {user?.fullName?.lastName}
                  </div>
                  <div className="user-email">{user?.email}</div>
                </div>
                <button onClick={handleLogout} className="logout-option">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onNewChat={handleNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          dispatch(selectChat(id));
          setSidebarOpen(false);
          getMessages(id);
        }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        open={sidebarOpen}
      />
      <main className="chat-main" role="main">
        {!activeChatId ? (
          <div className="chat-welcome" aria-hidden="true">
            <div className="welcome-content">
              <h1>Hello, {user?.fullName?.firstName || "User"}</h1>
              <p>How can I help you today?</p>

              {/* Instruction Boxes */}
              <div className="instruction-boxes">
                <div
                  className="instruction-box"
                  onClick={handleNewChat}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="instruction">
                    <div className="instruction-icon">➕</div>
                    <div className="instruction-content">
                      <h3>Create a New Chat</h3>
                      <p className="tagline">
                        Start a new conversation to begin.
                      </p>
                      <p>Click here to create a chat</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="welcome-features">
                <div className="feature">
                  <span className="feature-icon">💬</span>
                  <span>Natural conversations</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🧠</span>
                  <span>Intelligent responses</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💾</span>
                  <span>Chat history saved</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ChatMessages messages={messages} isSending={isSending} />
        )}
        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
