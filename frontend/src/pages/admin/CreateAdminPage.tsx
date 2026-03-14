import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, Package, Shield ,Eye, EyeOff} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import api from "../../api/axios";

export default function CreateAdminPage() {
  const navigate = useNavigate();

  const [name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminType, setAdminType] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [passwordError, setPasswordError] = useState("");


const validatePasswords = () => {
  if (password !== confirmPassword) {
    setPasswordError("Passwords do not match");
    return false;
  }

  setPasswordError("");
  return true;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // API call
      const token = localStorage.getItem("adminToken");
      await api.post("/admin/create",  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
                    "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({
        name: name,
        email,
        password,
        role: adminType
        }),
      });

      toast.success("Admin created successfully");
      navigate({ to: '/admin/login' });

    } catch {
      toast.error("Failed to create admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Package className="w-8 h-8 text-navy-900" />
          </div>

          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            WeExports
          </h1>

          <p className="text-white/50 mt-1 text-sm">
            Admin Registration
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-gold-400" />
            </div>

            <h2 className="font-display font-bold text-xl text-white mb-2">
              Create Admin
            </h2>

            <p className="text-white/50 text-sm">
              Register a new administrator account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Full Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/10 border-white/20 rounded-xl text-white"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
            <Label className="text-white/70 text-sm">Create Password</Label>
            <div className="relative">
                <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 rounded-xl text-white pr-10"
                />

                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
            <Label className="text-white/70 text-sm">Confirm Password</Label>

            <div className="relative">
                <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`bg-white/10 border-white/20 rounded-xl text-white pr-10 ${
                    passwordError ? "border-red-500" : ""
                }`}
                />

                <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                >
                {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>

            {passwordError && (
                <p className="text-red-400 text-xs">{passwordError}</p>
            )}
            </div>

            {/* Admin Type */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Admin Type</Label>

              <div className="flex gap-6 text-white">

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="radio"
                    value="superadmin"
                    checked={adminType === "superadmin"}
                    onChange={(e) => setAdminType(e.target.value)}
                    />
                    Super Admin
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="radio"
                    value="editor"
                    checked={adminType === "editor"}
                    onChange={(e) => setAdminType(e.target.value)}
                    />
                    Basic Admin
                </label>

                </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-500 rounded-xl hover:bg-gold-400 text-navy-900 font-bold h-12 text-base shadow-gold mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Creating Admin...
                </>
              ) : (
                "Create Admin"
              )}
            </Button>

          </form>
        </div>

        <p className="text-center mt-6">
          <a
            href="/admin/login"
            className="text-white/40 text-sm hover:text-white/70 transition-colors"
          >
            ← Back to Admin Login
          </a>
        </p>

      </motion.div>
    </div>
  );
}