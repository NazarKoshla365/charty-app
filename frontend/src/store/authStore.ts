import { create } from "zustand";

interface User {
  userId: string,
  username: string,
  email: string,
  profile: string,
}
interface AuthStore {
  isRegistered: boolean;
  user: User | null;
  registerUser: (user:User) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isRegistered: typeof window !== 'undefined' ? localStorage.getItem('isRegistered') === 'true' : false,
  user: null,
  registerUser: (user: User) => set({ isRegistered: true, user }),
  logoutUser: () => set({ isRegistered: false }),
}))