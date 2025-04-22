    'use client'
    import { useEffect, useState } from "react"

    interface ChatMessagesProps {
        chatId: number;
        userId: string | null| undefined;
        messages: { from: string | null; message: string; socketId?: string }[];
    }

    export const ChatMessages = ({ chatId, userId, messages }: ChatMessagesProps) => {
        const [history, setHistory] = useState<typeof messages>([]);
        useEffect(() => {
            const fetchMessages = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/chat/messages/${chatId}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    const data = await res.json()
                    console.log(data)
                    setHistory(data.messages);
                    


                }
                catch (err) {
                    console.error("Error to fetch messages", err)
                }
            }
            fetchMessages()
        }, [])
        const allMessages = [...history, ...messages];
       

        
        return (
            <div className="p-6 flex-1 overflow-auto">
                {allMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === userId ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`py-2 px-4 rounded-xl text-sm ${msg.from === userId  ? 'bg-[#615EF0] text-white' : 'bg-[#F1F1F1]'}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>
        )
    }