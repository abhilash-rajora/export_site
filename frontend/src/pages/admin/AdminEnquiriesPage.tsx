import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, ChevronDown, ChevronUp, Loader2, Mail, MessageSquare, Package, Phone, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Enquiry } from '../../api/types';
import { useAllEnquiries, useDeleteEnquiry, useMarkEnquiryRead } from '../../hooks/useQueries';

export default function AdminEnquiriesPage() {
  const { data: enquiries, isLoading } = useAllEnquiries();
  const markRead = useMarkEnquiryRead();
  const deleteEnquiry = useDeleteEnquiry();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');

  const filtered = (enquiries ?? []).filter((e) => {
    if (filter === 'new') return e.status === 'new';
    if (filter === 'read') return e.status !== 'new';
    return true;
  });

  const newCount = (enquiries ?? []).filter((e) => e.status === 'new').length;

  const handleMarkRead = async (enquiry: Enquiry) => {
    if (enquiry.status !== 'new') return;
    try {
      await markRead.mutateAsync(enquiry._id);
      toast.success('Marked as read.');
    } catch {
      toast.error('Failed to mark as read.');
    }
  };

  const handleDelete = async (enquiry: Enquiry) => {
    try {
      await deleteEnquiry.mutateAsync(enquiry._id);
      toast.success('Enquiry deleted.');
      if (expanded === enquiry._id) setExpanded(null);
    } catch {
      toast.error('Failed to delete enquiry.');
    }
  };

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-sidebar-foreground tracking-tight">Enquiries</h1>
          <p className="text-sidebar-foreground/50 mt-1">
            {newCount > 0 ? `${newCount} new enquir${newCount === 1 ? 'y' : 'ies'} awaiting review` : 'All enquiries reviewed'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'new', 'read'] as const).map((f) => (
          <button type="button" key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === f ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-white/5 text-sidebar-foreground/60 border-sidebar-border hover:border-sidebar-foreground/30'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'new' && newCount > 0 && (
              <span className="ml-1.5 bg-navy-800 text-gold-400 text-xs px-1.5 py-0.5 rounded-full">{newCount}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl bg-white/5" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white/5 rounded-xl border border-sidebar-border">
          <MessageSquare className="w-10 h-10 text-sidebar-foreground/20 mx-auto mb-3" />
          <p className="text-sidebar-foreground/50 font-medium">
            {filter === 'new' ? 'No new enquiries.' : filter === 'read' ? 'No read enquiries.' : 'No enquiries yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((enquiry, i) => {
            const isExpanded = expanded === enquiry._id;
            const isNew = enquiry.status === 'new';
            return (
              <motion.div key={enquiry._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`rounded-xl border overflow-hidden transition-all ${isNew ? 'border-gold-500/40 bg-gold-500/5' : 'border-sidebar-border bg-white/5'}`}>
                <button type="button" onClick={() => setExpanded(isExpanded ? null : enquiry._id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isNew ? 'bg-gold-500/20' : 'bg-sidebar-accent'}`}>
                    <span className={`text-sm font-bold ${isNew ? 'text-gold-400' : 'text-sidebar-foreground'}`}>{enquiry.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sidebar-foreground text-sm">{enquiry.name}</span>
                      {isNew && <Badge className="text-[10px] py-0 px-1.5 bg-gold-500/20 text-gold-400 border-gold-500/30">New</Badge>}
                    </div>
                    <p className="text-sidebar-foreground/50 text-xs truncate">{enquiry.productName || 'General enquiry'} • {enquiry.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-sidebar-foreground/30 hidden sm:block">{formatDate(enquiry.createdAt)}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-sidebar-foreground/40" /> : <ChevronDown className="w-4 h-4 text-sidebar-foreground/40" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="border-t border-sidebar-border px-6 py-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                            <Mail className="w-4 h-4 text-sidebar-foreground/40" />
                            <a href={`mailto:${enquiry.email}`} className="hover:text-gold-400 transition-colors">{enquiry.email}</a>
                          </div>
                          {enquiry.phone && (
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                              <Phone className="w-4 h-4 text-sidebar-foreground/40" />
                              <a href={`tel:${enquiry.phone}`} className="hover:text-gold-400 transition-colors">{enquiry.phone}</a>
                            </div>
                          )}
                          {enquiry.productName && (
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                              <Package className="w-4 h-4 text-sidebar-foreground/40" />
                              <span>{enquiry.productName}</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-sidebar-accent rounded-lg p-4 mb-5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-2">Message</p>
                          <p className="text-sidebar-foreground text-sm leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {isNew && (
                            <Button size="sm" onClick={() => handleMarkRead(enquiry)} disabled={markRead.isPending}
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30" variant="ghost">
                              {markRead.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                              Mark as Read
                            </Button>
                          )}
                          <a href={`mailto:${enquiry.email}?subject=Re: Your Enquiry about ${enquiry.productName}`}>
                            <Button size="sm" variant="ghost" className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/10 border border-sidebar-border">
                              <Mail className="w-3.5 h-3.5 mr-1.5" />Reply via Email
                            </Button>
                          </a>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 ml-auto">
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
                                <AlertDialogDescription>Delete the enquiry from {enquiry.name}? This cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(enquiry)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
      {!isLoading && (
        <p className="text-sidebar-foreground/30 text-xs mt-4">{filtered.length} enquir{filtered.length !== 1 ? 'ies' : 'y'}</p>
      )}
    </div>
  );
}