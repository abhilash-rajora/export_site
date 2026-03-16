import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  const accepted = localStorage.getItem('cookie_consent');
  // Only hide if explicitly accepted or declined — NOT if just closed
  if (accepted === 'accepted' || accepted === 'declined') {
    setVisible(false);
    return;
  }
  // Show banner
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
          className="fixed bottom-0 left-0 right-0 z-[9998] w-full px-4 pb-6 pt-2"
        >
          <div className="bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-4 py-4 max-w-2xl mx-auto"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-gold-400" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-1">
                  We value your privacy
                </p>
                <p className="text-white/50 text-xs leading-relaxed">
                  We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies and agree to our{' '}
                  <Link to="/terms" className="text-gold-400 hover:text-gold-300 underline underline-offset-2" onClick={handleAccept}>
                    Terms & Conditions
                  </Link>.
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => setVisible(false)}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Buttons */}
            <div className="flex items-center gap-3 mt-4 ml-14">
              <button
                onClick={handleAccept}
                className="px-5 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="px-5 py-2 rounded-full border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-xs font-medium transition-colors"
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