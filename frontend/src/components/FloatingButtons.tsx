import { FaWhatsapp } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function FloatingButtons() {

  const search = useSearch({ strict: false });

const productName = (search as any).productName || '';
const scrollTo = (search as any).scrollTo || '';

useEffect(() => {
  if (productName || scrollTo === 'enquiry-form') {
    const el = document.getElementById('enquiry-form');

    if (el) {
      const yOffset = -80; // navbar height
const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

window.scrollTo({ top: y, behavior: 'instant' });
    }
  }
}, [productName, scrollTo]);
  return (
    <div className="fixed bottom-4 right-3 sm:right-6 flex flex-col items-end gap-4 z-50">
      
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919466363522"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <FaWhatsapp size={24} />
      </a>

      {/* Enquiry Button */}
      <Link
        to="/enquiry"
        search={{ scrollTo: 'enquiry-form' }} 
        className="bg-gold-400 hover:bg-gold-500 text-black p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <Mail size={22} />
      </Link>

    </div>
  );
}