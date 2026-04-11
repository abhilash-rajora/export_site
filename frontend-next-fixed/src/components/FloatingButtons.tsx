'use client';
import { FaWhatsapp } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function FloatingButtons() {
  const searchParams = useSearchParams();
  const productName = searchParams.get('productName') || '';
  const scrollTo = searchParams.get('scrollTo') || '';

  useEffect(() => {
    if (productName || scrollTo === 'enquiry-form') {
      const el = document.getElementById('enquiry-form');
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    }
  }, [productName, scrollTo]);

  return (
    <div className="fixed bottom-4 right-3 sm:right-6 flex flex-col items-end gap-4 z-50">
      <a
        href="https://wa.me/919466363522"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <FaWhatsapp size={24} />
      </a>
      <Link
        href="/enquiry?scrollTo=enquiry-form"
        className="bg-gold-400 hover:bg-gold-500 text-black p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <Mail size={22} />
      </Link>
    </div>
  );
}