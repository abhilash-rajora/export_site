import { FaWhatsapp } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50">
      
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
        className="bg-gold-400 hover:bg-gold-500 text-black p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <Mail size={22} />
      </Link>

    </div>
  );
}