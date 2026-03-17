import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_consent');
    if (accepted === 'accepted' || accepted === 'declined') {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed z-30 bottom-4 left-4 right-20 md:left-auto md:bottom-6 md:right-36 md:w-96"
        >
          <div
            className="rounded-2xl border border-white/50 px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.12)]"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            <div className="flex items-start gap-3">

              {/* Icon */}
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-gold-600" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-black font-semibold text-sm mb-0.5">
                  We value your privacy
                </p>
                <p className="text-black/50 text-xs leading-relaxed">
                  We use cookies to enhance your experience. By clicking "Accept", you agree to our{' '}
                  <Link
                    to="/terms"
                    className="text-gold-600 hover:text-gold-500 underline underline-offset-2"
                    onClick={handleAccept}
                  >
                    Terms & Conditions
                  </Link>.
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => setVisible(false)}
                className="text-black/25 hover:text-black/50 transition-colors flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-3 ml-11">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-1.5 rounded-full border border-black/10 hover:border-black/20 text-black/50 hover:text-black text-xs font-medium transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}