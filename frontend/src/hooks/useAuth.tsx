import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

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
  const [token, setToken]           = useState<string | null>(null);
  const [name, setName]             = useState<string | null>(null);
  const [role, setRole]             = useState<string | null>(null);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // ── On mount: restore session only if not expired ───────────
  useEffect(() => {
    const storedToken  = localStorage.getItem('adminToken');
    const storedExpiry = localStorage.getItem('adminTokenExpiry');
    const storedName   = localStorage.getItem('adminName');
    const storedRole   = localStorage.getItem('adminRole');

    if (storedToken && storedExpiry && Date.now() < Number(storedExpiry)) {
      setToken(storedToken);
      setName(storedName);
      setRole(storedRole);
      setIsAdmin(true);
    } else {
      // Expired or missing — clear everything
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
    }

    setIsInitializing(false);
  }, []);

  // ── Auto logout when 1 hour is up ───────────────────────────
  useEffect(() => {
    if (!token) return;

    const expiry    = Number(localStorage.getItem('adminTokenExpiry'));
    const remaining = expiry - Date.now();

    if (remaining <= 0) { logout(); return; }

    const timer = setTimeout(() => {
      logout();
      window.location.href = '/admin/login';
    }, remaining);

    return () => clearTimeout(timer);
  }, [token]);

  // ── Login: email + password ──────────────────────────────────
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/admin/login', { email, password });

    if (data.require2FA) {
      return { require2FA: true, adminId: data.adminId };
    }

    // Direct login (no 2FA) — save with expiry
    const expiry = String(Date.now() + SESSION_DURATION);
    localStorage.setItem('adminToken',       data.token);
    localStorage.setItem('adminTokenExpiry', expiry);
    localStorage.setItem('adminName',        data.name);
    localStorage.setItem('adminRole',        data.role);

    setToken(data.token);
    setName(data.name);
    setRole(data.role);
    setIsAdmin(true);

    return { success: true };
  };

  // ── Verify OTP ───────────────────────────────────────────────
  const verifyOTP = async (adminId: string, otp: string) => {
    const { data } = await api.post('/admin/2fa/login', { adminId, token: otp });

    const expiry = String(Date.now() + SESSION_DURATION);
    localStorage.setItem('adminToken',       data.token);
    localStorage.setItem('adminTokenExpiry', expiry);
    localStorage.setItem('adminName',        data.name  ?? '');
    localStorage.setItem('adminRole',        data.role  ?? '');

    setToken(data.token);
    setName(data.name  ?? null);
    setRole(data.role  ?? null);
    setIsAdmin(true);
  };

  // ── Logout ───────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');

    setToken(null);
    setName(null);
    setRole(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, name, role, isAdmin, isInitializing, login, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}