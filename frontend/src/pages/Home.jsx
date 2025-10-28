import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatMobileBar from "../components/chat/ChatMobileBar.jsx";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatMessages from "../components/chat/ChatMessages.jsx";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import "../components/chat/ChatLayout.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats,
} from "../store/chatSlice.js";
import { logout } from "../store/authSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const input = useSelector((state) => state.chat.input);
  const isSending = useSelector((state) => state.chat.isSending);
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleNewChat = async () => {
    let title = window.prompt("Enter a title for the new chat:", "");
    if (title) title = title.trim();
    if (!title) return;

    const response = await axios.post(
      "http://localhost:4000/api/chat",
      { title },
      { withCredentials: true }
    );
    getMessages(response.data.chat._id);
    dispatch(startNewChat(response.data.chat));
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // Handle logout error silently
    } finally {
      dispatch(logout());
      if (socket) {
        socket.disconnect();
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/chat/chats", { withCredentials: true })
      .then((response) => {
        dispatch(setChats(response.data.chats.reverse()));
      });

    const tempSocket = io("http://localhost:4000", { withCredentials: true });

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

    setSocket(tempSocket);
  }, [dispatch]);

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
    const response = await axios.get(
      `http://localhost:4000/api/chat/messages/${chatId}`,
      { withCredentials: true }
    );

    setMessages(
      response.data.messages.map((m) => ({
        type: m.role === "user" ? "user" : "ai",
        content: m.content,
        timestamp: new Date(m.createdAt).getTime() || Date.now(),
      }))
    );
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
        open={sidebarOpen}
      />
      <main className="chat-main" role="main">
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="welcome-content">
              <h1>Hello, {user?.fullName?.firstName || "User"}</h1>
              <p>How can I help you today?</p>

              {/* Instruction Boxes */}
              <div className="instruction-boxes">
                <div
                  className="instruction-box"
                  onClick={() =>
                    dispatch(setInput("Create a chat application"))
                  }
                >
                  <div className="instruction">
                    <div className="instruction-icon">💻</div>
                    <div className="instruction-content">
                      <h3>Create a chat application</h3>

                      {/* Tagline — swap text for any other tagline you like */}
                      <p className="tagline">
                        ZeneAI — Talk. Think. Transform.
                      </p>

                      <p>Create a new chat first</p>
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
        )}
        <ChatMessages messages={messages} isSending={isSending} />
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
