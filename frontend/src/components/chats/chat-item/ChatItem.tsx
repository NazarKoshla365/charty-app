'use client';
import { InputMessage } from "./InputMessage"
import { ChatMessages } from "./ChatMessages";
import { ChatHeader } from "./ChatHeader";
import { PinnedMessage } from "./PinnedMessage";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useVideoCallStore } from "@/store/videocallStore";
import socket from "@/lib/socket"
import { useEffect, useState } from "react";
import { useSocketChat } from "@/hooks/useSocketChat";

export function ChatItem() {
    /*Store hooks */
    const { setVideoCall } = useVideoCallStore()
    const { chatAction} = useChatStore();
    const { user } = useAuthStore()
    /*Local state */
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState<string | null | undefined>(undefined);
    const [replyedMessage, setReplyedMessage] = useState<{ id: string; text: string;} | null>(null);
    const [forwardedMessage, setForwardedMessage] = useState<string | null>(null)
    const [pinedMessages, setPinedMessages] = useState<Record<string, [string, string, string | null]>>({});
    const [isShowPinModal, setIsShowPinModal] = useState<boolean>(false)
    const [confirmedPins, setConfirmedPins] = useState<Record<string, boolean>>({})
    const [scrollToMessage, setScrollToMessage] = useState<boolean>(false)

    const userIdData = user?.userId

    useEffect(() => {
        if (!userIdData) return;

        if (socket.connected) {
            setUserId(userIdData);
            console.log("Socket already connected, ID:", socket.id);
        } else {
            const handleSocketConnect = () => setUserId(userIdData);
            socket.on("connect", handleSocketConnect);
            return () => {
                socket.off("connect", handleSocketConnect);
            };
        }
    }, [userIdData]);

    const { isOnline } = useSocketChat({ chatAction, userIdData });

    const handleSendMessage = () => {
        if (!newMessage.trim() || !chatAction || !userIdData) return;
          
        socket.emit("send-message", {
            chatId: chatAction.id,
            message: newMessage,
            replayedMessage: replyedMessage ? replyedMessage.id : null,
        });
        setReplyedMessage(null)
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
                <ChatHeader chatAction={chatAction} isOnline={isOnline} setVideoCallAction={setVideoCall} />

                <PinnedMessage chatAction={chatAction} userId={userId} setScrollToMessageAction={setScrollToMessage} pinedMessagesAction={pinedMessages}
                    confirmedPinsAction={confirmedPins} setConfirmedPinsAction={setConfirmedPins} />

                <ChatMessages chatAction={chatAction} userId={userId} setReplyedMessageAction={setReplyedMessage}
                    forwardedMessageAction={forwardedMessage} setForwardedMessageAction={setForwardedMessage} isShowPinModalAction={isShowPinModal}
                    setIsShowPinModalAction={setIsShowPinModal} setPinedMessagesAction={setPinedMessages} pinedMessagesAction={pinedMessages}
                    confirmedPinsAction={confirmedPins} setConfirmedPinsAction={setConfirmedPins} scrollToMessageAction={scrollToMessage}
                    setScrollToMessageAction={setScrollToMessage} />
                <div className="mt-auto">
                    <InputMessage onSendMessageAction={handleSendMessage} newMessageAction={newMessage} setNewMessageAction={setNewMessage} replyedMessageAction={replyedMessage} setReplyedMessageAction={setReplyedMessage} />
                </div>
            </div>
        </div>

    )
}

