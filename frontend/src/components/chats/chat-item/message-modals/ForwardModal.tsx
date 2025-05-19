
'use client'
import { useChatStore } from "@/store/chatStore";
import { X } from 'lucide-react';
import Image from "next/image"
import { useState } from "react";
import socket from "@/lib/socket"


interface ForwardModalProps {
    forwardedMessageAction: string | null;
    setForwardedMessageAction: (message: string | null) => void;
}
export function ForwardModal({ forwardedMessageAction, setForwardedMessageAction }: ForwardModalProps) {
    const { chats } = useChatStore()
    const [selectedChatIds, setSelectedChatIds] = useState<string[]>([])
    const toggleChatSelection = (chatId: string) => {
        setSelectedChatIds((prev) =>
            prev.includes(chatId)
                ? prev.filter((id) => id !== chatId) :
                [...prev, chatId]
        )
    }
    const handleForwardMessage = (selectedChatIds: string[], forwardedMessageAction: string) => {
        if (!forwardedMessageAction && selectedChatIds) return;
        selectedChatIds.forEach((chatId) => {
            socket.emit("send-message", {
                chatId: chatId,
                message: forwardedMessageAction,
                replayedMessage: null
            })
        })
        setForwardedMessageAction(null)
        setSelectedChatIds([])
    }
    return (
        <>
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
                        <button onClick={() => forwardedMessageAction &&
                            handleForwardMessage(selectedChatIds, forwardedMessageAction)} className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Forward
                        </button>
                    </div>

                    <ul className="max-h-66 overflow-y-auto divide-y divide-gray-100">
                        {chats.map((chat) => (
                            <li onClick={() => toggleChatSelection(chat.id)} className="flex items-center justify-between  py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100" key={chat.id}>
                                <div className="flex items-center gap-x-4">
                                    <Image className="rounded-xl" width={40} height={40} src={chat.img} alt="" />
                                    <h6>{chat.name}</h6>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedChatIds.includes(chat.id)}
                                    onChange={() => toggleChatSelection(chat.id)}
                                    className="w-6 h-6 rounded-full border-2 border-gray-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}</>
    )
}