"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { token, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitializing && !token && pathname !== "/admin/login") {
      router.push('/admin/login');
    }
  }, [token, isInitializing, pathname, router]);

  // ⛔ LOGIN PAGE KO BYPASS KARO
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen admin-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
      </div>
    );
  }

  if (!token) return null;

  return <>{children}</>;
}