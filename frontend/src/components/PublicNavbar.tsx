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
        setHidden(currentY > prev);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const update = () => {
      try {
        const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(list.length);
      } catch { setWishlistCount(0); }
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Blog',     href: '/blog' },
    { label: 'About',    href: '/about' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const telegramPill = {
    className: 'rounded-full border border-white/50 shadow-[0_2px_16px_rgba(0,0,0,0.12)]',
    style: {
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(12px) saturate(160%)',
      WebkitBackdropFilter: 'blur(12px) saturate(160%)',
    } as React.CSSProperties,
  };

  const LogoImage = ({ height }: { height: string }) => {
    const px = height === 'h-12' ? '56px' : '44px';
    return (
      <div className="relative flex items-center justify-center w-[140px] h-[44px] md:w-[160px] md:h-[56px]">
        <img src="/logo1.png" alt="WeExports" className="absolute transition-opacity duration-300"
          style={{ height: px, width: 'auto', objectFit: 'contain', opacity: scrolled ? 0 : 1, pointerEvents: 'none' }} />
        <img src="/logo-dark.png" alt="WeExports" className="absolute transition-opacity duration-300"
          style={{ height: px, width: 'auto', objectFit: 'contain', opacity: scrolled ? 1 : 0, pointerEvents: 'none' }} />
      </div>
    );
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? '-120%' : '0%', opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="navbar-dim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: '95px', zIndex: 0,
                backdropFilter: 'blur(0px) saturate(100%)',
                WebkitBackdropFilter: 'blur(0px) saturate(100%)',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.0.1), rgba(255,255,255,0.03))',
                maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Desktop ── */}
        <div className="hidden md:block pointer-events-auto relative z-10">
          <div className="flex items-center justify-between px-8 mt-6 max-w-7xl mx-auto">

            <Link to="/"
              className={cn('flex items-center justify-center px-4 py-1.5 h-[48px] md:h-[60px] rounded-full transition-all duration-500',
                scrolled ? telegramPill.className : 'bg-white/10 border border-white/40 shadow-lg backdrop-blur-sm')}
              style={scrolled ? telegramPill.style : { WebkitBackdropFilter: 'blur(8px)' }}
            >
              <LogoImage height="h-12 md:h-12px" />
            </Link>

            <AnimatePresence mode="wait">
              {!scrolled ? (
                <motion.div key="plain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} to={link.href}
                      className={cn('relative px-4 py-2 transition-all duration-200 group',
                        isActive(link.href) ? 'text-gold-400' : 'text-white/90 hover:scale-105 transition-transform duration-200')}
                    >
                      {link.label}
                      <span className={cn('absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold-400 rounded-full transition-all duration-300 origin-left',
                        isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
                    </Link>
                  ))}
                  <Link to="/wishlist" className="relative p-2 rounded-full text-white/80 hover:text-red-400 transition-colors" title="Wishlist">
                    <Heart className={cn('w-5 h-5', location.pathname === '/wishlist' ? 'text-red-400 fill-current' : '')} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/enquiry"
                    className="ml-1 flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    Get Quote
                    <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">→</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="pill"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn('flex items-center gap-0 px-2 py-0.5', telegramPill.className)}
                  style={telegramPill.style}
                >
                  {navLinks.map((link) => (
                    <Link key={link.href} to={link.href}
                      className={cn('relative flex items-center px-4 h-12 rounded-full text-[15px] font-medium transition-all duration-200 group',
                        isActive(link.href) ? 'text-gold-600' : 'text-black hover:text-black hover:bg-black/[0.09]')}
                    >
                      {link.label}
                      <span className={cn('absolute bottom-2.5 left-5 right-5 h-[1.5px] bg-gold-500 rounded-full transition-all duration-300 origin-left',
                        isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
                    </Link>
                  ))}
                  <span className="w-px h-6 bg-black/[0.08] mx-0.5 shrink-0" />
                  <Link to="/wishlist"
                    className={cn('relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200',
                      location.pathname === '/wishlist' ? 'text-red-500' : 'text-black hover:text-red-500 hover:bg-black/[0.04]')}
                    title="Wishlist"
                  >
                    <Heart className={cn('w-[18px] h-[18px]', location.pathname === '/wishlist' ? 'fill-current' : '')} />
                    {wishlistCount > 0 && (
                      <span className="absolute top-2 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <span className="w-px h-6 bg-black/[0.08] mx-0.5 shrink-0" />
                  <Link to="/enquiry"
                    className={cn('flex items-center gap-1.5 mx-2.5 my-auto px-5 h-10 rounded-full text-[15px] font-bold transition-all duration-200',
                      location.pathname === '/enquiry' ? 'bg-gold-400 text-navy-900' : 'bg-navy-900 text-white hover:bg-gold-400 hover:text-navy-900')}
                  >
                    Get Quote
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">→</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden flex items-center justify-between pointer-events-auto px-4 mt-4 relative z-10">
          <Link to="/"
            className={cn('flex items-center px-1 py-0.5 rounded-full transition-all duration-500',
              scrolled ? telegramPill.className : 'bg-white/10 border border-white/40 shadow-lg backdrop-blur-sm')}
            style={scrolled ? telegramPill.style : { WebkitBackdropFilter: 'blur(8px)' }}
          >
            <LogoImage height="h-11" />
          </Link>

          <div className="relative pointer-events-auto">
            <button type="button" onClick={() => setIsOpen((v) => !v)}
              className={cn('relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300',
                isOpen ? 'bg-navy-900 border border-white/40 text-white shadow-xl'
                  : scrolled ? cn(telegramPill.className, 'text-black')
                  : 'bg-white/10 border border-white/40 text-white shadow-lg backdrop-blur-sm')}
              style={{ zIndex: 120, ...(scrolled && !isOpen ? telegramPill.style : {}) }}
            >
              <span>{isOpen ? 'Close' : 'Menu'}</span>
              <span className={cn('w-7 h-7 rounded-full flex items-center justify-center overflow-hidden', scrolled && !isOpen ? 'bg-black/[0.06]' : 'bg-white/20')}>
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

            <AnimatePresence>
              {isOpen && (
                <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="fixed inset-0" style={{ zIndex: 90 }} onClick={() => setIsOpen(false)} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scaleX: 0.4, scaleY: 0.2 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'top right', zIndex: 110 }}
                  className="absolute top-14 right-0 w-56 bg-navy-900 border border-white/30 rounded-2xl shadow-2xl pointer-events-auto"
                >
                  <div className="p-2">
                    {navLinks.map((link, i) => (
                      <motion.div key={link.href} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.3 }}>
                        <Link to={link.href} onClick={() => setIsOpen(false)}
                          className={cn('flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 hover:text-gold-400 hover:bg-white/5',
                            isActive(link.href) ? 'text-gold-400 bg-white/5' : 'text-white/90')}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}

                    <div className="my-1.5 border-t border-white/10" />

                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + navLinks.length * 0.12, duration: 0.3 }}>
                      <Link to="/wishlist" onClick={() => setIsOpen(false)}
                        className={cn('flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 hover:bg-white/5',
                          location.pathname === '/wishlist' ? 'text-red-400 bg-white/5' : 'text-white/90 hover:text-red-400')}
                      >
                        <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{wishlistCount}</span>
                        )}
                      </Link>
                    </motion.div>

                    <div className="my-1.5 border-t border-white/10" />

                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + (navLinks.length + 1) * 0.12, duration: 0.3 }}>
                      <Link to="/enquiry" onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold bg-gold-500 text-navy-900 hover:bg-gold-400 transition-colors duration-200">
                        Get Quote
                        <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">→</span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
}