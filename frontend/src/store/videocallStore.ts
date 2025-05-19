import { create } from "zustand"

interface IVideoCall {
    videoCall: boolean,
    incomingCall:boolean,
    setVideoCall: (videoCall: boolean) => void
    setIncomingCall:(incomingCall:boolean) => void
}

export const useVideoCallStore = create<IVideoCall>((set) => ({
    videoCall: false,
    incomingCall:false,
    setVideoCall: (videoCall:boolean) => set({ videoCall }),
    setIncomingCall:(incomingCall:boolean) =>set({incomingCall})
}))