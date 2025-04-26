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
  isRegistered: false,
  user: null,

  registerUser: (user: User) => {
    set({ isRegistered: true, user });
    if (typeof window !== 'undefined') {
      localStorage.setItem("isRegistered", "true");
    }
  },

  logoutUser: () => {
    set({ isRegistered: false, user: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isRegistered");
    }
  },
}));