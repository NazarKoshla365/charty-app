'use client'
import Image from "next/image"
import { Phone } from "lucide-react"


type ChatAction = {
    img: string;
    name: string;
}
interface ChatHeaderProps {
    chatAction: ChatAction;
     isOnline: boolean;
      setVideoCallAction: (value: boolean) => void 
}

export function ChatHeader({chatAction, isOnline, setVideoCallAction}: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between py-[18px] px-6  border-b  border-[#00000014]">
            <div className="flex items-center gap-x-4">
                <Image src={chatAction.img} className="w-[40px] h-[40px] rounded-[10px]" width={40} height={40} alt=""></Image>
                <div>
                    <h2 className="text-xl">{chatAction.name}</h2>
                    <p className="flex items-center gap-x-2 text-xs text-[#00000099]"><span className={`block w-[10px] h-[10px] rounded-full ${isOnline ? "bg-[#68D391]" : 'bg-[#E53E3E]'} `}></span>{isOnline ? 'Online' : 'Offline'}</p>
                </div>
            </div>
            <button onClick={() => setVideoCallAction(true)} className="flex items-center gap-x-2 py-[10px] px-4 rounded-lg text-[#615ef0] bg-[#615EF01A]"><Phone className="w-5 h-5" />Call</button>
        </div>
    )
}