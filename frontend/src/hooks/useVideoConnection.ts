import { useRef, useState, useEffect } from "react";
import socket from "@/lib/socket";
import { useVideoCallStore } from "@/store/videocallStore";

export const useVideoConnection = (roomId: string, isInitiator: boolean) => {

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);


    const { setVideoCall } = useVideoCallStore();


    useEffect(() => {
        let isMounted = true;

        const setup = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (!isMounted) return;

            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });

            peerConnectionRef.current = pc;

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            pc.ontrack = (event) => {
                const [remote] = event.streams;
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remote;
                }
                setRemoteStream(remote);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", event.candidate, roomId);
                }
            };

            // Join room
            socket.emit("join room", roomId);

            // Other user joined - initiator creates offer
            socket.on("user-joined", async () => {
                if (!isInitiator || !pc) return;
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("offer", offer, roomId);
            });

            socket.on("offer", async (offer) => {
                if (!pc) return;
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer", answer, roomId);
            });

            socket.on("answer", async (answer) => {
                if (!pc) return;
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on("ice-candidate", async (candidate) => {
                if (!pc) return;
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("Failed to add ICE candidate", err);
                }
            });
            socket.on("call-end", () => {
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
                setVideoCall(false);

            })
        };

        setup();

        return () => {
            isMounted = false;

            peerConnectionRef.current?.close();
            peerConnectionRef.current = null;

            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("call-end");
        };
    }, [roomId, isInitiator]);

    return {
        localVideoRef,
        remoteVideoRef,
        localStream,
        setLocalStream,
        remoteStream
    };
};
