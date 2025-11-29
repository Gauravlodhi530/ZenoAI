# ZenoAI - AI Chat Application

A full-stack AI-powered chat application built with React and Node.js, featuring real-time messaging powered by Google's Gemini AI model.

**Live Demo:** [https://zeno-ai-chi.vercel.app/](https://zeno-ai-chi.vercel.app/)

## 🚀 Features

- **AI-Powered Conversations**: Chat with ZenoAI powered by Google's Gemini 2.0 Flash model
- **User Authentication**: Secure registration, login, and password reset functionality
- **Real-time Messaging**: Instant message delivery using Socket.io
- **Chat Management**: Create, view, and delete multiple chat conversations
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **State Management**: Redux Toolkit for efficient state management
- **Vector Embeddings**: Support for vector embeddings using Google's text-embedding-004 model

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.2** - Build tool and dev server
- **Redux Toolkit 2.2.7** - State management
- **React Router DOM 7.8.1** - Client-side routing
- **Socket.io Client 4.8.1** - Real-time communication
- **Axios 1.11.0** - HTTP client
- **Redux Persist 6.0.0** - State persistence

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB** - Database (via Mongoose 8.18.0)
- **Socket.io 4.8.1** - Real-time bidirectional communication
- **Google Gemini AI** - AI model integration (@google/genai 1.16.0)
- **Pinecone** - Vector database (@pinecone-database/pinecone 6.1.2)
- **JWT** - Authentication (jsonwebtoken 9.0.2)
- **Bcryptjs 3.0.2** - Password hashing
- **Cookie Parser** - Cookie handling

## 📁 Project Structure

```
Zeno Ai/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── chat/        # Chat-related components
│   │   │   ├── AuthProvider.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── store/           # Redux store configuration
│   │   │   ├── authSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── store.js
│   │   ├── config/          # Configuration files
│   │   │   └── api.js       # API client setup
│   │   └── styles/          # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Node.js backend application
    ├── src/
    │   ├── controllers/     # Request handlers
    │   │   ├── auth.controller.js
    │   │   └── chat.controller.js
    │   ├── models/          # MongoDB models
    │   │   ├── user.model.js
    │   │   ├── chat.model.js
    │   │   └── message.model.js
    │   ├── routes/          # API routes
    │   │   ├── auth.routes.js
    │   │   └── chat.route.js
    │   ├── services/        # Business logic
    │   │   ├── ai.services.js
    │   │   └── vector.services.js
    │   ├── middlewares/     # Express middlewares
    │   │   └── auth.middleware.js
    │   ├── socket.io/       # Socket.io configuration
    │   │   └── socketio.services.js
    │   ├── db/              # Database configuration
    │   │   └── db.js
    │   └── app.js           # Express app setup
    ├── server.js            # Server entry point
    └── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or cloud instance)
- Google Gemini API key
- Pinecone API key (optional, for vector search)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Zeno Ai"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret_key
PINECONE_API_KEY=your_pinecone_api_key  # Optional
```

#### Frontend Configuration
Update `Frontend/src/config/api.js` to set your API endpoints:

```javascript
// For development
export const API_URL = "http://localhost:3000";
export const SOCKET_URL = "http://localhost:3000";

// For production
// export const API_URL = "https://zenoai-uy9e.onrender.com";
// export const SOCKET_URL = "https://zenoai-uy9e.onrender.com";
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `POST /api/auth/reset-password-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Chat Routes (`/api/chat`)

- `POST /api/chat` - Create a new chat (protected)
- `GET /api/chat/chats` - Get all user chats (protected)
- `GET /api/chat/messages/:chatId` - Get messages for a chat (protected)
- `DELETE /api/chat/:chatId` - Delete a chat (protected)

### Health Check

- `GET /api/health` - Server health check

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in:
- **Backend**: HTTP-only cookies
- **Frontend**: localStorage (for Authorization header)

Protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 🤖 AI Integration

ZenoAI uses Google's Gemini AI models with the following configuration:

- **Primary Models**: 
  - `gemini-2.0-flash-001`
  - `gemini-2.0-flash-exp`
  - `gemini-1.5-flash` (fallback)

- **Generation Config**:
  - Temperature: 0.7
  - Top P: 0.95
  - Top K: 40
  - Max Output Tokens: 2048

- **Embeddings**: `text-embedding-004` for vector generation

The AI is configured with a custom system instruction that defines ZenoAI's personality and response style.

## 🔌 Socket.io Events

### Client → Server
- `send-message` - Send a new message
- `join-chat` - Join a chat room

### Server → Client
- `message-received` - Receive a new message
- `ai-response` - Receive AI-generated response
- `error` - Error notifications

## 🎨 Frontend Features

- **Redux State Management**: Centralized state for auth and chat
- **Protected Routes**: Route guards for authenticated pages
- **Real-time Updates**: Socket.io integration for live messaging
- **Responsive Design**: Mobile-first approach with sidebar/mobile bar toggle
- **Theme Support**: Dark/light theme toggle
- **Error Handling**: Global error interceptors for API calls

## 🚀 Deployment

### Backend Deployment (Render)
The backend is deployed on Render at: `https://zenoai-uy9e.onrender.com`

### Frontend Deployment (Vercel)
The frontend is deployed on Vercel at: `https://zeno-ai-chi.vercel.app/`

### Build Commands

**Frontend:**
```bash
cd Frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start  # Uses nodemon in development
```

## 📝 Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start server with nodemon (development)

## 🔧 Configuration

### CORS Settings
The backend is configured to accept requests from:
- `http://localhost:5173` (development)
- `https://zenoai-uy9e.onrender.com`
- `https://zeno-ai-chi.vercel.app`

### Cookie Settings
- Cookies are set with `httpOnly` and `secure` flags in production
- Credentials are enabled for cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Gaurav** - Creator of ZenoAI

---

**Note**: Make sure to set up all environment variables before running the application. The application requires a MongoDB database and Google Gemini API key to function properly.

