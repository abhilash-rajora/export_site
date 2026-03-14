import { Clock, Globe, Mail, Phone } from 'lucide-react';
import { motion } from "framer-motion";
import EnquiryForm from '../components/EnquiryForm';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'wexports@gmail.com', href: 'mailto:wexports@gmail.com' },
  { icon: Phone, label: 'Call Us', value: '+91 (9466) 3635-22', href: 'tel:+919466363522' },
  { icon: Globe, label: 'Coverage', value: '50+ Countries Worldwide' },
  { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
];

export default function EnquiryPage() {
  return (
    <div className="min-h-screen bg-slate-200">
      <div className="bg-navy-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Get in Touch</h1>
            <p className="text-white/60 text-lg max-w-xl">Have a question about our products? Send us an enquiry and our team will get back to you promptly.</p>
          </motion.div>
        </div>
      </div>

      <div id="enquiry-solid-trigger" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Contact Information</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">Our export specialists are here to help you find the right products.</p>
            </div>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-muted/50 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-foreground font-medium hover:text-gold-600 transition-colors">{info.value}</a>
                    ) : (
                      <p className="text-foreground font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 lg:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Send Your Enquiry</h2>
                <p className="text-muted-foreground text-sm">All fields marked with * are required.</p>
              </div>
              <EnquiryForm />
            </div>
          </motion.div>
        </div>
      </div>
      <div id="enquiry-transparent-trigger" />
    </div>
  );
}