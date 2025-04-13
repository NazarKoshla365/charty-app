'use client'
import { Register } from "@/components/Register";
import { Sidebar } from "@/components/SIdebar";
import { ChatList } from "@/components/message/ChatList";
import { ChatItem } from "@/components/message/ChatItem";
import { ChatInfo } from "@/components/message/ChatInfo";
import { useAuth } from "./context/AuthProvider";
export default function Home() {
  const { isRegistered } = useAuth()
  return (
    <div>
      {isRegistered ? (
        <div className="flex h-screen">
          <Sidebar />
          <ChatList />
          <ChatItem />
          <ChatInfo />
        </div>
      ) : (
        <div>
          <Register />
        </div>
      )}
    </div>
  );
}
