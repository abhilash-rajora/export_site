import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Loader2, Lock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const email = new URLSearchParams(window.location.search).get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      toast.success(data.message || 'Password reset successful');
      navigate({ to: '/admin/login' });
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Reset Password</h2>
            <p className="text-white/50 text-sm">Set a new password for {email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 rounded-xl text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-500 rounded-xl hover:bg-gold-400 text-navy-900 font-bold h-12 text-base shadow-gold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 w-4 h-4" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}