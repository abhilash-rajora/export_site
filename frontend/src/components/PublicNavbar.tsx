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
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const telegramPill = {
    className: 'rounded-full border border-white/50 shadow-[0_2px_16px_rgba(0,0,0,0.12)]',
    style: {
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    } as React.CSSProperties,
  };

const LogoImage = ({ height }: { height: string }) => {
  const px = height === 'h-14' ? '56px' : '44px';

  return (
    <AnimatePresence mode="wait">
      {scrolled ? (
        <motion.img
          key="logo-dark"
          src="/logo-dark.png"
          alt="WeExports"
          style={{
            height: px,
            width: 'auto',
            objectFit: 'contain',
            transform: 'scale(1.3)',   // 👈 increase this
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.img
          key="logo-light"
          src="/logo1.png"
          alt="WeExports"
          style={{
            height: px,
            width: 'auto',
            objectFit: 'contain',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  );
};

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >

        {/* White fade — only when scrolled, fades content behind pill */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="navbar-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: '120px',
                zIndex: 0,

                // 👉 REAL glass blur
                backdropFilter: 'blur(4px) saturate(140%)',
                WebkitBackdropFilter: 'blur(14px)',

                // 👉 very light tint (optional but better)
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.05))',

                // 👉 THIS IS THE MAGIC (no hard line)
                maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Desktop ── */}
        <div className="hidden md:block pointer-events-auto relative z-10">
          <div className="flex items-center justify-between px-8 mt-6 max-w-7xl mx-auto">

            {/* Logo pill */}
            <Link
              to="/"
              className={cn(
                'flex items-center px-5 py-1 rounded-full transition-all duration-500',
                scrolled
                  ? telegramPill.className
                  : 'bg-white/10 border border-white/40 shadow-lg backdrop-blur-sm',
              )}
              style={scrolled ? telegramPill.style : { WebkitBackdropFilter: 'blur(8px)' }}
            >
              <LogoImage height="h-14" />
            </Link>

            {/* Nav */}
            <AnimatePresence mode="wait">
              {!scrolled ? (
                // ── Plain top navbar ──
                <motion.div
                  key="plain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1"
                >
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

                  <Link
                    to="/enquiry"
                    className="ml-1 flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold bg-white text-navy-900 hover:bg-gold-400 shadow-lg transition-all duration-200"
                  >
                    Enquiry
                    <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">→</span>
                  </Link>
                </motion.div>
              ) : (
                // ── Telegram-style pill ──
                <motion.div
                  key="pill"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={cn('flex items-center gap-0 px-2 py-0.5', telegramPill.className)}
                  style={telegramPill.style}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        'relative flex items-center px-5 h-14 rounded-full text-[15px] font-medium transition-all duration-200 group',
                        isActive(link.href)
                          ? 'text-gold-600'
                          : 'text-black hover:text-black hover:bg-black/[0.04]',
                      )}
                    >
                      {link.label}
                      <span className={cn(
                        'absolute bottom-2.5 left-5 right-5 h-[1.5px] bg-gold-500 rounded-full transition-all duration-300 origin-left',
                        isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )} />
                    </Link>
                  ))}

                  {/* Divider */}
                  <span className="w-px h-6 bg-black/[0.08] mx-0.5 shrink-0" />

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className={cn(
                      'relative flex items-center justify-center w-12 h-14 rounded-full transition-colors duration-200',
                      location.pathname === '/wishlist'
                        ? 'text-red-500'
                        : 'text-black hover:text-red-500 hover:bg-black/[0.04]',
                    )}
                    title="Wishlist"
                  >
                    <Heart className={cn('w-[18px] h-[18px]', location.pathname === '/wishlist' ? 'fill-current' : '')} />
                    {wishlistCount > 0 && (
                      <span className="absolute top-2 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Divider */}
                  <span className="w-px h-6 bg-black/[0.08] mx-0.5 shrink-0" />

                  {/* Enquiry */}
                  <Link
                    to="/enquiry"
                    className={cn(
                      'flex items-center gap-1.5 mx-1.5 my-auto px-5 h-10 rounded-full text-[15px] font-bold transition-all duration-200',
                      location.pathname === '/enquiry'
                        ? 'bg-gold-400 text-navy-900'
                        : 'bg-navy-900 text-white hover:bg-gold-400 hover:text-navy-900',
                    )}
                  >
                    Enquiry
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">→</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile top bar ── */}
        <div className="md:hidden flex items-center justify-between pointer-events-auto px-4 mt-4 relative z-10">

          <Link
            to="/"
            className={cn(
              'flex items-center px-1 py-0.5 rounded-full transition-all duration-500',
              scrolled
                ? telegramPill.className
                : 'bg-white/10 border border-white/40 shadow-lg backdrop-blur-sm',
            )}
            style={scrolled ? telegramPill.style : { WebkitBackdropFilter: 'blur(8px)' }}
          >
            <LogoImage height="h-11" />
          </Link>

          <div className="relative pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300',
                isOpen
                  ? 'bg-navy-900 border border-white/40 text-white shadow-xl'
                  : scrolled
                    ? cn(telegramPill.className, 'text-black')
                    : 'bg-white/10 border border-white/40 text-white shadow-lg backdrop-blur-sm',
              )}
              style={{
                zIndex: 120,
                ...(scrolled && !isOpen ? telegramPill.style : {}),
              }}
            >
              <span>{isOpen ? 'Close' : 'Menu'}</span>
              <span className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center overflow-hidden',
                scrolled && !isOpen ? 'bg-black/[0.06]' : 'bg-white/20',
              )}>
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
                <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0" style={{ zIndex: 90 }} onClick={() => setIsOpen(false)} />
              )}
            </AnimatePresence>

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
                        to="/wishlist"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 hover:bg-white/5',
                          location.pathname === '/wishlist' ? 'text-red-400 bg-white/5' : 'text-white/90 hover:text-red-400',
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </span>
                        {wishlistCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>

                    <div className="my-1.5 border-t border-white/10" />

                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + (navLinks.length + 1) * 0.12, duration: 0.5 }}>
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

      </motion.header>
    </>
  );
}