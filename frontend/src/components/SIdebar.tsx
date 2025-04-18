'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Settings, House, MessageSquareMore, Search, CalendarDays } from 'lucide-react';
import { useAuthStore } from "@/store/authStore";
import React from "react";



const tabs = [
    { name: 'home', icon: <House /> },
    { name: 'messages', icon: <MessageSquareMore /> },
    { name: 'search', icon: <Search /> },
    { name: 'calendar', icon: <CalendarDays /> },
];
export function Sidebar() {
    const [activeTab, setActiveTab] = useState('home');
    const {user} = useAuthStore()
    const picture = user?.profile
 
    
    return (
        <div className="flex flex-col items-center justify-between  p-4  shadow-[0_0_24px_0_rgba(0,_0,_0,_0.08)]">
            <div className="flex flex-col items-center  gap-y-10 ">
                {picture ?(
                <Link href=""><Image width={56} height={56} className="rounded-lg" src={picture} alt="User avatar" /></Link>

                ):(
                <Link href=""><Image width={56} height={56} src='/av.svg' alt="User avatar" /></Link>
                )
            }
               
                <nav className="flex flex-col items-center  gap-y-8">
                    {tabs.map(({ name, icon }) => (
                        <div key={name} className={`p-2 rounded-full ${activeTab === name ? 'bg-[#615EF0]' : ''}`}>
                            <Link href="" onClick={() => setActiveTab(name)}>
                                {React.cloneElement(icon, { color: activeTab === name ? '#ffffff' : '#000000' })}
                            </Link>
                        </div>
                    ))}
                </nav>
            </div>
            <Link href="" className="mb-2"><Settings /></Link>
        </div>
    )
}