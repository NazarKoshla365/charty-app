'use client'
import { useEffect, useRef, useState } from "react"
import { useMessageStore } from "@/store/messageStore";
import Image from "next/image"
import { ForwardModal } from "./message-modals/ForwardModal";
import { MainModal } from "./message-modals/MainModal";
import { PinModal } from "./message-modals/PinModal";

type ChatAction = {
    id: string;
    name: string;
}

interface ChatMessagesProps {
    chatAction: ChatAction;
    userId: string | null | undefined;
    setReplyedMessageAction: (message: { id: string; text: string } | null) => void;
    forwardedMessageAction: string | null;
    setForwardedMessageAction: (message: string | null) => void;
    isShowPinModalAction: boolean;
    setIsShowPinModalAction: (isShow: boolean) => void;
    pinsState: Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>;
    setPinsState: React.Dispatch<React.SetStateAction<Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>>>


    scrollToMessageAction: boolean;
    setScrollToMessageAction: (scroll: boolean) => void;
}

export const ChatMessages = ({ chatAction, userId, setReplyedMessageAction, forwardedMessageAction, setForwardedMessageAction, isShowPinModalAction, setIsShowPinModalAction,
    scrollToMessageAction, setScrollToMessageAction, pinsState, setPinsState }: ChatMessagesProps) => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const { messages, setMessages } = useMessageStore()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagePinedRef = useRef<HTMLImageElement | null>(null);
    const [selectedPinTime, setSelectedPinTime] = useState<string>("1-hour")
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
    useEffect(() => {
        const getPinnedMessages = async () => {
            try {
                const res = await fetch(`http://localhost:4000/chat/pin-messages/${chatId}`, {
                    method: 'GET',
                    credentials: 'include',

                })
                if (res.ok) {
                    const data = await res.json()
                    console.log('pinned message:', data)
                    if (data.pinnedMessage) {
                        setPinsState(prev => ({
                            ...prev,
                            [chatId]: {
                                confirmed: data.pinnedMessage.confirmed,
                                msgId: data.pinnedMessage.msgId,
                                pinMessage: data.pinnedMessage.pinMessage,
                                from: data.pinnedMessage.from,
                                pinTime: data.pinnedMessage.pinTime,
                            },
                        }))
                    }

                }
            }
            catch (err) {
                console.error("Error to fetch pinned messages", err)
            }
        }
        getPinnedMessages()
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
    const handleContextMenu = (e: React.MouseEvent, messageId: string,message:string) => {
        if(message === 'This message was deleted')return;
        e.preventDefault();
        setActiveMenuId(activeMenuId === messageId ? null : messageId);
    }

    useEffect(() => {
        if (pinsState[chatId]?.confirmed && selectedPinTime) {
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
                setPinsState(prev => ({
                    ...prev,
                    [chatId]: {
                        confirmed: false,
                        msgId: '',
                        pinMessage: '',
                        from: '',
                        pinTime: ''
                    }
                }));
            }, timeToUnpin)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [pinsState,setPinsState,chatId,  selectedPinTime])
    return (
        <div className="p-6 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">


            <PinModal chatId={chatAction.id} selectedPinTime={selectedPinTime} setSelectedPinTime={setSelectedPinTime} isShowPinModalAction={isShowPinModalAction}
                setIsShowPinModalAction={setIsShowPinModalAction} pinsState={pinsState} setPinsState={setPinsState} />
            <ForwardModal forwardedMessageAction={forwardedMessageAction} setForwardedMessageAction={setForwardedMessageAction} />


            {allMessages.map((msg, index) => (
                <div
                    key={index}
                    className={`relative flex ${msg.from === userId ? 'justify-end' : 'justify-start'} mb-2`}
                    onClick={() => {
                        setActiveMenuId(null)
                    }}
                >

                    <div className={`flex items-center gap-x-1 py-2 px-4 rounded-xl text-sm ${msg.from === userId ? 'bg-[#615EF0] text-white' : 'bg-[#F1F1F1]'}`} onContextMenu={(e) => handleContextMenu(e, msg._id,msg.message)}>
                        {pinsState[chatId]?.msgId === msg._id && pinsState[chatId]?.confirmed && (
                            <Image ref={messagePinedRef} src="/thumbtacks.png" alt="" width={12} height={12} />
                        )}
                        {msg?.replyTo ? (
                            <div className={`flex flex-col  gap-y-1`}>
                                <div className={`  bg-[#F0F0F0] w-20 p-2 rounded-lg border-l-4 ${msg.from === userId ? 'border-[#5ce4f9] ' : 'border-[#615EF0] '} shadow-sm`}>
                                    <span className="text-xs text-gray-600 font-semibold">
                                        {msg.replyTo.id === userId ? 'You' : chatAction.name}
                                    </span>
                                    <p className="text-[10px] text-gray-800">{msg.replyTo.text}</p>
                                </div>

                                <div className={`px-2 ${msg.from === userId ? 'bg-[#615EF0] text-white' : 'bg-[#F1F1F1]'} rounded-xl`}>
                                    {msg.message}
                                </div>
                            </div>  
                        ) : (
                            <>
                                {msg.message}
                            </>
                        )}
                    </div>

                    <MainModal msg={msg} activeMenuId={activeMenuId} userId={userId} chatId={chatId} setReplyedMessageAction={setReplyedMessageAction} setForwardedMessageAction={setForwardedMessageAction}
                        setIsShowPinModalAction={setIsShowPinModalAction} setPinsState={setPinsState} />
                </div>
            ))}

            <div ref={messagesEndRef} />
        </div>
    )
}
