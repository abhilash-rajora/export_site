import { Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

import Footer from '../components/Footer';
import PublicNavbar from '../components/PublicNavbar';
import FloatingButtons from '../components/FloatingButtons';
import ScrollTopButton from '@/components/ScrollTopButton';
import ScrollToTop from '@/components/ScrollToTop';

import { loadGoogleAnalytics } from '../utils/loadAnalytics';

export default function PublicLayout() {

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('cookie_consent');
    if (!stored) return;

    try {
      const consent = JSON.parse(stored);

      if (consent?.analytics) {
          loadGoogleAnalytics(consent);

          window.gtag?.('consent', 'update', {
            analytics_storage: 'granted',
          });

          window['ga-disable-G-FHPMSX3KN1'] = false;

        } else {
          // 🔥 ensure GA disabled even if not loaded
          window['ga-disable-G-FHPMSX3KN1'] = true;

          window.gtag?.('consent', 'update', {
            analytics_storage: 'denied',
          });
        }

    } catch (err) {
      console.error('Invalid cookie_consent format');
    }

  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <FloatingButtons />
      <ScrollTopButton />
      <ScrollToTop />
    </div>
  );
}