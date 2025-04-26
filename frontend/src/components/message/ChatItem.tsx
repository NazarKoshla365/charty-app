'use client';

import { InputMessage } from "./InputMessage"
import { ChatMessages } from "./ChatMessages";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useMessageStore } from "@/store/messageStore";
import { Phone } from 'lucide-react';
import Image from "next/image"
import socket from "../../lib/socket"
import { useEffect, useState } from "react";

export function ChatItem() {
    const {addMessage} = useMessageStore()
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState<string | null | undefined>(undefined);
    const [isOnline, setIsOnline] = useState(false)
    const { chatAction,chats,setChats} = useChatStore();
    const { user } = useAuthStore()
    const userIdData = user?.userId



    useEffect(() => {
        if (!userIdData) return;

        if (socket.connected) {
            setUserId(userIdData);
            console.log("Socket already connected, ID:", socket.id);
        } else {
            const handleSocketConnect = () => {
                setUserId(userIdData);
            };
            socket.on("connect", handleSocketConnect);

            return () => {
                socket.off("connect", handleSocketConnect);
            };
        }
    }, [userIdData]);

    useEffect(() => {
        if (!chatAction || !userIdData) return;

        socket.emit("join-chat", chatAction.id);

        console.log("Sent join-chat event for chat ID:", chatAction.id);

        socket.emit("check-online-status", chatAction.friendId, (isOnline: boolean) => {
            console.log("User online status:", isOnline);
            setIsOnline(isOnline);
        });

        const handleMessage = (message: any) => {
            if (message.chat !== chatAction.id) return;
            console.log("Received message:", message);
            const updatedChats = chats.map(chat =>{
                if(chat.id === message.chat){
                    return {
                        ...chat,
                        message:message.message
                    }
                }
                 return chat
            })
            setChats(updatedChats)
            addMessage(message)
        };



        const handleUserOnline = (id: number) => {
            console.log(`User ${id} is online`);
            if (id === chatAction.friendId) setIsOnline(true);
        };

        const handleUserOffline = (id: number) => {
            console.log(`User ${id} is offline`);
            if (id === chatAction.friendId) setIsOnline(false);
        };
        socket.on("receive-message", handleMessage);
        socket.on("user-online", handleUserOnline);
        socket.on("user-offline", handleUserOffline);

        return () => {
            socket.off("receive-message", handleMessage);
            socket.off("user-online", handleUserOnline);
            socket.off("user-offline", handleUserOffline);
        };
    }, [chatAction, userIdData]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !chatAction || !userIdData) return;

        socket.emit("send-message", {
            chatId: chatAction.id,
            message: newMessage,
        });

        setNewMessage('');
    };
    if (!chatAction) {
        return (
            <div className="flex justify-center items-center w-full border-x border-[#00000014]">
                <p className="text-gray-500 text-2xl text-center  w-[45vw]">You don't have any chats yet.</p>
            </div>
        );
    }
    return (
        <div className="flex justify-center w-full border-x border-[#00000014] ">
            <div className="flex flex-col w-[45vw]">
                <div className="flex items-center justify-between py-[18px] px-6  border-b  border-[#00000014]">
                    <div className="flex items-center gap-x-4">
                        <Image src={chatAction.img} className="w-[40px] h-[40px] rounded-[10px]" width={40} height={40} alt=""></Image>
                        <div>
                            <h2 className="text-xl">{chatAction.name}</h2>
                            <p className="flex items-center gap-x-2 text-xs text-[#00000099]"><span className={`block w-[10px] h-[10px] rounded-full ${isOnline ? "bg-[#68D391]" : 'bg-[#E53E3E]'} `}></span>{isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-x-2 py-[10px] px-4 rounded-lg text-[#615ef0] bg-[#615EF01A]"><Phone className="w-5 h-5" />Call</button>
                </div>
                <ChatMessages chatId={chatAction.id} userId={userId}  />
                <div className="mt-auto">
                    <InputMessage onSendMessageAction={handleSendMessage} newMessageAction={newMessage} setNewMessageAction={setNewMessage} />
                </div>
            </div>
        </div>

    )
}

