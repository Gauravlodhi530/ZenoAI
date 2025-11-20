# Quick Start Guide - ZenoAI

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud)
- Gemini API Key (for AI responses)
- Pinecone API Key (optional, for vector search)

## Setup

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/zenoai
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PORT=3000
```

Start backend:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
```

Start frontend:
```bash
npm run dev
```

### 3. Access Application
Open browser: http://localhost:5173

## Default Ports
- Frontend: 5173 (Vite default)
- Backend: 3000

## First Time Use

1. **Register Account**
   - Click "Create Account"
   - Fill in your details
   - You'll be automatically logged in

2. **Create First Chat**
   - Click "New chat" button
   - Enter a title
   - Start chatting!

3. **Send Messages**
   - Type your message
   - Press Enter or click send button
   - Wait for AI response

## Features

✅ User authentication (register, login, logout)
✅ Password reset functionality
✅ Multiple chat conversations
✅ Real-time AI responses via Socket.IO
✅ Chat history saved in database
✅ Delete chats
✅ Persistent login (stays logged in after reload)
✅ Fully responsive (desktop and mobile)

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists and has correct values
- Check if port 3000 is available

### Frontend won't start
- Run `npm install` again
- Clear node_modules and reinstall
- Check if port 5173 is available

### Can't login/register
- Check backend console for errors
- Verify MongoDB connection
- Check browser console for errors

### AI not responding
- Verify GEMINI_API_KEY is set correctly
- Check backend console for API errors
- Ensure socket connection is established

### Logged out after reload
- Check if redux-persist is installed
- Check browser localStorage for 'persist:root'
- Clear cache and try again

## Development

### Backend Structure
```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/        # Database schemas
│   ├── routes/        # API routes
│   ├── middlewares/   # Auth middleware
│   ├── services/      # AI & vector services
│   └── socket.io/     # Socket.IO setup
└── server.js          # Entry point
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── components/    # React components
│   ├── pages/        # Page components
│   ├── store/        # Redux store
│   ├── config/       # API configuration
│   └── styles/       # CSS files
└── index.html        # HTML entry
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/reset-password-request` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Chat
- POST `/api/chat` - Create new chat
- GET `/api/chat/chats` - Get all user chats
- GET `/api/chat/messages/:chatId` - Get chat messages
- DELETE `/api/chat/:chatId` - Delete chat

### Socket.IO Events
- `ai-message` (emit) - Send message to AI
- `ai-response` (listen) - Receive AI response

## Production Deployment

### Backend
1. Set environment variables
2. Use production MongoDB
3. Set NODE_ENV=production
4. Use PM2 or similar for process management

### Frontend
1. Run `npm run build`
2. Deploy `dist` folder to hosting
3. Update API_URL in config/api.js
4. Configure CORS on backend

## Support & Documentation

- Full testing checklist: `TESTING_CHECKLIST.md`
- All fixes summary: `FIXES_SUMMARY.md`
- Mobile fixes: `Frontend/MOBILE_FIXES.md`
- Persistence docs: `Frontend/PERSISTENCE.md`

## License
ISC
