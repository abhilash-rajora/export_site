import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

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
            /* AT TOP — logo pill left, plain links + enquiry right (original style) */
            <div className="relative flex items-center justify-between px-8 mt-5 max-w-7xl mx-auto">

              {/* Logo — always in pill */}
              <Link
                to="/"
                className="flex items-center px-5 py-3.5 bg-white/10 border border-white/40 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                style={{ WebkitBackdropFilter: 'blur(8px)' }}
              >
                <span className="font-display text-xl font-extrabold tracking-tight">
                  <span className="text-white">We</span>
                  <span className="text-gold-400">Exports</span>
                </span>
              </Link>

              {/* Right side: plain nav links + enquiry (original) */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'relative px-4 py-2 font-semibold transition-all duration-200 group',
                      isActive(link.href) ? 'text-gold-400' : 'text-white/90 hover:text-gold-400',
                    )}
                  >
                    {link.label}
                    {/* Underline — width matches text, not padding */}
                    <span className={cn(
                      'absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold-400 rounded-full transition-all duration-300 origin-left',
                      isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )} />
                  </Link>
                ))}
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
            /* SCROLLED — both pills with white border */
            <div className="flex items-center justify-between px-8 mt-4 max-w-7xl mx-auto">

              {/* Logo pill */}
              <Link
                to="/"
                className="flex items-center px-5 py-3 bg-navy-900/80 backdrop-blur-md border border-white/40 rounded-full shadow-xl transition-all duration-300 hover:border-white/60"
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
              >
                <span className="font-display text-xl font-extrabold tracking-tight">
                  <span className="text-white">We</span>
                  <span className="text-gold-400">Exports</span>
                </span>
              </Link>

              {/* Nav pill */}
              <div
                className="flex items-center gap-1 px-4 py-3 bg-navy-900/80 backdrop-blur-md border border-white/40 rounded-full shadow-xl"
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'relative px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 group',
                      isActive(link.href) ? 'text-gold-400' : 'text-white/90 hover:text-gold-400',
                    )}
                  >
                    {link.label}
                    {/* Underline — width matches text, not padding */}
                    <span className={cn(
                      'absolute bottom-1 left-5 right-5 h-[1.5px] bg-gold-400 rounded-full transition-all duration-300 origin-left',
                      isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )} />
                  </Link>
                ))}
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

          {/* Logo pill — always styled */}
          <Link
            to="/"
            className="flex items-center px-4 py-2 bg-white/10 border border-white/40 rounded-full shadow-lg backdrop-blur-sm transition-all duration-500"
            style={{ WebkitBackdropFilter: 'blur(8px)' }}
          >
            <span className="font-display text-xl font-extrabold tracking-tight">
              <span className="text-white">We</span>
              <span className="text-gold-400">Exports</span>
            </span>
          </Link>

          {/* Menu pill + popover */}
          <div className="relative pointer-events-auto">

            {/* Pill button */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={cn(
                'relative z-[80] flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300',
                isOpen
                  ? 'bg-navy-900 border border-white/40 text-white shadow-xl'
                  : 'bg-white/10 border border-white/40 text-white shadow-lg backdrop-blur-sm',
              )}
            >
              <span>{isOpen ? 'Close' : 'Menu'}</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center"
                    >
                      <Menu className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>

            {/* Popover */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0.4, scaleY: 0.2 }}
                  animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleX: 0.4, scaleY: 0.2 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute top-14 right-0 w-56 bg-navy-900 border border-white/30 rounded-2xl shadow-2xl z-[75]"
                >
                  <div className="p-2">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
                      >
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

                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + navLinks.length * 0.12, duration: 0.5 }}
                    >
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

      {/* Invisible backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}