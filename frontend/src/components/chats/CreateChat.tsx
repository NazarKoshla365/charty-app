'use client'
import { CircleX } from 'lucide-react';
import { useState } from 'react';

interface CreateChatProps {
    isClosed: boolean;
    setIsClosedAction: (isClosed: boolean) => void;
    onNewChatCreatedAction: (chat: any) => void;

}




export function CreateChat({ isClosed, setIsClosedAction, onNewChatCreatedAction }: CreateChatProps) {
    if (isClosed) return null;
    const [formData, setFormData] = useState('')


    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:4000/chat/create-chat', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData })
            })
            const data = await res.json()
            console.log(data)
            if (data) {
                onNewChatCreatedAction(data.chat)
                setIsClosedAction(true)
                setFormData('')
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFormData(value)
    }
    return (
        <div className="absolute z-40 top-5" >
            <div className="relative bg-white  shadow-[0_0_24px_0_rgba(0,_0,_0,_0.08)] py-10 px-15 rounded-2xl">
                <button onClick={() => setIsClosedAction(true)} className='absolute top-2 right-2'>
                    <CircleX size={30} /></button>
                <h4 className="text-2xl text-center mb-4">Create Chat</h4>
                <form onSubmit={handleAddFriend} className="flex flex-col gap-y-4">
                    <input name='username' onChange={handleChange} value={formData} className="py-2 px-3 border-2 outline-0 rounded-xl" placeholder="Search user by username" type="text" />
                    <button className="text-lg py-2 px-3 mx-auto inline-block justify-center w-[150px]  bg-[#615EF01A] text-[#615ef0] rounded-xl" type="submit">Search</button>
                </form>
            </div>
        </div>


    )
}