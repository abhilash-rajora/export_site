import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const prev = lastScrollY.current;
      setScrolled(currentY > 50);
      if (currentY > 100) {
        if (currentY > prev) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Update wishlist count
  useEffect(() => {
    const update = () => {
      try {
        const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(list.length);
      } catch {
        setWishlistCount(0);
      }
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const WishlistIcon = () => (
    <Link
      to="/wishlist"
      className="relative p-2 rounded-full text-white/80 hover:text-red-400 transition-colors"
      title="Wishlist"
    >
      <Heart className={cn('w-5 h-5', location.pathname === '/wishlist' ? 'text-red-400 fill-current' : '')} />
      {wishlistCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
          {wishlistCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >

        {/* ── Desktop ── */}
        <div className="hidden md:block pointer-events-auto">
          {!scrolled ? (
            <div className="relative flex items-center justify-between px-8 mt-10 max-w-7xl mx-auto">

              {/* Logo pill */}
              <Link
                to="/"
                className="flex items-center px-1 py-0.5 bg-white/10 border border-white/40 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                style={{ WebkitBackdropFilter: 'blur(8px)' }}
              >
                <img src="/logo1.png" alt="WeExports" className="h-14 w-auto object-contain" />
              </Link>

              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'relative px-4 py-2 transition-all duration-200 group',
                      isActive(link.href) ? 'text-gold-400' : 'text-white/90 hover:text-gold-400',
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      'absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold-400 rounded-full transition-all duration-300 origin-left',
                      isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )} />
                  </Link>
                ))}

                {/* Wishlist */}
                <WishlistIcon />

                <Link
                  to="/enquiry"
                  className="ml-1 flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold bg-white text-navy-900 hover:bg-gold-400 shadow-lg transition-all duration-200"
                >
                  Enquiry
                  <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-8 mt-4 max-w-7xl mx-auto">

              {/* Logo pill scrolled */}
              <Link
                to="/"
                className="flex items-center px-1 py-0.5 bg-navy-900/80 backdrop-blur-md border border-white/40 rounded-full shadow-xl transition-all duration-300 hover:border-white/60"
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
              >
                <img src="/logo1.png" alt="WeExports" className="h-14 w-auto object-contain" />
              </Link>

              <div
                className="flex items-center gap-1 px-4 py-3 bg-navy-900/80 backdrop-blur-md border border-white/40 rounded-full shadow-xl"
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'relative px-5 py-2 rounded-full text-base transition-all duration-200 group',
                      isActive(link.href) ? 'text-gold-400' : 'text-white/90 hover:text-gold-400',
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      'absolute bottom-1 left-5 right-5 h-[1.5px] bg-gold-400 rounded-full transition-all duration-300 origin-left',
                      isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )} />
                  </Link>
                ))}

                {/* Wishlist inside pill */}
                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-full text-white/70 hover:text-red-400 transition-colors"
                  title="Wishlist"
                >
                  <Heart className={cn('w-4 h-4', location.pathname === '/wishlist' ? 'text-red-400 fill-current' : '')} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/enquiry"
                  className={cn(
                    'ml-1 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200',
                    location.pathname === '/enquiry'
                      ? 'bg-gold-400 text-navy-900'
                      : 'bg-white text-navy-900 hover:bg-gold-400',
                  )}
                >
                  Enquiry
                  <span className="w-5 h-5 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile top bar ── */}
        <div className="md:hidden flex items-center justify-between pointer-events-auto px-4 mt-4">

          {/* Logo pill */}
          <Link
            to="/"
            className="flex items-center px-1 py-0.5 bg-white/10 border border-white/40 rounded-full shadow-lg backdrop-blur-sm transition-all duration-500"
            style={{ WebkitBackdropFilter: 'blur(8px)' }}
          >
            <img src="/logo1.png" alt="WeExports" className="h-11 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Wishlist on mobile */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full bg-white/10 border border-white/40 text-white/80 hover:text-red-400 transition-colors shadow-lg"
            >
              <Heart className={cn('w-4 h-4', location.pathname === '/wishlist' ? 'text-red-400 fill-current' : '')} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Menu pill + popover */}
            <div className="relative pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300',
                  isOpen
                    ? 'bg-navy-900 border border-white/40 text-white shadow-xl'
                    : 'bg-white/10 border border-white/40 text-white shadow-lg backdrop-blur-sm',
                )}
                style={{ zIndex: 120 }}
              >
                <span>{isOpen ? 'Close' : 'Menu'}</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-center">
                        <X className="w-4 h-4" />
                      </motion.span>
                    ) : (
                      <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-center">
                        <Menu className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>

              {/* Backdrop */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0" style={{ zIndex: 90 }} onClick={() => setIsOpen(false)} />
                )}
              </AnimatePresence>

              {/* Popover */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.4, scaleY: 0.2 }}
                    animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleX: 0.4, scaleY: 0.2 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top right', zIndex: 110 }}
                    className="absolute top-14 right-0 w-56 bg-navy-900 border border-white/30 rounded-2xl shadow-2xl pointer-events-auto"
                  >
                    <div className="p-2">
                      {navLinks.map((link, i) => (
                        <motion.div key={link.href} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}>
                          <Link
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 hover:text-gold-400 hover:bg-white/5',
                              isActive(link.href) ? 'text-gold-400 bg-white/5' : 'text-white/90',
                            )}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}

                      <div className="my-1.5 border-t border-white/10" />

                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + navLinks.length * 0.12, duration: 0.5 }}>
                        <Link
                          to="/enquiry"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold bg-gold-500 text-navy-900 hover:bg-gold-400 transition-colors duration-200"
                        >
                          Enquiry
                          <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">→</span>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </motion.header>
    </>
  );
}