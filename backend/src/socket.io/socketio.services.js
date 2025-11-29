const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiServices = require("../services/ai.services");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://zenoai-uy9e.onrender.com"],
      credentials: true,
    },
  });

  const extractToken = (socket) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (cookies.token) {
      return cookies.token;
    }

    if (socket.handshake.auth?.token) {
      return socket.handshake.auth.token;
    }

    const authHeader = socket.handshake.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }

    return null;
  };

  io.use(async (socket, next) => {
    try {
      const token = extractToken(socket);

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decode.id);

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: " + error.message));
    }
  });
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
        // Create user message
        const message = await messageModel.create({
          chat: messagePayload.chat,
          content: messagePayload.content,
          user: socket.user._id,
          role: "user",
        });

        // Get chat history
        const chatHistory = await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .then((messages) => messages.reverse());

        // Prepare conversation context
        const conversationHistory = chatHistory.map((item) => {
          return {
            role: item.role === "model" ? "model" : "user",
            parts: [{ text: item.content }],
          };
        });

        // Generate AI response
        const response = await aiServices.generateContent(conversationHistory);

        // Send response to client
        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });

        // Save AI response
        await messageModel.create({
          chat: messagePayload.chat,
          content: response,
          user: socket.user._id,
          role: "model",
        });
      } catch (error) {
        console.error("Error in ai-message handler:", error.message);
        socket.emit("ai-response", {
          content: "Sorry, I encountered an error while processing your message. Please try again.",
          chat: messagePayload.chat,
          error: true,
        });
      }
    });
  });
}
module.exports = initSocketServer;
