'use client';

import Footer from '@/components/Footer';
import PublicNavbar from '@/components/PublicNavbar';
import FloatingButtons from '@/components/FloatingButtons';
import ScrollTopButton from '@/components/ScrollTopButton';
import ScrollToTop from '@/components/ScrollToTop';
import CookieBanner from '@/components/CookieBanner';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
      <ScrollTopButton />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}
