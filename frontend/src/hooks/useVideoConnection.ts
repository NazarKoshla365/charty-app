import { useRef, useState, useEffect } from "react";
import socket from "@/lib/socket";
import { useVideoCallStore } from "@/store/videocallStore";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";

export const useVideoConnection = (roomId?: string, isInitiator?: boolean) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const offerCreatedRef = useRef(false);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const { setIncomingCall, setVideoCall } = useVideoCallStore();
  const { user } = useAuthStore();
  const { chatAction } = useChatStore();

  const userId = user?.userId;
  const friendId = chatAction?.friendId;

  useEffect(() => {
    if (!roomId) return;

    const startConnection = async () => {
      try {
      
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = pc;

      
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        
        pc.ontrack = (event) => {
          const [remoteStream] = event.streams;
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        };

    
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", event.candidate, roomId);
          }
        };

     
        socket.emit("join room", roomId);

      
        socket.on("user-joined", async () => {
          if (!isInitiator || offerCreatedRef.current) return;
          offerCreatedRef.current = true;

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", offer, roomId);
        });

      
        socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
          if (!pc) return;
          if (pc.signalingState !== "stable") return;

          await pc.setRemoteDescription(new RTCSessionDescription(offer));

        
          for (const candidate of pendingCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingCandidates.current = [];

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", answer, roomId);
        });

       
        socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
          if (!pc) return;

          try {
            if (
              pc.signalingState === "have-local-offer" ||
              (pc.signalingState === "stable" && pc.localDescription?.type === "offer")
            ) {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
              console.warn("Unexpected signaling state for answer:", pc.signalingState);
              return;
            }

            for (const candidate of pendingCandidates.current) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidates.current = [];
          } catch (error) {
            console.error("Failed to set remote answer:", error);
          }
        });

     
        socket.on("ice-candidate", async (candidate: RTCIceCandidateInit) => {
          if (!pc) return;

          if (pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            pendingCandidates.current.push(candidate);
          }
        });

       
        socket.on("call-end", () => {
          localStream?.getTracks().forEach((t) => t.stop());
          setLocalStream(null);
          setRemoteStream(null);
          if (localVideoRef.current) localVideoRef.current.srcObject = null;
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

          setVideoCall(false);
          setIncomingCall(false);

          peerConnectionRef.current?.close();
          peerConnectionRef.current = null;
        });

      
        socket.on("call-accepted", ({ roomId: acceptedRoomId }) => {
          socket.emit("join room", acceptedRoomId);
        });
      } catch (err) {
        console.error("Error during video connection setup:", err);
      }
    };

    startConnection();

    return () => {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-end");
      socket.off("call-accepted");
    };
  }, [roomId, isInitiator]);

  // Функція для початку дзвінка
  const callUser = () => {
    if (!friendId || !userId || !roomId) return;
    socket.emit("call-user", { to: friendId, from: userId, roomId });
  };

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    setLocalStream,
    remoteStream,
    callUser,
  };
};
