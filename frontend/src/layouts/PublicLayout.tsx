import { Outlet } from '@tanstack/react-router';
import Footer from '../components/Footer';
import PublicNavbar from '../components/PublicNavbar';
import FloatingButtons from '../components/FloatingButtons';
import ScrollTopButton from '@/components/ScrollTopButton';
import ScrollToTop from '@/components/ScrollToTop';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
       <ScrollTopButton /> 
    </div>
  );
}