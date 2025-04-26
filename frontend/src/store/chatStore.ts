import { create } from "zustand";

type Chat = {
    id: number,
    friendId: number,
    name: string,
    message: string,
    img: string,
    time?: string
} 



interface ChatStore {
    chatAction: Chat | null;
    chats: Chat[];

    setChatAction: (chat: Chat) => void;
    setChats: (chats: Chat[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chatAction: null,
    chats:[],

    setChatAction: (chat) => set({ chatAction: chat }),
    setChats: (chats: Chat[]) => set({ chats }),
}))