import { Outlet } from '@tanstack/react-router';
import Footer from '../components/Footer';
import PublicNavbar from '../components/PublicNavbar';
import FloatingButtons from '../components/FloatingButtons';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}