import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { token, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !token) {
      navigate({ to: '/admin/login' });
    }
  }, [token, isInitializing, navigate]);

  // Still checking localStorage
  if (isInitializing) {
    return (
      <div className="min-h-screen admin-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          <p className="text-sidebar-foreground/60 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // No token — useEffect will redirect, show nothing meanwhile
  if (!token) return null;

  // Token exists — show dashboard directly
  return <>{children}</>;
}