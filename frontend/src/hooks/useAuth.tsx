import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface LoginResponse {
  success?: boolean;
  require2FA?: boolean;
  adminId?: string;
}

interface AuthContextType {
  token: string | null;
  isAdmin: boolean;
  isInitializing: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  verifyOTP: (adminId: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    if (stored) {
      setToken(stored);

      api.get('/admin/verify')
        .then((res) => {
  setIsAdmin(true);
  setRole(res.data.role);   // 👈 VERY IMPORTANT
})
        .catch(() => {
          localStorage.removeItem('adminToken');
          setToken(null);
        })
        .finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/admin/login', { email, password });

    if (data.require2FA) {
      return {
        require2FA: true,
        adminId: data.adminId,
      };
    }

    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setIsAdmin(true);

    return { success: true };
  };

  const verifyOTP = async (adminId: string, otp: string) => {
    const { data } = await api.post('/admin/2fa/login', {
      adminId,
      token: otp,
    });

    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, isInitializing, login, verifyOTP, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}