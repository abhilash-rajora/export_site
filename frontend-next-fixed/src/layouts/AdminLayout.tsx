'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, ExternalLink, LayoutDashboard, LogOut, Menu, MessageSquare, Package, Search, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard',    href: '/admin',           icon: LayoutDashboard },
  { label: 'Products',     href: '/admin/products',  icon: Package },
  { label: 'Blog',         href: '/admin/blog',      icon: BookOpen },
  { label: 'Enquiries',    href: '/admin/enquiries', icon: MessageSquare },
  { label: 'SEO Settings', href: '/admin/seo',       icon: Search },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const SidebarNav = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <nav className="flex-1 p-4 space-y-1 bg-white">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all',
              isActive(item.href)
                ? 'bg-sidebar-accent text-gold-400 shadow-sm'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/100',
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
            {isActive(item.href) && <ChevronRight className="w-3 h-3 ml-auto text-gold-400" />}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border space-y-1 bg-white">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all">
          <ExternalLink className="w-4 h-4" />
          <span>View Site</span>
        </a>
        <button type="button" onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  const SidebarHeader = () => (
    <div className="p-6 border-b border-sidebar-border bg-white">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
          <Package className="w-4 h-4 text-navy-900" />
        </div>
        <div>
          <p className="font-display font-bold text-muted-foreground text-sm leading-tight">WeExports</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen admin-gradient bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border flex-shrink-0">
        <SidebarHeader />
        <SidebarNav />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-white">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-2xl z-10">
            <SidebarHeader />
            <SidebarNav onItemClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="border-b border-sidebar-border px-4 md:px-8 py-4 flex items-center justify-between">
          <button type="button"
            className="md:hidden p-2 rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
              <span className="text-xs font-bold text-navy-900">A</span>
            </div>
            <span className="text-sm font-medium text-black">Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}