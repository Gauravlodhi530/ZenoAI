const { Server, Socket } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiServices = require("../services/ai.services");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.services");
const {
  chat,
} = require("@pinecone-database/pinecone/dist/assistant/data/chat");
const { text } = require("express");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication error"));
    }
    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decode.id);

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Unauthentication"));
    }
  });
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      /*
      const message = await messageModel.create({
        chat: messagePayload.chat,
        content: messagePayload.content,
        user: socket.user._id,
        role: "user",
      });
      const vectors = await aiServices.generateVector(messagePayload.content);
     */
      const [message, vectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          content: messagePayload.content,
          user: socket.user._id,
          role: "user",
        }),
        aiServices.generateVector(messagePayload.content),
      ]);

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      //  let memory = await queryMemory({
      //   queryVector: vectors,
      //   limit: 3,
      //   metadata: {
      //     user: socket.user._id,
      //   },
      // });
      
      // const chatHistory = (
      //   await messageModel
      //     .find({
      //       chat: messagePayload.chat,
      //     })
      //     .sort({ createAt: -1 })
      //     .limit(20)
      //     .lean()
      // ).reverse();

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }),
        messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createAt: -1 })
          .limit(20)
          .lean()
          .then((messages) => messages.reverse()),
      ]);


      const shortMemory = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });
      const longMemory = {
        role: "user",
        parts: [
          {
            text: `these are some privious messages from chat, use them generate best responce you can.\n
            ${memory.map((item) => item.metadata.text).join("\n")}`,
          },
        ],
      };

      const response = await aiServices.generateContent([
        longMemory,
        ...shortMemory,
      ]);

      // const responseMessage = await messageModel.create({
      //   chat: messagePayload.chat,
      //   content: response,
      //   user: socket.user._id,
      //   role: "model",
      // });

      // const responseVector = await aiServices.generateVector(response);

      socket.emit("ai-responce", {
        content: response,
        chat: messagePayload.chat,
      });

      const [responseMessage, responseVector] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          content: response,
          user: socket.user._id,
          role: "model",
        }),
        aiServices.generateVector(response),
      ]);

      await createMemory({
        vectors: responseVector,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}
module.exports = initSocketServer;
