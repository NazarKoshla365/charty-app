'use client'
import { createContext, useContext, useState, ReactNode, JSX } from "react";

interface AuthContextType {
  isRegistered: boolean;
  registerUser: () => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [isRegistered, setIsRegistered] = useState(false);

  const registerUser = () => setIsRegistered(true);
  const logoutUser = () => setIsRegistered(false);

  return (
    <AuthContext.Provider value={{ isRegistered, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
