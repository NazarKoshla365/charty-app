import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import User from "../models/user";
import Chat from "../models/chat";
import Message from "../models/message";
import { verifyToken } from "../utils/verifyToken";


export const chatCreate = async (req: Request, res: Response) => {
    const { username } = req.body

    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const sender = await User.findById(decoded.id).select('username');
        const receiver = await User.findOne({ username }).select("username profilePicture");
        if (!sender || !receiver) {
            return res.status(400).json({ message: "User not found" });
        }
        const existingChat = await Chat.findOne({ participants: { $all: [sender._id, receiver._id], $size: 2 } });
        if (existingChat) {
            return res.status(200).json({ message: "Chat already exists", chat: existingChat });
        }

        const newChat = new Chat({
            participants: [sender._id, receiver._id]
        })
        await newChat.save();
        return res.status(200).json({
            status: 'success',
            message: 'Chat created successfully',
            chat: {
                chatId: newChat._id,
                participants: [
                    { id: sender._id, username: sender.username },
                    { id: receiver._id, username: receiver.username, profilePicture: receiver.profilePicture }
                ]
            }
        })
    }
    catch (err) {
        console.error('Create chat error', err)
        return res.status(500).json({ message: 'Server error' });
    }

}
export const getUserChats = async (req: Request, res: Response) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token)
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const chats = await Chat.find({ participants: user._id })
            .populate({
                path: 'participants',
                select: 'username profilePicture lastSeen'
            });
        const mappedChats = await Promise.all(chats.map(async (chat: any) => {
            const friend = chat.participants.find((p: any) => p._id.toString() !== user._id.toString());
            if (!friend) return null;
            const lastMsg = await Message.findOne({ chat: chat._id }).sort({ timestamp: -1 })
            return {
                _id: chat._id,
                friend: {
                    _id: friend._id,
                    username: friend.username,
                    friendPicture: friend.profilePicture,
                    time: friend.lastSeen
                },
                lastMessage: lastMsg?.message || null,
            }
        }));

        return res.status(200).json({ message: "Chats found", chats: mappedChats })
    }
    catch (err) {
        console.error("Get chats error", err)
        return res.status(500).json({ message: 'Server error' });

    }

}
export const getChatMessages = async (req: Request, res: Response) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chat: chatId }).sort({ timestamp: 1 })
        res.json({ messages })
    }
    catch (err) {
        console.error("Error fetching messages", err);
        return res.status(500).json({ message: 'Server error' });
    }

}
export const savePinnedMessages = async (req: Request, res: Response) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }
    const { pins } = req.body

    try {
        const chatIds = Object.keys(pins)
        for (const chatId of chatIds) {
            const { confirmed, msgId, pinMessage, from, pinTime } = pins[chatId]
            if (confirmed) {
                await Chat.findByIdAndUpdate(chatId, {
                    pinnedMessage: {
                        confirmed,
                        msgId,
                        pinMessage,
                        from,
                        pinTime,
                    },
                })
            } else {
                await Chat.findByIdAndUpdate(chatId, {
                    $unset: { pinnedMessage: "" },
                });
            }
        }

        return res.json({ 'ok': pins });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}
export const getPinnedMessages = async (req: Request, res: Response) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }
    const { chatId } = req.params
    if (!chatId) {
        return res.status(400).json({ message: 'chatId is required' });
    }
    try {
        const chat = await Chat.findById(chatId).select('pinnedMessage')

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        return res.json({
            pinnedMessage: chat.pinnedMessage || null
        })
    }
    catch (err) {
        console.error("Error fetching pinned messages", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const deleteMessage = async (req: Request, res: Response) => {
    const { msgId } = req.params
    const { forEveryone } = req.body
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.id;

        const message = await Message.findById(msgId)
        if (!message) {
            return res.status(404).json({ message: "Message not found" })
        }
        if (forEveryone === true || forEveryone === 'true') {
            message.message = "This message was deleted"
            message.deletedForEveryone = true
            await message.save()
        } else {
            if (!message.deletedFor) {
                message.deletedFor = [];
            }
            const alreadyDeleted = message.deletedFor.some(id => id.toString() === userId);
            if (!alreadyDeleted) {
                message.deletedFor.push(userId);
                await message.save();
            }
        }
       
        return res.status(200).json({ message: "Message deleted successfully", updatedMessage: message })

    }
    catch (err) {
        console.error("Error deleting message", err)
        res.status(500).json({ message: 'Internal server error' })
    }
}