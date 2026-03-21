// frontend/src/pages/BlogDetailPage.tsx
// Full featured — slider, TOC, likes, comments, ad boxes, sticky sidebar

import { Link, useParams } from '@tanstack/react-router';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Tag, ChevronLeft, Share2, Facebook, Linkedin,
  ArrowRight, BookOpen, Eye, User, Heart,
  ChevronRight, ChevronDown
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useBlogBySlug, usePublishedBlogs, Blog } from '../hooks/useBlogs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import useSeo from '../hooks/useSeo';
import { useEffect, useRef, useState, useCallback } from 'react';
import api from '../api/axios';
import { toast } from 'sonner';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div style={{ scaleX, transformOrigin: '0%' }} className="fixed top-0 left-0 right-0 h-1 bg-gold-500 z-[100]" />;
}

function MediaSlider({ images, videoUrl, heading }: { images: string[]; videoUrl?: string; heading?: string }) {
  const all = [...(images ?? []), ...(videoUrl ? [videoUrl] : [])];
  const [active, setActive] = useState(0);
  if (all.length === 0) return null;
  const isVid = (s: string) => s.includes('youtube') || s.includes('youtu.be') || s.endsWith('.mp4') || s.endsWith('.webm');
  const embed = (u: string) => u.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
  return (
    <div className="mt-6 rounded-2xl overflow-hidden shadow-lg bg-black">
      <div className="relative aspect-video">
        {isVid(all[active]) ? (
          all[active].includes('youtube') || all[active].includes('youtu.be')
            ? <iframe src={embed(all[active])} className="w-full h-full" allowFullScreen title={heading} />
            : <video controls className="w-full h-full bg-black"><source src={all[active]} /></video>
        ) : <img src={all[active]} alt="" className="w-full h-full object-cover" />}
        {all.length > 1 && <>
          <button onClick={() => setActive(p => (p - 1 + all.length) % all.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setActive(p => (p + 1) % all.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {all.map((_, i) => <button key={i} onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${i === active ? 'bg-gold-500 w-5' : 'bg-white/50 w-2'}`} />)}
          </div>
        </>}
      </div>
      {all.length > 1 && (
        <div className="flex gap-2 p-3 bg-black/80 overflow-x-auto">
          {all.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === active ? 'border-gold-500' : 'border-white/20 opacity-60 hover:opacity-100'}`}>
              {isVid(src) ? <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white/60 text-xs">▶</div>
                : <img src={src} alt="" className="w-full h-full object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionContent({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      {content.split('\n').filter(l => l.trim()).map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="font-display text-xl font-bold text-navy-900 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## '))  return <h2 key={i} className="font-display text-2xl font-extrabold text-navy-900 mt-8 mb-3">{line.replace('## ', '')}</h2>;
        if (line.startsWith('- '))   return <div key={i} className="flex items-start gap-3"><span className="text-gold-500 font-bold mt-1 flex-shrink-0">•</span><span className="text-gray-600 leading-relaxed">{line.replace('- ', '')}</span></div>;
        return <p key={i} className="text-gray-600 leading-relaxed text-lg">{line}</p>;
      })}
    </div>
  );
}

function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const share = (p: string) => {
    const enc = encodeURIComponent(url);
    const links: Record<string,string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
    };
    window.open(links[p], '_blank');
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold text-gray-500 mr-1">Share:</span>
      <button onClick={() => share('whatsapp')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors"><FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp</button>
      <button onClick={() => share('linkedin')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</button>
      <button onClick={() => share('facebook')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"><Facebook className="w-3.5 h-3.5" /> Facebook</button>
      <button onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-semibold transition-colors">
        <Share2 className="w-3.5 h-3.5" /> {copied ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  );
}

function LikeButton({ blogId }: { blogId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    api.get(`/comments/like/${blogId}`).then(r => { setLiked(r.data.liked); setCount(r.data.count); }).catch(() => {});
  }, [blogId]);
  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const r = await api.post(`/comments/like/${blogId}`);
      setLiked(r.data.liked); setCount(r.data.count);
      if (r.data.liked) { setBurst(true); setTimeout(() => setBurst(false), 600); }
    } catch { toast.error('Could not process like'); }
    finally { setLoading(false); }
  };
  return (
    <motion.button whileTap={{ scale: 0.85 }} onClick={toggle} disabled={loading}
      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all border ${liked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-400'}`}>
      <AnimatePresence mode="wait">
        <motion.span key={liked ? 'liked' : 'not'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </motion.span>
      </AnimatePresence>
      {count > 0 ? `${count} ${liked ? 'Liked' : 'Likes'}` : 'Like'}
      <AnimatePresence>
        {burst && [...Array(6)].map((_, i) => (
          <motion.span key={i} initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ scale: 1, x: (Math.random()-0.5)*40, y: (Math.random()-0.5)*40, opacity: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute text-rose-400 text-xs pointer-events-none" style={{ left:'50%', top:'50%' }}>❤</motion.span>
        ))}
      </AnimatePresence>
    </motion.button>
  );
}


// ── Mobile TOC — sticky dropdown at top, hidden on desktop ───────
function MobileTOC({ sections }: { sections: { heading?: string }[] }) {
  const headings = sections.filter(s => s.heading?.trim());
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;
  return (
    <div className="lg:hidden sticky top-16 z-30 mb-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 backdrop-blur-md bg-white/70 border border-gold-200 rounded-xl text-sm font-semibold text-navy-900 shadow-sm"
      >
        <span className="flex items-center gap-2">📋 Table of Contents</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gold-600" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gold-200 rounded-xl shadow-xl z-40 p-3"
          >
            <ol className="space-y-1">
              {headings.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm text-navy-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                  >
                    <span className="text-gold-500 font-bold flex-shrink-0">{i + 1}.</span>
                    <span className="leading-snug">{s.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function StickyTOC({ sections }: { sections: { heading?: string }[] }) {
  const headings = sections.filter(s => s.heading?.trim());
  if (headings.length === 0) return null;
  return (
    <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
      <h3 className="font-display font-bold text-navy-900 text-sm uppercase tracking-widest mb-4">
        📋 Table of Contents
      </h3>
      <ol className="space-y-2">
        {headings.map((s, i) => (
          <li key={i}>
            <a href={`#section-${i}`}
              className="flex items-start gap-2 text-sm text-navy-700 hover:text-gold-600 transition-colors">
              <span className="text-gold-500 font-bold flex-shrink-0">{i + 1}.</span>
              <span className="leading-snug">{s.heading}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function BlogDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { data, isLoading, isError } = useBlogBySlug(slug ?? '');
  const blog = data?.blog;
  const related = data?.related ?? [];
  const { data: recentData } = usePublishedBlogs({ sort: 'latest' });
  const recentPosts = recentData?.blogs?.filter(b => b.slug !== slug).slice(0, 4) ?? [];

  useSeo('blog-detail', {
    title: blog ? `${blog.title} | WExports Blog` : 'Blog | WExports',
    description: blog?.excerpt ?? 'Read export insights from WExports.',
    keywords: blog?.tags?.join(', ') ?? 'export blog, wexports',
    canonical: `https://wexports.vercel.app/blog/${slug}`,
    ogImage: blog?.coverImage ?? '',
  });

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <div className="h-1 bg-gold-500/30 animate-pulse" />
      <div className="bg-navy-900 pt-24 pb-10"><div className="container mx-auto px-4 max-w-6xl"><Skeleton className="h-12 w-3/4 bg-white/10 mb-4" /></div></div>
      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-4"><Skeleton className="h-96 rounded-2xl" />{[...Array(5)].map((_,i) => <Skeleton key={i} className="h-5" />)}</div>
    </div>
  );

  if (isError || !blog) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center"><BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" /><h2 className="font-display font-bold text-2xl text-navy-900 mb-4">Article not found</h2><Link to="/blog" className="text-gold-600 font-semibold hover:underline">← Back to Blog</Link></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgressBar />

      {/* Hero */}
      <div className="bg-navy-900 pt-24 pb-0 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold-500 opacity-10 blur-[120px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pb-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"><ChevronLeft className="w-4 h-4" /> Back to Blog</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-gold-500 text-navy-900 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">{blog.category}</span>
              <span className="text-white/40 text-sm flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{blog.readTime} min read</span>
              <span className="text-white/40 text-sm flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(blog.publishedAt)}</span>
              <span className="text-white/40 text-sm flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{blog.views} views</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">{blog.title}</h1>
            {blog.excerpt && <p className="text-white/60 text-xl leading-relaxed max-w-2xl mb-4">{blog.excerpt}</p>}
            <div className="flex items-center gap-2 text-white/50 text-sm"><User className="w-4 h-4" /><span>By <strong className="text-white/80">{blog.author}</strong></span></div>
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {blog.tags.map(tag => <span key={tag} className="flex items-center gap-1 text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full"><Tag className="w-3 h-3" />{tag}</span>)}
              </div>
            )}
          </motion.div>
        </div>
        {blog.coverImage && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-t-3xl overflow-hidden h-72 sm:h-[420px]">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Content + Sidebar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 lg:py-12">

        {/* Mobile TOC — sticky dropdown, lg pe hidden */}
        <MobileTOC sections={blog.sections ?? []} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-4 lg:mt-0">

          {/* Main */}
          <div className="lg:col-span-8 min-w-0">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <ShareButtons url={pageUrl} title={blog.title} />
            </div>

            {/* Sections */}
            <div className="space-y-10 lg:space-y-12">
              {blog.sections?.map((section, i) => (
                <motion.div key={i} id={`section-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
                  {section.heading && <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy-900 mb-4 pb-3 border-b-2 border-gold-500/30">{section.heading}</h2>}
                  {section.content && <SectionContent content={section.content} />}
                  {((section.images?.length ?? 0) > 0 || section.videoUrl) && (
                    <MediaSlider images={section.images ?? []} videoUrl={section.videoUrl} heading={section.heading} />
                  )}
                </motion.div>
              ))}
            </div>

            {blog.tags?.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-gray-400 mr-2">Tags:</span>
                {blog.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{tag}</span>)}
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <LikeButton blogId={blog._id} />
              <ShareButtons url={pageUrl} title={blog.title} />
            </div>

            <div className="mt-8 p-5 sm:p-6 bg-navy-900 rounded-2xl">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">Ready to Export?</p>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-2">Get a Free Export Quote</h3>
              <p className="text-white/50 text-sm mb-4">Contact our team — we respond within 24 hours.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/enquiry"><Button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold">Get Quote in 24hrs</Button></Link>
                <Link to="/products"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Browse Products</Button></Link>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar — desktop only */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-5">

              {/* TOC — desktop sidebar */}
              <StickyTOC sections={blog.sections ?? []} />

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-display font-bold text-navy-900 text-xs uppercase tracking-widest mb-3">Categories</h3>
                <div className="space-y-0.5">
                  {['Export Tips','Industry News','Trade Insights','Product Spotlight','Company Updates','Market Trends'].map(cat => (
                    <Link key={cat} to="/blog" search={{ category: cat } as any}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gold-50 hover:text-gold-700 transition-colors group">
                      <span>{cat}</span><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
              {recentPosts.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <h3 className="font-display font-bold text-navy-900 text-xs uppercase tracking-widest mb-3">Recent Posts</h3>
                  <div className="space-y-3">
                    {recentPosts.map(post => (
                      <Link key={post._id} to="/blog/$slug" params={{ slug: post.slug }} className="flex gap-3 group">
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-navy-900">
                          {post.coverImage ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-gold-400/40" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-navy-900 text-xs line-clamp-2 group-hover:text-gold-600 transition-colors leading-snug">{post.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-1">{formatDate(post.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-gold-500 rounded-2xl p-4 text-navy-900">
                <h3 className="font-display font-bold text-base mb-1">Need Export Help?</h3>
                <p className="text-navy-900/70 text-xs mb-3">Our experts respond within 24 hours.</p>
                <Link to="/enquiry"><Button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm">Contact Us Now →</Button></Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(b => (
                <Link key={b._id} to="/blog/$slug" params={{ slug: b.slug }}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                    {b.coverImage && <div className="h-40 overflow-hidden"><img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                    <div className="p-5">
                      <span className="text-xs text-gold-600 font-bold uppercase tracking-wider">{b.category}</span>
                      <h3 className="font-display font-bold text-navy-900 mt-1 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors text-sm">{b.title}</h3>
                      <span className="text-xs text-gray-400">{formatDate(b.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}