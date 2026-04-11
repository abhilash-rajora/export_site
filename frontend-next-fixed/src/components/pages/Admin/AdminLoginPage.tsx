'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Package, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, verifyOTP, isInitializing, token } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [adminId, setAdminId] = useState<string | null>(null);
  const [require2FA, setRequire2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  if (!isInitializing && token) {
    router.push('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!require2FA) {
        const result = await login(email, password);
        if (result && "require2FA" in result) {
          if (result.adminId) setAdminId(result.adminId);
          setRequire2FA(true);
          setOtpSent(true);
        } else {
          router.push('/admin');
        }
      } else {
        if (!adminId) return;
        await verifyOTP(adminId, otp);
        router.push('/admin');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtp('');
    try {
      const result = await login(email, password);
      if (result?.adminId) setAdminId(result.adminId);
      setOtpSent(true);
      toast.success('New OTP sent to your email!');
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Package className="w-8 h-8 text-navy-900" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">WeExports</h1>
          <p className="text-white/50 mt-1 text-sm">Admin Portal</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              {require2FA ? <Mail className="w-6 h-6 text-gold-400" /> : <Shield className="w-6 h-6 text-gold-400" />}
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">{require2FA ? 'Check Your Email' : 'Admin Access'}</h2>
            <p className="text-white/50 text-sm">{require2FA ? `OTP sent to ${email}` : 'Sign in with your admin credentials.'}</p>
          </div>
          <AnimatePresence>
            {otpSent && require2FA && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-3 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-300 text-sm font-semibold">OTP Sent Successfully!</p>
                  <p className="text-green-400/70 text-xs mt-0.5">Check your email inbox. Valid for 10 minutes.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!require2FA ? (
              <>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" className="bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Password</Label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/30" />
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-white/70 text-sm">6-digit OTP</Label>
                <Input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required placeholder="000000" className="bg-white/10 border-white/20 rounded-xl text-white text-center tracking-[0.5em] text-xl placeholder:text-white/20" autoFocus />
              </div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full bg-gold-500 rounded-xl hover:bg-gold-400 text-navy-900 font-bold h-12 text-base shadow-gold mt-2">
              {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />{require2FA ? 'Verifying...' : 'Sending OTP...'}</> : require2FA ? 'Verify OTP' : 'Send OTP'}
            </Button>
          </form>
          <div className="flex items-center justify-between mt-5 text-sm">
            {!require2FA ? (
              <Link href="/admin/forgot-password" className="text-white/50 hover:text-white transition">Forgot Password?</Link>
            ) : (
              <div className="flex items-center justify-between w-full">
                <button type="button" onClick={() => { setRequire2FA(false); setOtpSent(false); setOtp(''); }} className="text-white/50 hover:text-white transition text-sm">← Change credentials</button>
                <button type="button" onClick={handleResendOtp} disabled={isLoading} className="text-gold-400 hover:text-gold-300 transition text-sm font-semibold">Resend OTP</button>
              </div>
            )}
          </div>
        </div>
        <p className="text-center mt-6">
          <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">← Back to Website</Link>
        </p>
      </motion.div>
    </div>
  );
}