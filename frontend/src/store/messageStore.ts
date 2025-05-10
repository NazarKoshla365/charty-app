import { create } from "zustand"
type Message = {
    _id: string,
    chat: string,
    from: string | null,
    message: string,
    replyTo: string | null,
    timestamp: Date,
}

interface MessageStore {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    removeMessage: (messageId: string) => void;
}


export const useMessageStore = create<MessageStore>((set) => ({
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
    addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
    removeMessage: (messageId: string) => set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
    })),
}));