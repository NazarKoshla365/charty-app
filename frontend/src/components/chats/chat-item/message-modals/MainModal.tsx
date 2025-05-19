'use client'
import { useMessageStore } from "@/store/messageStore";
import { useState, useEffect, useRef } from "react";

interface MainModalProps {
    msg: any;
    activeMenuId: string | null;
    userId: string | null | undefined;
    chatId: string;
    setReplyedMessageAction: (message: { id: string; text: string } | null) => void;
    setForwardedMessageAction: (message: string | null) => void;
    setIsShowPinModalAction: (isShow: boolean) => void;


    setPinsState: React.Dispatch<React.SetStateAction<Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>>>

}
export function MainModal({ msg, activeMenuId, userId, chatId, setReplyedMessageAction, setForwardedMessageAction, setIsShowPinModalAction,
    setPinsState

}: MainModalProps) {
    const { messages, setMessages } = useMessageStore()
    const [position, setPosition] = useState<"top" | "bottom">("bottom");
    const modalRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (activeMenuId !== msg._id) return;

        const timeout = setTimeout(() => {
            const rect = modalRef.current?.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect && rect.bottom + 110 > windowHeight) {
                setPosition("top");
            } else {
                setPosition("bottom");
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, [activeMenuId, msg._id]);




    const hanldleCopy = (message: string) => {
        navigator.clipboard.writeText(message)
    }
    const handleReply = (message: { id: string; text: string }) => {
        setReplyedMessageAction(message)
    }
    const handleForward = (message: string) => {
        setForwardedMessageAction(message)
    }
    const handlePinMessage = (chatId: string, msgId: string, msg: string, from: string) => {
        setIsShowPinModalAction(true);
        setPinsState(prev => ({
            ...prev,
            [chatId]: {
                confirmed: false,
                msgId,
                pinMessage: msg,
                from,
                pinTime: ''
            },
        }));
    };
    const handleDeleteMessage = async ({ msgId, forEveryone }: { msgId: string, forEveryone: boolean }) => {
        try {
            const res = await fetch(`http://localhost:4000/chat/delete-message/${msgId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    forEveryone
                }),
            })
            const data = await res.json()
            console.log("Message successfully deleted", data)
            const updatedMessage = data.updatedMessage;

            let updatedMessages;
            if (updatedMessage.deletedFor?.includes(userId)) {
                updatedMessages = messages.filter(msg => msg._id !== updatedMessage._id);
            } else {
                updatedMessages = messages.map(msg =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                );
            }
            setMessages(updatedMessages);

        }
        catch (err) {
            console.error("Error deleting message for all", err)
        }
    }
    return (
        <>
            {activeMenuId === msg._id && (
                <ul ref={modalRef} className={`absolute z-50     ${position === 'top' ? 'bottom-full -mb-10' : 'top-full -mt-10'} ${msg.from === userId ? 'right-0' : 'left-0'} w-52 bg-white border border-gray-200 shadow-xl rounded-xl p-2`}>
                    <li>
                        <button onClick={() => handleReply({ id: msg.from, text: msg.message })} className="w-44 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
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
                        <button onClick={() => handleDeleteMessage({ msgId: msg._id, forEveryone: false })} className="w-44 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                            Delete for me
                        </button>
                    </li>
                    {msg.from === userId && (
                        <li>
                            <button onClick={() => handleDeleteMessage({ msgId: msg._id, forEveryone: true })} className="w-44 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                Delete for everyone
                            </button>
                        </li>
                    )}
                    <li>
                        <button onClick={() => handlePinMessage(chatId, msg._id, msg.message, msg.from)} className="w-44 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                            Pin message
                        </button>
                    </li>
                </ul>
            )}
        </>
    )
}