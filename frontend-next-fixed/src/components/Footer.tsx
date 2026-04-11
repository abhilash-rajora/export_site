import Link from 'next/link';
import { Globe, Mail, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const footerCategories = [
  { label: 'Agriculture',      slug: 'agriculture' },
  { label: 'Textiles',         slug: 'textiles' },
  { label: 'Minerals',         slug: 'minerals' },
  { label: 'Electronics',      slug: 'electronics' },
  { label: 'Food & Beverages', slug: 'food-beverages' },
  { label: 'Handicrafts',      slug: 'handicrafts' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer-section" className="bg-navy-900 text-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center group">
              <span className="font-display text-2xl md:text-xl font-extrabold tracking-tight">
                <span className="text-white transition-colors duration-300 group-hover:text-gold-400">We</span>
                <span className="text-gold-400 transition-colors duration-300 group-hover:text-white">Exports</span>
              </span>
            </Link>
            <p className="text-xs text-green-400 mt-3 font-medium">✔ Trusted by global buyers  • 50+ countries served</p>
            <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xs">
              Your trusted export partner connecting quality products from across the world to international markets.
            </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:wexports.support@gmail.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-200">
                <Mail className="w-4 h-4" /> wexports.support@gmail.com
              </a>
              <a href="tel:+919466363522" className="flex items-center gap-2 text-sm text-white/60 hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-200">
                <Phone className="w-4 h-4" /> +91 (946) 636-3522
              </a>
              <span className="flex items-center gap-2 text-sm text-white/60">
                <Globe className="w-4 h-4" /> Worldwide Shipping
              </span>
            </div>
          </div>

          {/* Quick Links + Categories — side by side on mobile too */}
          <div className="grid grid-cols-2 md:contents gap-10">

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Home',              href: '/' },
                  { label: 'Products',          href: '/products' },
                  { label: 'Blog',              href: '/blog' },
                  { label: 'About Us',          href: '/about' },
                  { label: 'Contact / Enquiry', href: '/enquiry' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/60 hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/terms" className="text-sm text-white/60 hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-200">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4">Categories</h3>
              <ul className="space-y-2">
                {footerCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href="/products/$category" params={{ category: cat.slug }}
                      className="text-sm text-white/60 hover:text-gold-400 hover:translate-x-1 inline-block transition-colors duration-200">
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-6">
            <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold-500/20 text-white/60 hover:text-gold-400 transition-all duration-300 hover:scale-110">
              <FaFacebookF size={25} />
            </a>
            <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold-500/20 text-white/60 hover:text-gold-400 transition-all duration-300 hover:scale-110">
              <FaInstagram size={25} />
            </a>
            <a href="https://wa.me/919466363522" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold-500/20 text-white/60 hover:text-gold-400 transition-all duration-300 hover:scale-110">
              <FaWhatsapp size={25} />
            </a>
          </div>
          <p className="text-sm text-white/40 text-center">© {year} We Exports. All rights reserved.</p>
          <p className="text-xs text-white/30 text-center">Connecting global markets with trusted exports</p>
        </div>
      </div>
    </footer>
  );
}