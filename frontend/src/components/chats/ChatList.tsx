'use client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CreateChat } from './CreateChat';
import { useChatStore } from '@/store/chatStore';


export function ChatList() {
    const [isClosed, setIsClosed] = useState(true)
    const [activeChat, setActiveChat] = useState<string | null>(null)
    const { setChatAction, chats, setChats } = useChatStore();
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch('http://localhost:4000/chat/my-chats', {
                    method: 'GET',
                    credentials: 'include',
                })
                const data = await res.json()
                console.log(data)
               
                if (data?.chats) {
                    const mappedChats = data.chats.map((chat: any) => {
                        return {
                            id: chat._id,
                            name: chat.friend.username,
                            friendId: chat.friend._id,
                            message: chat.lastMessage,
                            img: chat.friend.friendPicture,
                            time: "now"
                        };
                    });
                  
                    setChats(mappedChats);
                    if (mappedChats.length > 0) {
                        setActiveChat(mappedChats[0].id);
                        setChatAction(mappedChats[0]);
                    }
                }
            }
            catch (err) {
                console.error("Error to fetch chats", err)
            }
        }
        fetchChats()
    }, [])
    

    const handleNewChatCreated = (newChat: {
        chatId: string;
        participants: { id: string; username: string; profilePicture: string }[];
    }) => {
        const friend = newChat.participants[1];
        const newChatItem = {
            id: newChat.chatId,
            friendId: friend.id,
            name: friend.username,
            message: "New Chat created",
            img: friend.profilePicture,
            time: "",
        };

        console.log(newChatItem)
        setChats([...chats, newChatItem]);
        setChatAction(newChatItem);

    }
    const MessageItem = ({ id, friendId, name, message, img, time }: {
        id: string;
        friendId: string,
        name: string;
        message: string;
        img: string;
        time?: string;
    }) => (
        <li className={`${activeChat === id ? 'bg-[rgba(97,_94,_240,_0.06)]' : ''} flex items-start gap-x-4 p-3 w-[292px] rounded-xl`}
            onClick={() => {
                setChatAction({
                    id, friendId, name, img,
                    message: ''
                })
                setActiveChat(id)
            }}>
            <Image width={48} height={48} className='w-[48px] h-[48px] rounded-xl' src={img} alt="" />
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
                    <div className='flex items-center gap-x-1.5 '>
                        <h2 className='text-xl'>Messages</h2>
                        <ChevronDown />
                    </div>
                    <span className='rounded-3xl px-2 py-[2px] bg-gray-200'>12</span>
                </div>
                <CreateChat isClosed={isClosed} setIsClosedAction={setIsClosed} onNewChatCreatedAction={handleNewChatCreated} />
                <button onClick={() => setIsClosed(false)}><Image src="/btn-newMes.svg" width={33} height={33} alt=""></Image></button>
            </div>
            <div>
                <input type="text" placeholder='Search messages' className="py-[10px] px-5 bg-[#F3F3F3] rounded-xl mx-6 my-3 text-sm font-normal outline-0 w-[260px] " />
                <ul className="mx-4 flex flex-col gap-y-2">
                    {chats.map(chat => (
                        <MessageItem key={chat.id} {...chat} />
                    ))}
                </ul>
            </div>
        </div>
    )
}