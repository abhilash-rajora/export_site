import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useSeo from '../hooks/useSeo';

const sections = [
  {
    id: 'acceptance',
    num: '01',
    title: 'Acceptance of Terms',
    content: `By accessing and using the We Exports website (wexports.vercel.app), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.`,
  },
  {
    id: 'about',
    num: '02',
    title: 'About We Exports',
    content: `We Exports is a global export company connecting quality products from India to international markets. We deal in agriculture, textiles, minerals, electronics, food & beverages, handicrafts, and other product categories.`,
  },
  {
    id: 'use',
    num: '03',
    title: 'Use of Website',
    content: `You agree to use this website only for lawful purposes. You must not use the site in any way that breaches applicable local, national, or international laws or regulations. You must not transmit any unsolicited or unauthorized advertising or promotional material.`,
  },
  {
    id: 'products',
    num: '04',
    title: 'Product Information',
    content: `We make every effort to ensure product descriptions, specifications, and pricing are accurate. However, We Exports reserves the right to correct any errors or inaccuracies and to change or update information at any time without prior notice. All products are subject to availability.`,
  },
  {
    id: 'enquiries',
    num: '05',
    title: 'Enquiries and Orders',
    content: `Submitting an enquiry through our website does not constitute a binding order or contract. All enquiries are subject to review and confirmation by our team. We reserve the right to refuse any enquiry or order at our discretion. Final pricing, minimum order quantities, and delivery terms will be confirmed separately.`,
  },
  {
    id: 'ip',
    num: '06',
    title: 'Intellectual Property',
    content: `All content on this website including text, graphics, logos, images, and software is the property of We Exports and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    id: 'privacy',
    num: '07',
    title: 'Privacy Policy',
    content: `We collect and process your personal information in accordance with our Privacy Policy. By using our website and submitting enquiries, you consent to the collection and use of your information as described. We do not sell or share your personal data with third parties for marketing purposes.`,
  },
  {
    id: 'liability',
    num: '08',
    title: 'Limitation of Liability',
    content: `We Exports shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or our services. Our total liability shall not exceed the value of the specific transaction in question. We do not guarantee uninterrupted or error-free operation of the website.`,
  },
  {
    id: 'links',
    num: '09',
    title: 'Third-Party Links',
    content: `Our website may contain links to third-party websites. These links are provided for your convenience only. We Exports has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    id: 'changes',
    num: '10',
    title: 'Changes to Terms',
    content: `We Exports reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes your acceptance of the new terms.`,
  },
  {
    id: 'law',
    num: '11',
    title: 'Governing Law',
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    id: 'contact',
    num: '12',
    title: 'Contact Us',
    content: `If you have any questions about these Terms and Conditions, please contact us at wexports.support@gmail.com. We will respond to your enquiry within 2-3 business days.`,
  },
];

// Sidebar nav items (subset for readability)
const navItems = [
  { id: 'acceptance', label: '01. Acceptance' },
  { id: 'about',      label: '02. About Us' },
  { id: 'use',        label: '03. Website Use' },
  { id: 'products',   label: '04. Products' },
  { id: 'enquiries',  label: '05. Enquiries' },
  { id: 'ip',         label: '06. Intellectual Property' },
  { id: 'privacy',    label: '07. Privacy' },
  { id: 'liability',  label: '08. Liability' },
  { id: 'links',      label: '09. Third-Party Links' },
  { id: 'changes',    label: '10. Changes' },
  { id: 'law',        label: '11. Governing Law' },
  { id: 'contact',    label: '12. Contact' },
];

export default function TermsPage() {
  useSeo('terms', {
  title:       'Terms and Conditions | WExports',
  description: 'Read WExports terms and conditions for export services, product listings and enquiry process.',
  keywords:    'wexports terms, export company terms, wexports conditions',
  canonical:   'https://wexports.vercel.app/terms',
});

  const [activeId, setActiveId] = useState('acceptance');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sectionRefs = useRef({});

  /* ── Intersection observer for active sidebar item ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ════════════ HERO ════════════ */}
      <div className="relative bg-navy-900 overflow-hidden pt-24 pb-16 sm:pb-24">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-gold-500 opacity-10 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/3 bottom-0 w-60 h-60 rounded-full bg-blue-400 opacity-5 blur-[80px]" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <span className="inline-block bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              Legal
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-5xl font-extrabold text-white tracking-tight leading-none mb-6">
              Terms &amp; <br />
              <span className="text-gold-400">Conditions</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              These terms govern your use of We Exports and outline our mutual responsibilities. Please read carefully before engaging our services.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm font-medium text-white/30">
              <span>Last updated: March 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>12 Sections</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ MOBILE SECTION NAV ════════════ */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-navy-900"
        >
          <span>Jump to section</span>
          <svg
            className={`w-4 h-4 transition-transform ${mobileNavOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileNavOpen && (
          <div className="border-t border-gray-100 max-h-64 overflow-y-auto">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeId === id
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'text-gray-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ════════════ MAIN LAYOUT ════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 lg:grid lg:grid-cols-12 lg:gap-16">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-5">Sections</p>
            <nav className="flex flex-col gap-0.5">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-left pl-4 py-2 text-sm font-medium rounded-r-lg transition-all border-l-2 ${
                    activeId === id
                      ? 'border-gold-500 text-navy-900 font-semibold bg-gold-50'
                      : 'border-transparent text-gray-500 hover:text-navy-900 hover:translate-x-1'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Help card */}
            <div className="mt-10 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-navy-900 text-sm mb-1">Have questions?</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Our team is happy to clarify any section of these terms.
              </p>
              <a
                href="mailto:wexports.support@gmail.com"
                className="text-xs font-bold text-gold-600 hover:text-gold-700 uppercase tracking-wider"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="lg:col-span-9 space-y-16">
          {/* Intro card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
          >
            <p className="text-gray-600 leading-relaxed text-lg">
              Welcome to <strong className="text-navy-900">We Exports</strong>. These Terms and Conditions outline the rules and regulations for the use of our website and services. Please read these terms carefully before using our platform. By accessing this website, you agree to comply with and be bound by the following terms.
            </p>
          </motion.div>

          {/* Sections */}
          {sections.map((section, i) => (
            <motion.article
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el; }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.45 }}
              className="scroll-mt-24"
            >
              <div className="flex items-start gap-5 mb-5">
                <span className="text-4xl font-black text-gray-100 leading-none select-none shrink-0">
                  {section.num}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight leading-tight pt-1">
                  {section.title}
                </h2>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 sm:p-9">
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {section.content}
                </p>

                {/* Special treatment for contact section */}
                {section.id === 'contact' && (
                  <a
                    href="mailto:wexports.support@gmail.com"
                    className="mt-5 inline-flex items-center gap-2 bg-navy-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors"
                  >
                    wexports.support@gmail.com
                  </a>
                )}

                {/* Highlight for liability section */}
                {section.id === 'liability' && (
                  <div className="mt-5 border-l-4 border-gold-500 bg-gold-50 rounded-r-xl px-5 py-4 text-sm text-gray-700 italic">
                    Our total liability shall not exceed the value of the specific transaction in question.
                  </div>
                )}
              </div>
            </motion.article>
          ))}

          {/* ── CTA Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-navy-900 p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8"
          >
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-gold-500 opacity-10 blur-[80px]" />
            <div className="relative z-10 text-center sm:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Ready to work together?
              </h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                Reach out to our team for enquiries, quotes, or any questions about our export services.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                to="/"
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-xl transition-colors text-sm text-center"
              >
                Send Enquiry
              </Link>
              <a
                href="mailto:wexports.support@gmail.com"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors text-sm text-center"
              >
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}