import { Link } from '@tanstack/react-router';
import { Globe, Mail, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer-section" className="bg-navy-900 text-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center group ">
  <span className="font-display text-2xl md:text-xl font-extrabold tracking-tight">
    <span className="text-white transition-colors duration-300 group-hover:text-gold-400">
      We
    </span>
    <span className="text-gold-400 transition-colors duration-300 group-hover:text-white">
      Exports
    </span>
  </span>
</Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Your trusted we.export partner connecting quality products from across the world to
              international markets.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:wexports@gmail.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-gold-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                wexports@gmail.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-gold-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 (123) 456-7890
              </a>
              <span className="flex items-center gap-2 text-sm text-white/60">
                <Globe className="w-4 h-4" />
                Worldwide Shipping
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact / Enquiry', href: '/enquiry' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {['Agriculture', 'Textiles', 'Minerals', 'Electronics', 'Food & Beverages', 'Handicrafts'].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      to="/products"
                      search={{ category: cat }}
                      className="text-sm text-white/60 hover:text-gold-400 transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-6">

  {/* Social Icons */}
  <div className="flex items-center justify-center gap-6">
    <a
      href="https://facebook.com/yourpage"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/60 hover:text-gold-400 transition-all duration-300 hover:scale-110"
    >
      <FaFacebookF size={38} />
    </a>

    <a
      href="https://instagram.com/yourpage"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/60 hover:text-gold-400 transition-all duration-300 hover:scale-110"
    >
      <FaInstagram size={38} />
    </a>

    <a
      href="https://wa.me/911234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/60 hover:text-gold-400 transition-all duration-300 hover:scale-110"
    >
      <FaWhatsapp size={38} />
    </a>
  </div>

  {/* Copyright */}
  <p className="text-sm text-white/40 text-center ">
    © {year} We Exports. All rights reserved.
  </p>

</div>
      </div>
    </footer>
  );
}