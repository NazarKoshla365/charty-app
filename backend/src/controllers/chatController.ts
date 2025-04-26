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
                select: 'username profilePicture'
            });
        const mappedChats = await Promise.all(chats.map(async(chat: any) => {
            const friend = chat.participants.find((p: any) => p._id.toString() !== user._id.toString());
            if (!friend) return null;
            const lastMsg = await Message.findOne({chat:chat._id}).sort({timestamp:-1})
            return {
                _id: chat._id,
                friend: {
                    _id: friend._id,
                    username: friend.username,
                    friendPicture: friend.profilePicture
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
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chat:chatId }).sort({ timestamp: 1 })
        res.json({ messages })
    }
    catch (err) {
        console.error("Error fetching messages", err);
        return res.status(500).json({ message: 'Server error' });
    }

}