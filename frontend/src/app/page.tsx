'use client'

import { Sidebar } from "@/components/SIdebar";
import { ChatPage } from "@/components/message/ChatPage";
import { ChatInfo } from "@/components/message/ChatInfo";

import { CheckAuth } from "../hooks/useCheckAuth";


export default function Home() {

  return (
    <div className="flex h-screen">
      <CheckAuth />
      <Sidebar />
      <ChatPage />
      <ChatInfo />
    </div>
  );
}
