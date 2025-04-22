'use client';

import { ChatList } from "./ChatList"
import { ChatItem } from "./ChatItem"
import {useState} from "react"
export const ChatPage = () => {
    
    const [activeChat, setActiveChat] = useState<{ id: number,friendId:number, name: string, img: string } | null>(null);

    return(
        <div className="flex">
            <ChatList onSelectChatAction={setActiveChat} />
            <ChatItem chatAction={activeChat}/>
        </div>
    )
}