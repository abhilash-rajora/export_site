import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Bell, Eye, MessageSquare, Package, TrendingUp } from 'lucide-react';
import { motion } from "framer-motion"
import { useDashboardStats } from '../../hooks/useQueries';
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { role } = useAuth();

  const [qrCode, setQrCode] = useState<string | null>(null);
const [manualKey, setManualKey] = useState<string | null>(null);
const [otp, setOtp] = useState("");
const [is2FAEnabled, setIs2FAEnabled] = useState(false);

// Fetch current 2FA status
useEffect(() => {
  api.get("/admin/verify")
    .then((res) => {
      // assuming backend returns admin info
      setIs2FAEnabled(res.data.twoFactorEnabled ?? false);
    })
    .catch(() => {});
}, []);

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', href: '/admin/products' },
    { label: 'Total Enquiries', value: stats?.totalEnquiries ?? 0, icon: MessageSquare, color: 'text-teal-400', bg: 'bg-teal-500/10', href: '/admin/enquiries' },
    { label: 'New Enquiries', value: stats?.newEnquiries ?? 0, icon: Bell, color: 'text-gold-400', bg: 'bg-gold-500/10', href: '/admin/enquiries' },
    { label: 'Active Rate', value: stats?.activeRate ? `${stats.activeRate}%` : '0%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', href: '/admin/products' }
  ];

  const formatDate = (ts: string) =>
  new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const generate2FA = async () => {
  try {
    const { data } = await api.post("/admin/2fa/generate");
    setQrCode(data.qrCode);
    setManualKey(data.manualKey);
  } catch {
    toast.error("Failed to generate QR");
  }
};

const verify2FA = async () => {
  try {
    await api.post("/admin/2fa/verify", { token: otp });
    toast.success("2FA Enabled!");
    setIs2FAEnabled(true);
    setQrCode(null);
    setOtp("");
  } catch {
    toast.error("Invalid OTP");
  }
};

const disable2FA = async () => {
  try {
    await api.post("/admin/2fa/disable");
    toast.success("2FA Disabled");
    setIs2FAEnabled(false);
  } catch {
    toast.error("Failed to disable");
  }
};

  return (
    <div >
      <div className="mb-8" >
        
        <h1 className="font-display text-3xl font-extrabold text-sidebar-foreground tracking-tight">Dashboard</h1>
        <p className="text-sidebar-foreground/50 mt-1">Overview of your export business</p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={card.href}>
              <div className="stat-card rounded-xl p-6 border border-sidebar-border hover:border-gold-500/40 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-sidebar-foreground/20 group-hover:text-sidebar-foreground/50 group-hover:translate-x-0.5 transition-all" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mb-1 bg-white/10" />
                ) : (
                  <div className="font-display text-3xl font-extrabold text-sidebar-foreground">{card.value}</div>
                )}
                <p className="text-sidebar-foreground/50 text-sm mt-1">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white/5 rounded-xl border border-sidebar-border overflow-hidden">
          <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
            <h2 className="font-display font-bold text-sidebar-foreground">Recent Enquiries</h2>
            <Link to="/admin/enquiries">
              <Button variant="ghost" size="sm" className="text-gold-400 hover:text-gold-300 hover:bg-white/5 text-xs">
                View All <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg bg-white/5" />
              ))}
            </div>
          ) : !stats || !stats.recentEnquiries?.length ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-sidebar-foreground/20 mx-auto mb-2" />
              <p className="text-sidebar-foreground/40 text-sm">No enquiries yet</p>
            </div>
          ) : (
            <div className="divide-y divide-sidebar-border">
              {stats?.recentEnquiries?.map((enquiry) => (
                <Link key={enquiry._id} to="/admin/enquiries" className="flex items-start gap-3 p-4 hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-sidebar-foreground">{enquiry.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-sidebar-foreground truncate">{enquiry.name}</p>
                      {enquiry.status === 'new' && (
                        <Badge className="text-[10px] py-0 px-1.5 bg-gold-500/20 text-gold-400 border-gold-500/30">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-sidebar-foreground/50 truncate">{enquiry.productName || 'General enquiry'}</p>
                  </div>
                  <span className="text-[11px] text-sidebar-foreground/30 flex-shrink-0">{formatDate(enquiry.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 rounded-xl border border-sidebar-border p-6">
          <h2 className="font-display font-bold text-sidebar-foreground mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/admin/products/new', icon: Package, bg: 'bg-blue-500/10', ic: 'text-blue-400', title: 'Add New Product', sub: 'Create a new product listing' },
              { to: '/admin/enquiries', icon: Eye, bg: 'bg-teal-500/10', ic: 'text-teal-400', title: 'Review Enquiries', sub: stats && stats.newEnquiries ? `${stats.newEnquiries} new enquiries awaiting review` : 'View all customer enquiries' },
              { to: '/admin/products', icon: TrendingUp, bg: 'bg-purple-500/10', ic: 'text-purple-400', title: 'Manage Products', sub: 'Edit, activate, or remove products' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="block">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-sidebar-border hover:border-gold-500/40 hover:bg-white/5 transition-all group cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.ic}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sidebar-foreground text-sm">{item.title}</p>
                    <p className="text-sidebar-foreground/40 text-xs">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-sidebar-foreground/20 ml-auto group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
      

      {/* 🔐 Security Section */}
      <div className="mt-10 bg-white/5 rounded-xl border border-sidebar-border p-6">
        <h2 className="font-display font-bold text-sidebar-foreground mb-4">
          Security Settings
        </h2>

        {!is2FAEnabled ? (
          <>
            {!qrCode ? (
              <Button onClick={generate2FA}>
                Enable Two-Factor Authentication
              </Button>
            ) : (
              <div className="space-y-4">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                <p className="text-xs text-sidebar-foreground/50">
                  Manual Key: {manualKey}
                </p>

                <div className="space-y-2">
                  <Label>Enter OTP from Google Authenticator</Label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-40"
                  />
                </div>

                <Button onClick={verify2FA}>
                  Verify & Enable
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-green-400 font-semibold">
              Two-Factor Authentication is Enabled
            </p>
            <Button variant="destructive" onClick={disable2FA}>
              Disable 2FA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}