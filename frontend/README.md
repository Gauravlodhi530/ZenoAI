# ZenoAI Frontend

A modern React-based AI chat application with real-time messaging capabilities.

## Features

- **User Authentication**: Register, login, logout, and password reset
- **Real-time Chat**: Socket.IO integration for instant AI responses
- **Chat Management**: Create multiple chats, view chat history
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Gaming-inspired design with smooth animations

## Tech Stack

- React 19
- Redux Toolkit (state management)
- React Router (routing)
- Socket.IO Client (real-time communication)
- Axios (HTTP requests)
- Vite (build tool)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── chat/           # Chat UI components
│   ├── AuthProvider.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx        # Main chat interface
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── store/
│   ├── authSlice.js    # Authentication state
│   ├── chatSlice.js    # Chat state
│   └── store.js
├── config/
│   └── api.js          # API endpoints
└── styles/
    └── theme.css       # Theme variables
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000` by default. Update `src/config/api.js` to change the API URL.

## Available Routes

- `/` - Home (chat interface, protected)
- `/register` - User registration
- `/login` - User login
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with email verification
