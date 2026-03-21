// frontend/src/pages/BlogPage.tsx
// iOS/Twitter style — clean, minimal, fast

import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Search, ArrowRight, BookOpen, TrendingUp, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { usePublishedBlogs, BLOG_CATEGORIES, Blog } from '../hooks/useBlogs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import useSeo from '../hooks/useSeo';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Featured Card ────────────────────────────────────────────────
function FeaturedCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <Link to="/blog/$slug" params={{ slug: blog.slug }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="group relative rounded-2xl overflow-hidden bg-navy-900 cursor-pointer h-[280px] sm:h-[340px]"
      >
        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="bg-gold-500 text-navy-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" /> Featured
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="text-gold-400 text-[10px] font-bold uppercase tracking-wider">{blog.category}</span>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug mt-1 mb-2 group-hover:text-gold-300 transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40 text-[11px]">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
            </div>
            <span className="flex items-center gap-1 text-gold-400 text-xs font-semibold">
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Grid Card (image top, text below) ───────────────────────────
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <Link to="/blog/$slug" params={{ slug: blog.slug }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gold-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden bg-navy-900 flex-shrink-0">
          {blog.coverImage
            ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-gold-400/30" /></div>
          }
          <div className="absolute top-3 left-3">
            <span className="bg-gold-500 text-navy-900 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full">{blog.category}</span>
          </div>
          {blog.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-gold-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-current" /></span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min read</span>
          </div>
          <h3 className="font-display font-extrabold text-navy-900 leading-snug mb-2 group-hover:text-gold-600 transition-colors line-clamp-2 flex-1">{blog.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{blog.excerpt}</p>
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {blog.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 text-gold-600 font-semibold text-sm mt-auto group-hover:gap-2 transition-all">
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function BlogPage() {
  useSeo('blog', {
    title: 'Blog | Export Insights & Trade Tips | WExports',
    description: "Stay updated with the latest export tips, industry news and market trends from WExports.",
    keywords: 'export blog india, trade insights, export tips, wexports blog',
    canonical: 'https://wexports.vercel.app/blog',
  });

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('');
  const [sort, setSort]               = useState('latest');
  const [page, setPage]               = useState(1);
  const [searchOpen, setSearchOpen]   = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = usePublishedBlogs({ category, sort, page, search });

  const blogs    = data?.blogs    ?? [];
  const featured = data?.featured ?? [];
  const pages    = data?.pages    ?? 1;
  const total    = data?.total    ?? 0;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
    setSearchOpen(false);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero — compact, iOS style ── */}
      <div className="bg-navy-900 pt-24 pb-8 sm:pt-28 sm:pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-gold-500 opacity-10 blur-[100px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Our Blog
            </span>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none mb-2">
                  Export <span className="text-gold-400">Insights</span>
                </h1>
                <p className="text-white/50 text-sm sm:text-base max-w-md">
                  Trade tips, industry news and market trends.
                </p>
              </div>
              {/* Search icon button */}
              <button
                onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Search overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-0 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl px-5">
                  Search
                </Button>
                <button onClick={() => setSearchOpen(false)} className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category Filter — wrap on mobile, tabs on desktop ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">

          {/* Categories — wrap */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', ...BLOG_CATEGORIES].map((cat) => {
              const active = cat === 'All' ? !category : category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat === 'All' ? '' : cat)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}

            {/* Sort — pushed to end */}
            <div className="ml-auto flex items-center gap-1">
              {[
                { value: 'latest',  label: 'New',     icon: Calendar },
                { value: 'popular', label: 'Popular', icon: TrendingUp },
              ].map(opt => (
                <button key={opt.value} onClick={() => { setSort(opt.value); setPage(1); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    sort === opt.value
                      ? 'bg-navy-900 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}>
                  <opt.icon className="w-3 h-3" />{opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Active search banner ── */}
      <AnimatePresence>
        {search && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-gold-50 border-b border-gold-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
              <span className="text-sm text-navy-900">Results for <strong>"{search}"</strong> — {total} found</span>
              <button onClick={clearSearch} className="flex items-center gap-1 text-xs text-gold-700 font-semibold hover:text-gold-800">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl lg:max-w-6xl">

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 && featured.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-gray-700 mb-2">
              {search ? `No results for "${search}"` : 'No posts yet'}
            </h3>
            <p className="text-gray-400 text-sm">
              {search ? 'Try a different search term.' : 'Check back soon for export insights.'}
            </p>
            {search && <Button variant="outline" className="mt-4" onClick={clearSearch}>Clear Search</Button>}
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">

            {/* ── Main feed ── */}
            <div className="lg:col-span-8">

              {/* Featured — show only on first page, no search/filter */}
              {featured.length > 0 && !search && !category && page === 1 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-display font-bold text-base text-navy-900 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-gold-500 fill-current" /> Featured
                    </h2>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className={`grid gap-3 ${featured.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {featured.slice(0, 2).map((blog, i) => <FeaturedCard key={blog._id} blog={blog} index={i} />)}
                  </div>
                </div>
              )}

              {/* Feed header */}
              {blogs.length > 0 && (
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display font-bold text-base text-navy-900">
                    {search ? 'Search Results' : category || 'Latest'}
                  </h2>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">{total} articles</span>
                </div>
              )}

              {/* Grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${page === p ? 'bg-navy-900 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* ── Right sidebar — desktop only ── */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20 space-y-5">

                {/* Categories widget */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-display font-bold text-navy-900 text-sm mb-4">Browse Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {BLOG_CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => handleCategoryChange(category === cat ? '' : cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          category === cat
                            ? 'bg-navy-900 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-300 hover:text-navy-900'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-navy-900 rounded-2xl p-5">
                  <h3 className="font-display font-bold text-white text-base mb-1">Ready to Export?</h3>
                  <p className="text-white/50 text-xs mb-4 leading-relaxed">Get competitive pricing and dedicated support from our team.</p>
                  <Link to="/enquiry">
                    <Button className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm rounded-xl">
                      Get Quote in 24hrs
                    </Button>
                  </Link>
                  <Link to="/products" className="block mt-2">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-sm rounded-xl">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Mobile CTA */}
      <div className="lg:hidden bg-navy-900 py-10 mt-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold text-white mb-2">Ready to Export?</h2>
          <p className="text-white/50 text-sm mb-6">Competitive pricing and dedicated support.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/enquiry"><Button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8">Get Quote</Button></Link>
            <Link to="/products"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">Browse Products</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}