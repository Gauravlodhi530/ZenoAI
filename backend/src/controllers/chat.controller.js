const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");


async function createChat(req, res) {
  // Check if req.user exists before proceeding.
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: No user found in request.",
    });
  }

  const { title } = req.body;
  const user = req.user;

  try {
    const newChat = await chatModel.create({
      user: user._id,
      title,
    });

    res.status(201).json({
      message: "chat created successfully",
      chat: {
        _id: newChat._id,
        title: newChat.title,
        lastActivity: newChat.lastActivity,
      },
    });
  } catch (error) {
    // Catch any database-related errors
    console.error("Error creating chat:", error);
    res.status(500).json({
      message: "Failed to create chat due to a server error.",
    });
  }
}

async function fetchChats(req, res) {
  // Check if req.user exists before proceeding.
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: No user found in request.",
    });
  }

  try {
    const chats = await chatModel.find({ user: req.user._id });
    res.status(200).json({
      message: "Chats fetched successfully",
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      message: "Failed to fetch chats due to a server error.",
    });
  }
}

async function fetchMessages(req, res) {

  const { chatId } = req.params;
  try {
    const messages = await messageModel.find({ chat: chatId });
    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Failed to fetch messages due to a server error.",
    });
  }

}

module.exports = { createChat, fetchChats, fetchMessages };
