import { Lock, Clock, ShieldCheck, Building2, Mail, Phone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import EnquiryForm from '../components/EnquiryForm';
import { useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import  useSeo  from '../hooks/useSeo';

const features = [
  { icon: Lock,      label: 'End-to-end Encrypted Communications' },
  { icon: Clock,     label: '24-Hour Guaranteed Response Time' },
  { icon: Building2, label: 'Escrow-Compatible Transaction Logic' },
];

const contactInfo = [
  { icon: Mail,  label: 'Email Us',       value: 'wexports.support@gmail.com', href: 'mailto:wexports.support@gmail.com' },
  { icon: Phone, label: 'Call Us',        value: '+91 (9466) 3635-22',         href: 'tel:+919466363522' },
  { icon: Globe, label: 'Coverage',       value: '50+ Countries Worldwide' },
  { icon: Clock, label: 'Response Time',  value: 'Within 24 hours' },
];

export default function EnquiryPage() {

  useSeo('enquiry', {
  title:       'Product Enquiry | WExports — Get a Free Export Quote',
  description: 'Send an enquiry for Indian export products. Get pricing and shipping details within 24 hours.',
  keywords:    'export enquiry india, product quote india, buy from india, wexports contact',
  canonical:   'https://wexports.vercel.app/enquiry',
});

  const search = useSearch({ strict: false });
  const productName = (search as any).productName || '';

    useEffect(() => {
  if (productName) {
    const el = document.getElementById('enquiry-form');
    if (el) {
      const yOffset = -80; // navbar height
const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

window.scrollTo({ top: y, behavior: 'instant' });
    }
  }
}, [productName]);

  return (
    <div className="min-h-screen bg-[#eeecea]">

      {/* ════════════ NAVY HERO BANNER ════════════ */}
      <div className="bg-navy-900 text-white pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Get in Touch
            </h1>
            <p className="text-white/60 text-lg max-w-xl">
              Have a question about our products? Send us an enquiry and our team will get back to you promptly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ════════════ MAIN SECTION ════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-start">

          {/* ── LEFT: trust signals ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            {/* Badge */}
            <span className="inline-block bg-amber-500 text-amber-950 text-[10px] font-black tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm mb-8">
              Institutional Grade
            </span>

            {/* Headline */}
            <h2 className="font-display text-5xl sm:text-6xl lg:text-[60px] font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6">
              Secure Global<br />Procurement.
            </h2>

            {/* Sub */}
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mb-10">
              Direct access to vetted export suppliers from India. Every enquiry is handled via our private high-security channel to ensure price integrity and logistics confidentiality.
            </p>

            {/* Verified supplier highlight box */}
            <div className="border-l-4 border-amber-500 bg-white/70 rounded-r-xl px-6 py-5 flex items-start gap-4 mb-10 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black tracking-[0.15em] uppercase text-gray-800 mb-1">
                  Verified Supplier Network
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Your request will be routed to certified partners only, adhering to global compliance standards.
                </p>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-4 mb-10">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Contact info cards */}
            <div>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-gray-400 mb-4">
                Contact Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-semibold text-gray-800 hover:text-amber-600 transition-colors truncate block"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Form panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            {/* Decorative amber square top-right */}
            <div className="flex justify-end mb-2 pointer-events-none">
              <div className="w-16 h-16 bg-amber-400/60 rounded-sm" />
            </div>
            
            <div id="enquiry-form" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl px-7 sm:px-10 py-9">
              {/* Form header */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Enquiry Form
                </h2>
                <p className="text-sm text-gray-400 mt-1.5">
                  Fields marked <span className="text-red-500">*</span> are required · We respond within 24 hours
                </p>
              </div>

              <EnquiryForm key={productName} productName={productName} />
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mt-5 px-1">
              <span className="text-[11px] font-semibold text-gray-500 bg-white/70 border border-gray-200 px-3 py-1 rounded-full">
                ✔ No minimum enquiry
              </span>
              <span className="text-[11px] font-semibold text-gray-500 bg-white/70 border border-gray-200 px-3 py-1 rounded-full">
                🌍 50+ countries served
              </span>
              <span className="text-[11px] font-semibold text-gray-500 bg-white/70 border border-gray-200 px-3 py-1 rounded-full">
                🔒 Private &amp; secure
              </span>
            </div>
          </motion.div>

        </div>
      </div>

      <div id="enquiry-transparent-trigger" />
    </div>
  );
}