    import { InputMessage } from "./InputMessage"
    import { Phone } from 'lucide-react';
    import Image from "next/image"
    export function ChatItem() {
        return (
            <div className="flex justify-center w-full border-x border-[#00000014] ">
                 <div className="flex flex-col w-[45vw]">
                <div className="flex items-center justify-between py-[18px] px-6  border-b  border-[#00000014]">
                    <div className="flex items-center gap-x-4">
                        <Image src="/users/us2.png" width={40} height={40} alt=""></Image>
                        <div>
                            <h2 className="text-xl">Florencio Dorrance</h2>
                            <p className="flex items-center gap-x-2 text-xs text-[#00000099]"><span className=" block w-[10px] h-[10px] rounded-full bg-[#68D391]"></span>Online</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-x-2 py-[10px] px-4 rounded-lg text-[#615ef0] bg-[#615EF01A]"><Phone className="w-5 h-5" />Call</button>
                </div>
                <div className="p-6 flex-1 overflow-auto">
                    <div className="flex items-start gap-x-4">
                        <Image src="/users/us2.png" width={40} height={40} alt=""></Image>
                        <div className="flex flex-col gap-y-[10px]">
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">omg, this is amazing</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">perfect! ✅</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">Wow, this is really epic</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-end gap-x-4">
                        <div className="flex flex-col gap-y-[10px]">
                            <p className="text-sm font-normal py-2 px-4 rounded-xl text-white bg-[#615EF0]">How are you?</p>
                        </div>
                        <Image src="/users/us2.png" width={40} height={40} alt=""></Image>
                    </div>
                    <div className="flex items-start gap-x-4">
                        <Image src="/users/us2.png" width={40} height={40} alt=""></Image>
                        <div className="flex flex-col gap-y-[10px]">
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">just ideas for next time</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">I'll be there in 2 mins ⏰</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-end gap-x-4">
                        <div className="flex flex-col gap-y-[10px]">
                            <p className="text-sm font-normal py-2 px-4 rounded-xl text-white bg-[#615EF0]">woohoooo</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl text-white bg-[#615EF0]">Haha oh man</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl text-white bg-[#615EF0]">Haha that's terrifying 😂</p>
                        </div>
                        <Image src="/users/us2.png" width={40} height={40} alt=""></Image>
                    </div>
                    <div className="flex items-start gap-x-4">
                        <Image src="/users/us2.png" width={40} height={40} alt=""></Image>
                        <div className="flex flex-col gap-y-[10px]">
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">just ideas for next time</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">I'll be there in 2 mins ⏰</p>
                            <p className="text-sm font-normal py-2 px-4 rounded-xl bg-[#F1F1F1]">I'll be there in 2 mins ⏰</p>
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <InputMessage />
                </div>

            </div>
            </div>
           
        )
    }