'use client'

import { Sidebar } from "@/components/SIdebar";
import { ChatList } from "@/components/message/ChatList";
import { ChatItem } from "@/components/message/ChatItem";
import { ChatInfo } from "@/components/message/ChatInfo";

import { CheckAuth } from "../hooks/useCheckAuth";


export default function Home() {
  
  return (
    <div className="flex h-screen">
      <CheckAuth />
      <Sidebar />
      <ChatList />
      <ChatItem />
      <ChatInfo />
    </div>
  );
}
