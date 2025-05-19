import express from "express";
import { chatCreate } from "../controllers/chatController"
import { savePinnedMessages } from "../controllers/chatController";
import { getUserChats } from "../controllers/chatController"
import { getChatMessages } from "../controllers/chatController"
import { getPinnedMessages } from "../controllers/chatController";
import { deleteMessage } from "../controllers/chatController";

const chatRouter = express.Router();

chatRouter.post('/create-chat', chatCreate)
chatRouter.post('/save/pinned-messages',savePinnedMessages)
chatRouter.get('/my-chats', getUserChats)
chatRouter.get('/messages/:chatId', getChatMessages)
chatRouter.get('/pin-messages/:chatId',getPinnedMessages)
chatRouter.delete('/delete-message/:msgId',deleteMessage)


export default chatRouter;
