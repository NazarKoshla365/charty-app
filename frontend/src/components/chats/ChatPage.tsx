'use client';

import { ChatList } from "./ChatList"
import { ChatItem } from "./chat-item/ChatItem"

export const ChatPage = () => {
    return(
        <div className="flex">
            <ChatList/>
            <ChatItem/>
        </div>
    )
}