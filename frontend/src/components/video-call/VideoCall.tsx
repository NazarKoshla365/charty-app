'use client'

import { useState } from "react";
import { Phone, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useVideoCallStore } from "@/store/videocallStore";
import { useVideoConnection } from "@/hooks/useVideoConnection";
import socket from "@/lib/socket";

export function VideoCall() {
    const roomId = "room1";
    const isInitiator = true;

    const { localVideoRef, localStream, setLocalStream, remoteVideoRef } = useVideoConnection(roomId, isInitiator);
    const { setVideoCall } = useVideoCallStore();

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
    const [isLocalMain, setIsLocalMain] = useState(false);

    const handleEndCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        socket.emit("call-end",roomId)

        setVideoCall(false);
    };

    const toggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsCameraOn(track.enabled);
            });
        }
    };

    const toggleMicrophone = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsMicrophoneOn(track.enabled);
            });
        }
    };

    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Remote video */}
            <video
                ref={remoteVideoRef}
                autoPlay
                onClick={() => setIsLocalMain(false)}
                className={`absolute transition-all duration-300 ${isLocalMain
                    ? "top-4 right-4 w-60  z-10 rounded-lg border-2 border-white object-cover cursor-pointer"
                    : "w-200 z-0 border-2 rounded-lg border-white object-cover"
                    }`}
            />

            {/* Local video */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                onClick={() => setIsLocalMain(true)}
                className={`absolute transition-all duration-300 ${isLocalMain
                    ? "w-200 z-0 border-2 border-white rounded-lg object-cover"
                    : "top-4 right-4 w-60  z-10 rounded-lg border-2 border-white object-cover cursor-pointer"
                    }`}
            />

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 bg-black/50 p-4 rounded-full backdrop-blur-md">
                <button onClick={toggleCamera} className="w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition-transform bg-white/10 text-white">
                    {isCameraOn ? <Video size={28} /> : <VideoOff size={28} />}
                </button>
                <button onClick={handleEndCall} className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white">
                    <Phone style={{ transform: "rotate(135deg)" }} size={28} />
                </button>
                <button onClick={toggleMicrophone} className="w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition-transform bg-white/10 text-white">
                    {isMicrophoneOn ? <Mic size={28} /> : <MicOff size={28} />}
                </button>
            </div>
        </div>
    );
}
