import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using the We Exports website (wexports.vercel.app), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.`,
  },
  {
    title: '2. About We Exports',
    content: `We Exports is a global export company connecting quality products from India to international markets. We deal in agriculture, textiles, minerals, electronics, food & beverages, handicrafts, and other product categories.`,
  },
  {
    title: '3. Use of Website',
    content: `You agree to use this website only for lawful purposes. You must not use the site in any way that breaches applicable local, national, or international laws or regulations. You must not transmit any unsolicited or unauthorized advertising or promotional material.`,
  },
  {
    title: '4. Product Information',
    content: `We make every effort to ensure product descriptions, specifications, and pricing are accurate. However, We Exports reserves the right to correct any errors or inaccuracies and to change or update information at any time without prior notice. All products are subject to availability.`,
  },
  {
    title: '5. Enquiries and Orders',
    content: `Submitting an enquiry through our website does not constitute a binding order or contract. All enquiries are subject to review and confirmation by our team. We reserve the right to refuse any enquiry or order at our discretion. Final pricing, minimum order quantities, and delivery terms will be confirmed separately.`,
  },
  {
    title: '6. Intellectual Property',
    content: `All content on this website including text, graphics, logos, images, and software is the property of We Exports and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: '7. Privacy Policy',
    content: `We collect and process your personal information in accordance with our Privacy Policy. By using our website and submitting enquiries, you consent to the collection and use of your information as described. We do not sell or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `We Exports shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or our services. Our total liability shall not exceed the value of the specific transaction in question. We do not guarantee uninterrupted or error-free operation of the website.`,
  },
  {
    title: '9. Third-Party Links',
    content: `Our website may contain links to third-party websites. These links are provided for your convenience only. We Exports has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We Exports reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes your acceptance of the new terms.`,
  },
  {
    title: '11. Governing Law',
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    title: '12. Contact Us',
    content: `If you have any questions about these Terms and Conditions, please contact us at wexports.support@gmail.com. We will respond to your enquiry within 2-3 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-white/50 mt-1 text-sm">Last updated: March 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">
            Welcome to We Exports. These Terms and Conditions outline the rules and regulations for the use of our website and services. Please read these terms carefully before using our platform. By accessing this website, you agree to comply with and be bound by the following terms.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
            >
              <h2 className="font-display font-bold text-lg text-navy-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 bg-gold-50 border border-gold-200 rounded-2xl p-6 text-center">
          <p className="text-gray-700 text-sm">
            For any questions regarding these terms, contact us at{' '}
            <a href="mailto:wexports.support@gmail.com" className="text-gold-600 font-semibold hover:text-gold-700">
              wexports.support@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}