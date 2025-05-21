
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the types for our auth context
type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAuthenticated: false,
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Create the auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Hard-coded credentials
  const validCredentials = {
    username: 'info@bunisystems.com',
    password: 'bunisystems.com'
  };

  const login = (username: string, password: string): boolean => {
    if (username === validCredentials.username && password === validCredentials.password) {
      const user = { username };
      setUser(user);
      localStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
