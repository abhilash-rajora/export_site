'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
 import { useSearchParams } from 'next/navigation';
import Link from 'next/link';


export default function AdminVerifyResetOtpPage() {
const router = useRouter();
  const [otp, setOtp]           = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpSent, setOtpSent]   = useState(false);

    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');
      toast.success(data.message || 'OTP verified');
      router.push(`/admin/reset-password?email=${email}`);
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setOtp('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
      setOtpSent(true);
      setTimeout(() => setOtpSent(false), 4000);
      toast.success('New OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Verify OTP</h2>
            <p className="text-white/50 text-sm">OTP sent to <strong className="text-white/70">{email}</strong></p>
          </div>

          {/* Resend success banner */}
          <AnimatePresence>
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-3 mb-6"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-300 text-sm font-semibold">New OTP Sent!</p>
                  <p className="text-green-400/70 text-xs mt-0.5">Check your inbox. Valid for 10 minutes.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">6-digit OTP</Label>
              <Input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
                autoFocus
                placeholder="000000"
                className="bg-white/10 border-white/20 rounded-xl text-white text-center tracking-[0.5em] text-xl placeholder:text-white/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-500 rounded-xl hover:bg-gold-400 text-navy-900 font-bold h-12 text-base shadow-gold"
            >
              {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Verifying...</> : 'Verify OTP'}
            </Button>
          </form>

          {/* Resend + back links */}
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              onClick={() => router.push('/admin/forgot-password')}
              className="text-white/40 hover:text-white/70 text-sm transition"
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm font-semibold transition disabled:opacity-50"
            >
              {isResending
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                : <><RotateCcw className="w-3.5 h-3.5" /> Resend OTP</>
              }
            </button>
          </div>
        </div>

        <p className="text-center mt-6">
          <a href="/admin/login" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Back to Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}