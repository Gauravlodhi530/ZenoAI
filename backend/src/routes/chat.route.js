const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", authMiddleware.authUser, chatController.createChat);

/* api/chat/chats */
router.get("/chats", authMiddleware.authUser, chatController.fetchChats);
/* api/chat/messages/:chatId */
router.get("/messages/:chatId", authMiddleware.authUser, chatController.fetchMessages);

module.exports = router;
