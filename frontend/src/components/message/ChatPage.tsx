'use client';

import { ChatList } from "./ChatList"
import { ChatItem } from "./ChatItem"
import {useState} from "react"
export const ChatPage = () => {
    return(
        <div className="flex">
            <ChatList/>
            <ChatItem/>
        </div>
    )
}