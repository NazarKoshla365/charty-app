import express from "express";
import { chatCreate } from "../controllers/chatController"
import { getUserChats } from "../controllers/chatController"
import { getChatMessages } from "../controllers/chatController"

const chatRouter = express.Router();

chatRouter.post('/create-chat', chatCreate)
chatRouter.get('/my-chats', getUserChats)
chatRouter.get('/messages/:chatId', getChatMessages)


export default chatRouter;
