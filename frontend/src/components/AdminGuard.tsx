import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, ShieldX } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useIsAdmin } from '../hooks/useQueries';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { token, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading, isFetched } = useIsAdmin();

  useEffect(() => {
    if (!isInitializing && !token) {
      navigate({ to: '/admin/login' });
    }
  }, [token, isInitializing, navigate]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen admin-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          <p className="text-sidebar-foreground/60 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!token) return null;

  if (isFetched && !isAdmin) {
    return (
      <div className="min-h-screen admin-gradient flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-sidebar-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-sidebar-foreground/60 text-sm">
              You don't have admin privileges to access this panel.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="border-sidebar-border text-sidebar-foreground"
          >
            Back to Website
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}