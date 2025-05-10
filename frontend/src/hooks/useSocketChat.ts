import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useMessageStore } from "@/store/messageStore";
import { useChatStore } from "@/store/chatStore";
interface UseSocketChatProps {
    chatAction: any; // Replace with the actual type of chatAction
    userIdData: string | null | undefined;
}
export function useSocketChat({chatAction, userIdData}: UseSocketChatProps) {
    const { addMessage } = useMessageStore()
    const { setChats, chats } = useChatStore();
    const [isOnline, setIsOnline] = useState(false)



    useEffect(() => {
        if (!chatAction || !userIdData) return;

        socket.emit("join-chat", chatAction.id);

        console.log("Sent join-chat event for chat ID:", chatAction.id);

        socket.emit("check-online-status", chatAction.friendId, (isOnline: boolean) => {
            console.log("User online status:", isOnline);
            setIsOnline(isOnline);
        });

        const handleReceiveMessage = (message: any) => {
            if (message.chat !== chatAction.id) return;
            console.log("Received message:", message);
            const updatedChats = chats.map(chat =>
                chat.id === message.chat ? { ...chat, message: message.message } : chat
            );
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
        socket.on("receive-message", handleReceiveMessage);
        socket.on("user-online", handleUserOnline);
        socket.on("user-offline", handleUserOffline);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("user-online", handleUserOnline);
            socket.off("user-offline", handleUserOffline);
        };
    }, [chatAction, userIdData]);
    return { isOnline }

}