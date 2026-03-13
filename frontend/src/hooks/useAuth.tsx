import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface LoginResponse {
  success?: boolean;
  require2FA?: boolean;
  adminId?: string;
}

interface AuthContextType {
  token: string | null;
  name: string | null;
  role: string | null;
  isAdmin: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  verifyOTP: (adminId: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {

    const storedToken = localStorage.getItem('adminToken');
    const storedName = localStorage.getItem('adminName');
    const storedRole = localStorage.getItem('adminRole');

    if (storedToken) {
      setToken(storedToken);
      setName(storedName);
      setRole(storedRole);
      setIsAdmin(true);
    }

    setIsInitializing(false);

  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {

    const { data } = await api.post('/admin/login', { email, password });

    if (data.require2FA) {
      return { require2FA: true, adminId: data.adminId };
    }

    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminName', data.name);
    localStorage.setItem('adminRole', data.role);

    setToken(data.token);
    setName(data.name);
    setRole(data.role);
    setIsAdmin(true);

    return { success: true };
  };

  const verifyOTP = async (adminId: string, otp: string) => {

    const { data } = await api.post('/admin/2fa/login', { adminId, token: otp });

    localStorage.setItem('adminToken', data.token);

    setToken(data.token);
    setIsAdmin(true);
  };

  const logout = () => {

    localStorage.clear();

    setToken(null);
    setName(null);
    setRole(null);
    setIsAdmin(false);

  };

  return (
    <AuthContext.Provider
      value={{
        token,
        name,
        role,
        isAdmin,
        isInitializing,
        login,
        verifyOTP,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}