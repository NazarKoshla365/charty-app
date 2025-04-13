'use client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
export function ChatList() {
    const [activeChat, setActiveChat] = useState<number>(1);

    const messages = [
        {
            id: 1,
            name: "Elmer Laverty",
            message: "Haha oh man 🔥",
            img: "/users/us1.png",
            time: "12m",
        },
        {
            id: 2,
            name: "Florencio Dorrance",
            message: "woohoooo",
            img: "/users/us2.png",
            time: "12m",
        },
        {
            id: 3,
            name: "Lavern Laboy",
            message: "Haha that's terrifying 😂",
            img: "/users/us3.png",
            time: "12m",
        },
        {
            id: 4,
            name: "Titus Kitamura",
            message: "omg, this is amazing",
            img: "/users/us4.png",
            time: "12m",
        },
    ];

    const MessageItem = ({ id ,name, message, img, time }: {
        id: number;
        name: string;
        message: string;
        img: string;
        time: string;
    }) => (
        <li className={`${activeChat === id ? 'bg-[rgba(97,_94,_240,_0.06)]' : ''} flex items-start gap-x-4 p-3 w-[292px] rounded-xl`} onClick={() => setActiveChat(id)}>
            <Image width={48} height={48} src={img} alt="" />
            <div>
                <h6 className="text-sm">{name}</h6>
                <p className='text-xs text-[#00000066]'>{message}</p>
            </div>
            <span className='text-[#0000004D]  text-sm ml-auto'>{time}</span>
        </li>
    )

    return (
        <div>
            <div className='flex items-center gap-x-[100px] p-6 border-b  border-[#00000014] '>
                <div className='flex items-center gap-x-[10px]'>
                    <div className='flex items-center gap-x-1.5 '><h2 className='text-xl'>Messages</h2> <ChevronDown /></div>
                    <span className='rounded-3xl px-2 py-[2px] bg-gray-200'>12</span>
                </div>
                <button><Image src="/btn-newMes.svg" width={33} height={33} alt=""></Image></button>
            </div>
            <div>
                <input type="text" placeholder='Search messages' className="py-[10px] px-5 bg-[#F3F3F3] rounded-xl mx-6 my-3 text-sm font-normal outline-0 w-[260px] " />
                <ul className="mx-4 flex flex-col gap-y-2">
                    {messages.map(message => (
                        <MessageItem key={message.id} {...message} />
                    ))}
                </ul>
            </div>
        </div>
    )
}