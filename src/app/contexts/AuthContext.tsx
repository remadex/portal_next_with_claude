'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';  // First run: npm install js-cookie @types/js-cookie

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
}

interface UpdateProfileData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  oldPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, pin: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (userId: string, pin: string) => {
    try {
      if (userId === 'scard' && pin === '1234') {
        const mockUser = {
          id: 1,
          userId,
          name: 'Scard User',
          email: 'scard@example.com',
        };
        
        // Set both localStorage and cookie
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        Cookies.set('user', JSON.stringify(mockUser), { expires: 7 }); // Expires in 7 days
        
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    Cookies.remove('user');
    router.push('/login');
  };

  const forgotPassword = async (email: string) => {
    // In a real app, you'd make an API call here
    // For demo, we'll just simulate the process
    console.log('Password reset email sent to:', email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // In a real app, you'd verify the token and update the password
    console.log('Password reset with token:', token);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    // Implement your profile update logic here
    // This is where you'd make an API call to update the user's profile
    // For now, we'll just update the local state
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, resetPassword, isLoading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 