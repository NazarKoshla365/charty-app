'use client'
import { useEffect } from "react"
import socket from "@/lib/socket"
import { useVideoCallStore } from "@/store/videocallStore"
import { useAuthStore } from "@/store/authStore"

export const useIncomingCallCheck = () => {
    const { setIncomingCall } = useVideoCallStore()
    const {user} = useAuthStore()
    const userId = user?.userId
   useEffect(() => {
      if (!userId) return; 
    const handleIncomingCall = ({ to }: { to: string }) => {
        if (to === userId) {
            setIncomingCall(true);
        }
    };

    socket.on("incoming-call", handleIncomingCall);

    return () => {
        socket.off("incoming-call", handleIncomingCall); // 👈 важливо
    };
}, [userId]);

  
}