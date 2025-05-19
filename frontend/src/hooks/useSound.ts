'use client'

import { useRef } from "react"

export const useSound = (url: string) => {
    const audioRef = useRef<HTMLAudioElement>(new Audio(url))
    const play = () => {
        audioRef.current.currentTime = 0
        audioRef.current.play()
    }
    const stop = () => {
        audioRef.current.pause()
    }
    return { play, stop }
}