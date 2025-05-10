import { create } from "zustand"

interface IVideoCall {
    videoCall: boolean,
    setVideoCall: (videoCall: boolean) => void
}

export const useVideoCallStore = create<IVideoCall>((set) => ({
    videoCall: false,
    setVideoCall: (videoCall:boolean) => set({ videoCall })
}))