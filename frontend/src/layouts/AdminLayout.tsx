import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { ChevronRight, ExternalLink, LayoutDashboard, LogOut, MessageSquare, Package, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'SEO Settings', href: '/admin/seo', icon: Search },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}


export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen admin-gradient">
      <aside className="w-64 flex flex-col border-r border-sidebar-border flex-shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
              <Package className="w-4 h-4 text-navy-900" />
            </div>
            <div>
              <p className="font-display font-bold text-sidebar-foreground text-sm leading-tight">GlobalTrade</p>
              <p className="text-xs text-sidebar-foreground/50">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all',
                isActive(item.href)
                  ? 'bg-sidebar-accent text-gold-400 shadow-sm'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {isActive(item.href) && <ChevronRight className="w-3 h-3 ml-auto text-gold-400" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Site</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-sidebar-border px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
              <span className="text-xs font-bold text-navy-900">A</span>
            </div>
            <span className="text-sm font-medium text-sidebar-foreground">Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}