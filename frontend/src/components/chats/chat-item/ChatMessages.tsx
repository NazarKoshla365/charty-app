'use client'
import { useEffect, useRef, useState } from "react"
import { useMessageStore } from "@/store/messageStore";
import { useChatStore } from "@/store/chatStore";
import Image from "next/image"
import { X } from 'lucide-react';


type ChatAction = {
    id: number;
    name: string;
}

interface ChatMessagesProps {
    chatAction: ChatAction;
    userId: string | null | undefined;
    setReplyedMessageAction: (message: { id: string; text: string }| null) => void;
    forwardedMessageAction: string | null;
    setForwardedMessageAction: (message: string | null) => void;
    isShowPinModalAction: boolean;
    setIsShowPinModalAction: (isShow: boolean) => void;
    pinedMessagesAction: Record<string, [string, string, string | null]>;
    setPinedMessagesAction: React.Dispatch<React.SetStateAction<Record<string, [string, string, string | null]>>>;
    confirmedPinsAction: Record<string, boolean>;
    setConfirmedPinsAction: (pins: Record<string, boolean>) => void;

    scrollToMessageAction: boolean;
    setScrollToMessageAction: (scroll: boolean) => void;
}

export const ChatMessages = ({ chatAction, userId, setReplyedMessageAction, forwardedMessageAction, setForwardedMessageAction, isShowPinModalAction, setIsShowPinModalAction,
    pinedMessagesAction,
    setPinedMessagesAction, confirmedPinsAction, setConfirmedPinsAction, scrollToMessageAction, setScrollToMessageAction }: ChatMessagesProps) => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const { messages, setMessages } = useMessageStore()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagePinedRef = useRef<HTMLImageElement | null>(null);
    const [selectedPinTime, setSelectedPinTime] = useState<string>("1-hour")
    const { chats } = useChatStore()
    const chatId = chatAction.id

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:4000/chat/messages/${chatId}`, {
                    method: 'GET',
                    credentials: 'include',
                })
                const data = await res.json()
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
    console.log("all messages", allMessages)

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    useEffect(() => {
        if (scrollToMessageAction && messagePinedRef.current) {
            messagePinedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setScrollToMessageAction(false)
        }
    }, [scrollToMessageAction])
    const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
        e.preventDefault();
        setActiveMenuId(activeMenuId === messageId ? null : messageId);
    }
    const hanldleCopy = (message: string) => {
        navigator.clipboard.writeText(message)
    }
    const handleReply = ( message: { id: string; text: string }) => {
        setReplyedMessageAction(message)
    }
    const handleForward = (message: string) => {
        setForwardedMessageAction(message)
    }

    const handlePinMessage = (chatId: string, msgId: string, msg: string, from: string | null) => {
        setIsShowPinModalAction(true);
        setPinedMessagesAction((prevPinedMessages: Record<string, [string, string, string | null]>) => ({
            ...prevPinedMessages,
            [chatId]: [msgId, msg, from],
        }));
    };
    const handlePinTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPinTime(e.target.value)
    }

    useEffect(() => {
        if (confirmedPinsAction && selectedPinTime) {
            let timeToUnpin = 0
            switch (selectedPinTime) {
                case "1-hour":
                    timeToUnpin = 60 * 60 * 1000; // 1 hour in milliseconds
                    break;
                case "1-day":
                    timeToUnpin = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                    break;
                case "1-week":
                    timeToUnpin = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
                    break;
                default:
                    timeToUnpin = 60 * 60 * 1000;
                    break;
            }
            const timer = setTimeout(() => {
                setConfirmedPinsAction({ [chatId]: false })
            }, timeToUnpin)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [confirmedPinsAction, selectedPinTime])
    return (
        <div className="p-6 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">

            {isShowPinModalAction && (
                <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-xl p-6 w-96 border border-gray-200 animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Specify how long to display a pinned message</h4>
                    <p className="text-sm text-gray-500 mb-4">You can unpin it at any time</p>
                    <div className="flex flex-col gap-y-3">
                        {[
                            { id: "1-hour", label: "1 hour" },
                            { id: "1-day", label: "1 day" },
                            { id: "1-week", label: "1 week" },
                        ].map((item) => (
                            <label key={item.id} htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                                <span className="w-5 h-5 flex justify-center items-center border-2 border-gray-400 rounded-full transition-all duration-200">
                                    <input
                                        type="radio"
                                        name="pin-time"
                                        id={item.id}
                                        value={item.id}
                                        checked={selectedPinTime === item.id}
                                        className="hidden peer"
                                        onChange={handlePinTimeChange}
                                    />
                                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></span>
                                </span>
                                <span className="text-gray-700">{item.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center gap-x-4 mt-6 justify-center">
                        <button onClick={() => {
                            setConfirmedPinsAction({ [chatId]: true })
                            setIsShowPinModalAction(false)
                        }} className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                            Pin
                        </button>
                        <button onClick={() => setIsShowPinModalAction(false)} className="flex-1 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200">
                            Cancel
                        </button>
                    </div>

                </div>
            )}



            {typeof forwardedMessageAction === "string" && forwardedMessageAction.length > 0 && (
                <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-xl p-6 w-96 border border-gray-200">
                    <div className="flex items-end justify-between mb-4">
                        <h4 className="text-lg font-semibold  text-gray-800">Forward Message</h4>
                        <button
                            onClick={() => setForwardedMessageAction(null)}
                            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors ease-in-out duration-200"
                        >
                            <X className="text-gray-600" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-y-3 mb-4">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Forward
                        </button>
                    </div>

                    <ul className="max-h-66 overflow-y-auto divide-y divide-gray-100">
                        {chats.map((chat) => (
                            <li className="flex items-center gap-x-4 py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer" key={chat.id}>
                                <Image className="rounded-xl" width={40} height={40} src={chat.img} alt="" />
                                <h6>{chat.name}</h6>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {allMessages.map((msg, index) => (
                <div
                    key={index}
                    className={`relative flex ${msg.from === userId ? 'justify-end' : 'justify-start'} mb-2`}
                    onClick={() => {
                        setActiveMenuId(null)
                    }}
                >

                    <div className={`flex items-center gap-x-1 py-2 px-4 rounded-xl text-sm ${msg.from === userId ? 'bg-[#615EF0] text-white' : 'bg-[#F1F1F1]'}`} onContextMenu={(e) => handleContextMenu(e, msg._id)}>
                        {pinedMessagesAction[chatId]?.[0] === msg._id && confirmedPinsAction[chatId] && (
                            <Image ref={messagePinedRef} src="/thumbtacks.png" alt="" width={12} height={12} />
                        )}
                        {msg?.replyTo ? (
                             <div className={`flex flex-col ${msg.from === userId ? 'justify-end' : 'justify-start'} gap-y-1`}>
                             <div className={`bg-[#F0F0F0] p-2 rounded-lg border-l-4 ${msg.from === userId ?  'border-[#5ce4f9]':'border-[#615EF0]' } shadow-sm`}>
                                 <span className="text-xs text-gray-600 font-semibold">
                                     {msg?.replyTo.id === userId ? 'You' : chatAction.name}
                                 </span>
                                 <p className="text-[10px] text-gray-800">{msg.replyTo}</p>
                             </div>
                 
                             <div className={`p-2 ${msg.from === userId ? 'bg-[#615EF0] text-white' : 'bg-[#F1F1F1]'} rounded-xl`}>
                                 {msg.message}
                             </div>
                         </div>
                        ) : (
                            <>
                                {msg.message}
                            </>
                        )}
                    </div>


                    {activeMenuId === msg._id && (
                        <ul className={`absolute z-50 -top-50 ${msg.from === userId ? 'right-0' : 'left-0'} w-52 bg-white border border-gray-200 shadow-xl rounded-xl p-2`}>
                            <li>
                                <button onClick={() => handleReply({id: msg._id, text: msg.message})} className="w-44 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Reply
                                </button>
                            </li>
                            <li>
                                <button onClick={() => hanldleCopy(msg.message)} className="w-44 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Copy
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleForward(msg.message)} className="w-44 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Forward
                                </button>
                            </li>
                            <li>
                                <button className="w-44 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                    Delete for everyone
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handlePinMessage(chatId.toString(), msg._id, msg.message, msg.from)} className="w-44 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Pin message
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            ))}

            <div ref={messagesEndRef} />
        </div>
    )
}
