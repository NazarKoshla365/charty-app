'use client'

import { Sidebar } from "@/components/SIdebar";
import { ChatPage } from "@/components/chats/ChatPage";
import { ChatInfo } from "@/components/chats/ChatInfo";
import { VideoCall } from "@/components/video-call/VideoCall";
import { CallNotification } from "@/components/video-call/CallNotification";
import { useIncomingCallCheck } from "@/hooks/useIncomigCallCheck";

import { CheckAuth } from "../hooks/useCheckAuth";
import { useVideoCallStore } from "../store/videocallStore";

export default function Home() {
  useIncomingCallCheck()
  const { incomingCall, videoCall } = useVideoCallStore()
  
  return (
    <div className="flex h-screen relative">
      {incomingCall && (
        <CallNotification />
      )}
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
