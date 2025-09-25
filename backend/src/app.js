const express = require('express');
const cookieParser =  require('cookie-parser');

/* Route */
const authRoutes = require('./routes/auth.routes')
const chatRoute = require('./routes/chat.route')
const cors = require('cors');

/* Using Middleware*/
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


/* Using Routes*/
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoute);

module.exports = app;