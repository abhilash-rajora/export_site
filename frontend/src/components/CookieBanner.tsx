import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Cookie, X } from 'lucide-react';
import { loadGoogleAnalytics } from '../utils/loadAnalytics';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

useEffect(() => {
  if (typeof window === 'undefined') return;

  const consent = localStorage.getItem('cookie_consent');
  const tempHide = localStorage.getItem('cookie_temp_hide');

 const isHidden = tempHide && Date.now() < parseInt(tempHide, 10);

  if (!consent && !isHidden) {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }
}, []);

  // ✅ Accept All
const handleAcceptAll = () => {
  const consent = {
    essential: true,
    analytics: true,
    marketing: true,
  };

  localStorage.setItem('cookie_consent', JSON.stringify(consent));

  window['ga-disable-G-FHPMSX3KN1'] = false;

  loadGoogleAnalytics(consent);

  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
  });

  window.gtag?.('event', 'cookie_accept', {
  event_category: 'engagement',
  event_label: 'accepted_all',
});

  setVisible(false);
};

  // ❌ Reject All
const handleRejectAll = () => {
  const consent = {
    essential: true,
    analytics: false,
    marketing: false,
  };

  localStorage.setItem('cookie_consent', JSON.stringify(consent));

window.gtag?.('consent', 'update', {
  analytics_storage: 'denied',
});

window.gtag?.('event', 'cookie_reject', {
  event_category: 'engagement',
  event_label: 'rejected_all',
});

window['ga-disable-G-FHPMSX3KN1'] = true;

  setVisible(false);
};

  // ⚙️ Essential Only
const handleEssential = () => {
  const consent = {
    essential: true,
    analytics: false,
    marketing: false,
  };

  localStorage.setItem('cookie_consent', JSON.stringify(consent));

  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
  });

  window.gtag?.('event', 'cookie_essential', {
  event_category: 'engagement',
  event_label: 'essential_only',
});
  window['ga-disable-G-FHPMSX3KN1'] = true;

  setVisible(false);
};

  // ❌ Close (temporary)
const handleClose = () => {
  const expireTime = Date.now() + 10 * 60 * 1000; // 10 min
  localStorage.setItem('cookie_temp_hide', expireTime.toString());
  setVisible(false);
};

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed z-30 bottom-4 left-4 right-20 md:left-auto md:bottom-6 md:right-36 md:w-96"
        >
          <div
            className="rounded-2xl border border-white/50 px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.2)]"
            style={{
              background: 'rgba(255,255,255,0.5)',
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
                  We use cookies to enhance your experience. Manage your preferences or accept all cookies. Read our{' '}
                  <Link
                    to="/terms"
                    className="text-gold-600 hover:text-gold-500 underline underline-offset-2"
                  >
                    Terms & Conditions
                  </Link>.
                </p>
              </div>

              {/* Close */}
              <button
                onClick={handleClose}
                className="text-black/25 hover:text-black/50 transition-colors flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-3 ml-11">

              <button
                onClick={handleAcceptAll}
                className="px-4 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold transition"
              >
                Accept All
              </button>

              <button
                onClick={handleRejectAll}
                className="px-4 py-1.5 rounded-full border border-black/10 hover:border-black/20 text-black/60 hover:text-black text-xs font-medium transition"
              >
                Reject All
              </button>

              <button
                onClick={handleEssential}
                className="px-4 py-1.5 rounded-full border border-black/10 hover:border-black/20 text-black/60 hover:text-black text-xs font-medium transition"
              >
                Essential Only
              </button>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}