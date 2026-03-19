import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSubmitEnquiry } from '../hooks/useQueries';

interface EnquiryFormProps {
  productId?: string;
  productName?: string;
  className?: string;
}



export default function EnquiryForm({ productId, productName, className }: EnquiryFormProps) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    productName: productName ?? '',
    message: '',
  });

    useEffect(() => {
  if (productName) {
    setForm((prev) => ({
      ...prev,
      productName: productName
    }));
  }
}, [productName]);

  const submitEnquiry = useSubmitEnquiry();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      await submitEnquiry.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        productId: productId ?? null,
        productName: form.productName,
        message: form.message,
      });
      toast.success("Enquiry submitted! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', phone: '', productName: productName ?? '', message: '' });
    } catch {
      toast.error('Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium ">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" placeholder="Enter your full name"  value={form.name} onChange={handleChange} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input id="email" name="email" type="email" placeholder="Enter your business email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="WhatsApp (+country code)" value={form.phone} onChange={handleChange} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="productName" className="text-sm font-medium">Product of Interest</Label>
          <Input
            id="productName"
            name="productName"
            placeholder="e.g. spices, textiles, handicrafts..."
            value={form.productName}
            onChange={handleChange}
            readOnly={!!productId}
            className={productId ? 'bg-muted cursor-not-allowed' : ''}
          />
        </div>
      </div>
      <div className="space-y-1.5 mt-4">
        <Label htmlFor="message" className="text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your requirements, quantities needed, shipping destination..."
          value={form.message}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={submitEnquiry.isPending}
        className="mt-6 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold w-full shadow-gold "
        size="lg"
      >
        {submitEnquiry.isPending ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
        ) : (
          <><Send className="mr-2 h-4 w-4" />Send Enquiry</>
        )}
      </Button>
    </form>
  );
}