'use client'
import { useEffect, useState } from "react"
import { useMessageStore } from "@/store/messageStore";

interface ChatMessagesProps {
    chatId: number;
    userId: string | null | undefined;
}

export const ChatMessages = ({ chatId, userId }: ChatMessagesProps) => {
    const {messages, setMessages} = useMessageStore()
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:4000/chat/messages/${chatId}`, {
                    method: 'GET',
                    credentials: 'include',
                })
                const data = await res.json()
                console.log(data)
                setMessages(data.messages);
            }
            catch (err) {
                console.error("Error to fetch messages", err)
            }
        }
        fetchMessages()
    }, [chatId])

    const combined = [...messages];
    const uniqueMessages = Array.from(new Map(combined.map(m => [m._id, m])).values());
    const allMessages = uniqueMessages.filter(msg => msg.chat === String(chatId));
  


    return (
        <div className="p-6 flex-1 overflow-auto">
            {allMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.from === userId ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`py-2 px-4 rounded-xl text-sm  ${msg.from === userId ? 'bg-[#615EF0] text-white' : 'bg-[#F1F1F1]'}`}>
                        {msg.message}
                    </div>
                </div>
            ))}
        </div>
    )
}