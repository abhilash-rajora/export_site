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
          className="fixed z-40 bottom-4 right-4 md:bottom-6 md:right-36 w-[calc(100vw-2rem)] md:w-96"
        >
          <div
            className="bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-4 py-3"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
          >
            {/* Mobile: X on left | Desktop: X on right */}
            <div className="flex items-start gap-3 flex-row-reverse md:flex-row">

              {/* Close — left on mobile, right on desktop */}
              <button
                onClick={() => setVisible(false)}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-gold-400" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-0.5">
                  We value your privacy
                </p>
                <p className="text-white/50 text-xs leading-relaxed">
                  We use cookies to enhance your experience. By clicking "Accept", you agree to our{' '}
                  <Link
                    to="/terms"
                    className="text-gold-400 hover:text-gold-300 underline underline-offset-2"
                    onClick={handleAccept}
                  >
                    Terms & Conditions
                  </Link>.
                </p>
              </div>

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
                className="px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-xs font-medium transition-colors"
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