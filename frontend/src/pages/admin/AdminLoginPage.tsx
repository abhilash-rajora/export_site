import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, Package, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { Link } from '@tanstack/react-router';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, verifyOTP, isInitializing, token } = useAuth();

const [otp, setOtp] = useState('');
const [adminId, setAdminId] = useState<string | null>(null);
const [require2FA, setRequire2FA] = useState(false);

  // Already logged in
  if (!isInitializing && token) {
    navigate({ to: '/admin' });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (!require2FA) {
      const result = await login(email, password);

      if (result && "require2FA" in result) {
  if (result.adminId) {
    setAdminId(result.adminId);
  }
  setRequire2FA(true);
  setIsLoading(false);
  return;
}

      navigate({ to: '/admin' });
    } else {
      if (!adminId) return;

      await verifyOTP(adminId, otp);
      navigate({ to: '/admin' });
    }

  } catch {
    toast.error('Authentication failed.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
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
              <Shield className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Admin Access</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Sign in with your admin credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!require2FA ? (
  <>
    <div className="space-y-1.5">
      <Label className="text-white/70 text-sm">Email</Label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-white/10 border-white/20 rounded-xl text-white"
      />
    </div>

    <div className="space-y-1.5">
      <Label className="text-white/70 text-sm">Password</Label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="bg-white/10 border-white/20 rounded-xl text-white"
      />
    </div>
  </>
) : (
  <div className="space-y-1.5">
    <Label className="text-white/70 text-sm">Enter 6-digit OTP</Label>
    <Input
      type="text"
      maxLength={6}
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      required
      className="bg-white/10 border-white/20 rounded-xl text-white text-center tracking-widest"
    />
  </div>
)}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-500 rounded-xl hover:bg-gold-400 text-navy-900 font-bold h-12 text-base shadow-gold mt-2"
            >
              {isLoading ? (
  <>
    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
    {require2FA ? 'Verifying...' : 'Signing in...'}
  </>
) : (
  require2FA ? 'Verify OTP' : 'Sign In'
)}
            </Button>

          <div className="flex justify-between items-center mt-4 text-sm">

  <Link
    to="/admin/forgot-password"
    className="text-white/60 hover:text-white transition"
  >
    Forgot Password?
  </Link>

</div>


          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Back to Website
          </a>
        </p>
      </motion.div>
    </div>
  );
}