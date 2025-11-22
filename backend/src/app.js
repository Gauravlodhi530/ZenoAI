const express = require('express');
const cookieParser =  require('cookie-parser');

/* Route */
const authRoutes = require('./routes/auth.routes')
const chatRoute = require('./routes/chat.route')
const cors = require('cors');

/* Using Middleware*/
const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://zenoai-uy9e.onrender.com', 'https://zeno-ai-chi.vercel.app'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


/* Health check endpoint */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

/* Using Routes*/
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoute);

module.exports = app;