'use client'
import Image from "next/image"
import socket from "@/lib/socket"
import { useChatStore } from "@/store/chatStore"
import { useVideoCallStore } from "@/store/videocallStore"
export function CallNotification() {
    const { chatAction } = useChatStore()
    const { setVideoCall,setIncomingCall } = useVideoCallStore()
    const friendId = chatAction?.friendId
    const roomId = chatAction?.id
    const handleAccept = () => {
        socket.emit("accept-call", {
            to: friendId,
            roomId: roomId
        })
        setVideoCall(true)
        setIncomingCall(false)

    }
    const handleReject = () => {
        socket.emit("reject-call", {
            to: friendId
        })
    }
    return (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2  z-10 bg-white border rounded-lg px-4 py-3 shadow-lg flex flex-col gap-y-2">
            <div className="flex items-center gap-x-3">
                <Image src="/users/us1.png" width={40} height={40} alt="User" className="rounded-full" />
                <div className="flex flex-col">
                    <h4 className="text-sm font-semibold text-gray-800">Artem Koshla</h4>
                    <p className="text-xs text-gray-500">Incoming call</p>
                </div>
            </div>

            <div className="flex items-center gap-x-3 ml-auto">
                <button onClick={handleAccept} className="px-4 py-2 text-xs text-white font-semibold bg-green-500 rounded-full hover:bg-green-600 transition-all duration-200 ">
                    Accept
                </button>
                <button onClick={handleReject} className="px-4 py-2 text-xs text-white font-semibold bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 ">
                    Decline
                </button>
            </div>
        </div>
    )
}
