'use client'

import { Sidebar } from "@/components/SIdebar";
import { ChatPage } from "@/components/chats/ChatPage";
import { ChatInfo } from "@/components/chats/ChatInfo";


import { CheckAuth } from "../hooks/useCheckAuth";


export default function Home() {
  
  
  return (
    <div className="flex h-screen relative">
    
      <CheckAuth />
      <Sidebar />
      <ChatPage />
      <ChatInfo />
    
    </div>
  );
}
