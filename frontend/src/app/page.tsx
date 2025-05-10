'use client'

import { Sidebar } from "@/components/SIdebar";
import { ChatPage } from "@/components/chats/ChatPage";
import { ChatInfo } from "@/components/chats/ChatInfo";
import { VideoCall } from "@/components/video-call/VideoCall";

import { CheckAuth } from "../hooks/useCheckAuth";
import { useVideoCallStore } from "../store/videocallStore";

export default function Home() {
  const { videoCall } = useVideoCallStore()
  return (
    <div className="flex h-screen relative">
  
      <CheckAuth />
      <Sidebar />
      <ChatPage />
      <ChatInfo />

      {videoCall && (
        <div className="absolute inset-0 z-50 bg-white">
          <VideoCall />
        </div>
      )}
    </div>
  );
}
