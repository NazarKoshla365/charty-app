'use client'
import { Pin, PinOff, ChevronDown, MessageCircleMore } from 'lucide-react';
import { useState } from 'react';

type ChatAction = {
    id: string;
    name: string;
}
interface PinnedMessageProps {
    chatAction: ChatAction;
    userId: string | null | undefined;
    setScrollToMessageAction: (value: boolean) => void;
    pinsState: Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>;
    setPinsState: React.Dispatch<React.SetStateAction<Record<string, { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>>>
}

export function PinnedMessage({ chatAction, userId, setScrollToMessageAction, pinsState, setPinsState }: PinnedMessageProps) {
    const [showSubModalPin, setShowSubModalPin] = useState<boolean>(false)

    const handleDeletePinnedMessage = async (updatedPins: Record<string,  { confirmed: boolean; msgId: string, pinMessage: string, from: string, pinTime: string }>) => {
        try {
            const res = await fetch('http://localhost:4000/chat/save/pinned-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pins: updatedPins
                })
            })
            const data = await res.json()
            console.log('Pinned message deleted successfully:', data)
        }
        catch (err) {
            console.error("Error delete pinned messages:", err)
        }
    }

    return (
        <>
            {pinsState[chatAction.id]?.confirmed && (
                <div onClick={() => setScrollToMessageAction(true)} className="flex items-center justify-between py-3 px-6 bg-[#f1f1ff]   shadow-sm ">

                    <div className="flex items-center gap-x-4">
                        <Pin className="text-[#615EF0]" />
                        <div className="flex items-center gap-x-1">
                            <h6 className="text-sm font-medium text-gray-800">{pinsState[chatAction.id]?.from === userId ? "You" : chatAction.name + ":"}</h6>
                            <p className="text-xs text-gray-600">{pinsState[chatAction.id]?.pinMessage}</p>
                        </div>
                    </div>


                    <div className="relative">
                        <button
                            onClick={(e) => {
                                setShowSubModalPin(!showSubModalPin)
                                e.stopPropagation()
                            }}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        </button>

                        {showSubModalPin && (
                            <ul className="absolute z-50 top-10 right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-1">
                                <li>
                                    <button onClick={() => {
                                        setPinsState(prev => {
                                            const updated = {
                                                ...prev,
                                                [chatAction.id]: {
                                                    confirmed: false,
                                                    msgId: '',
                                                    pinMessage: '',
                                                    from:  '',
                                                    pinTime: ''
                                                }
                                            };
                                            handleDeletePinnedMessage(updated)


                                            return updated;
                                        });
                                        setShowSubModalPin(false)
                                    }}
                                        className="w-38 flex items-center gap-x-2 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
                                        <PinOff className="w-4 h-4" /> Unpin
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-38 flex items-center gap-x-2 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                                        onClick={() => {
                                            setScrollToMessageAction(true)
                                            setShowSubModalPin(false)
                                        }}
                                    >
                                        <MessageCircleMore className="w-4 h-4" /> Go to message
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}