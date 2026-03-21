import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSubmitEnquiry } from '../hooks/useQueries';

interface EnquiryFormProps {
  productId?: string;
  productName?: string;
  className?: string;
  glass?: boolean;
}

export default function EnquiryForm({ productId, productName, className }: EnquiryFormProps) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    productName: productName ?? '', message: '',
  });

  useEffect(() => {
    if (productName) setForm(p => ({ ...p, productName }));
  }, [productName]);

  const submitEnquiry = useSubmitEnquiry();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      await submitEnquiry.mutateAsync({
        name: form.name, email: form.email, phone: form.phone,
        productId: productId ?? null,
        productName: form.productName, message: form.message,
      });
      toast.success("Enquiry submitted! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', phone: '', productName: productName ?? '', message: '' });
    } catch {
      toast.error('Failed to submit enquiry. Please try again.');
    }
  };

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all';

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name <span className="text-red-500">*</span></label>
          <input id="name" name="name" type="text" placeholder="Enter your full name"
            value={form.name} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email Address <span className="text-red-500">*</span></label>
          <input id="email" name="email" type="email" placeholder="Your business email"
            value={form.email} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone Number</label>
          <input id="phone" name="phone" type="tel" placeholder="WhatsApp (+country code)"
            value={form.phone} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="productName" className={labelClass}>Product of Interest</label>
          <input id="productName" name="productName" type="text" placeholder="e.g. spices, textiles..."
            value={form.productName} onChange={handleChange} readOnly={!!productId}
            className={`${inputClass} ${productId ? 'bg-gray-50 cursor-not-allowed' : ''}`} />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="message" className={labelClass}>Message <span className="text-red-500">*</span></label>
        <textarea id="message" name="message" rows={5} required
          placeholder="Tell us about your requirements, quantities needed, shipping destination..."
          value={form.message} onChange={handleChange}
          className={`${inputClass} resize-none`} />
      </div>
      <Button type="submit" disabled={submitEnquiry.isPending}
        className="mt-6 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold w-full shadow-gold" size="lg">
        {submitEnquiry.isPending
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
          : <><Send className="mr-2 h-4 w-4" />Send Enquiry</>}
      </Button>
    </form>
  );
}