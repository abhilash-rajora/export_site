import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const triggerMap: Record<string, { solid: string; transparent?: string }> = {
      '/': { solid: 'category-section', transparent: 'why-choose-section' },
      '/about': { solid: 'about-solid-trigger', transparent: 'about-transparent-trigger' },
      '/products': { solid: 'products-solid-trigger', transparent: 'products-transparent-trigger' },
      '/enquiry': { solid: 'enquiry-solid-trigger', transparent: 'enquiry-transparent-trigger' },
    };

    const triggers = triggerMap[location.pathname] ??
  (location.pathname.startsWith('/products/')
  ? { solid: 'product-detail-solid-trigger' }
  : undefined);

    if (!triggers) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      const solidEl = document.getElementById(triggers.solid);
      const transparentEl = triggers.transparent
        ? document.getElementById(triggers.transparent)
        : null;

      const pastSolid = (solidEl?.getBoundingClientRect().top ?? Infinity) <= 64;
      const pastTransparent = transparentEl
        ? (transparentEl.getBoundingClientRect().top ?? Infinity) <= 64
        : false;

      setScrolled(pastSolid && !pastTransparent);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Enquiry', href: '/enquiry' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 border-b transition-all duration-300',
        !scrolled
  ? 'bg-navy-900/70 border-white/10 backdrop-blur-2xl'
  : 'bg-navy-900 border-navy-700 shadow-navy',
      )}
    >
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center group">
            <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="text-white transition-colors duration-300 group-hover:text-gold-400">Global</span>
              <span className="text-gold-400 transition-colors duration-300 group-hover:text-white">Trade</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-md text-base font-semibold transition-colors duration-200 hover:text-gold-400',
                  isActive(link.href) ? 'text-gold-400' : 'text-white/90',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isOpen && (
              <div className="absolute top-12 right-0 w-48 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-2 space-y-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors duration-200 hover:text-gold-400 hover:bg-white/5',
                      isActive(link.href) ? 'text-gold-400' : 'text-white/90',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}