"use client";

import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, ArrowRight, BookOpen, TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePublishedBlogs, BLOG_CATEGORIES, Blog } from '@/hooks/useBlogs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from "next/link";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Memoized cards ────────────────────────────────────────────────
const FeaturedCard = memo(function FeaturedCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-3xl overflow-hidden bg-navy-900 h-[420px] cursor-pointer"
      >
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="eager"
            decoding="async"
            width={800} height={420}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-gold-500 text-navy-900 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Featured
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-wider">{blog.category}</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight mt-2 mb-3 group-hover:text-gold-300 transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{blog.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/40 text-xs">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
            </div>
            <span className="flex items-center gap-1.5 text-gold-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
              Read <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

const BlogCard = memo(function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: Math.min(index * 0.05, 0.3) }}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gold-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden bg-navy-900 flex-shrink-0">
          {blog.coverImage
            ? <img
                src={blog.coverImage}
                alt={blog.title}
                loading="lazy"
                decoding="async"
                width={400} height={192}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-gold-400/30" /></div>
          }
          <div className="absolute top-3 left-3">
            <span className="bg-gold-500 text-navy-900 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              {blog.category}
            </span>
          </div>
          {blog.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-gold-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
              </span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min read</span>
          </div>
          <h3 className="font-display font-extrabold text-navy-900 leading-snug mb-2 group-hover:text-gold-600 transition-colors line-clamp-2 flex-1">
            {blog.title}
          </h3>
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
});

// ── Skeleton rows ─────────────────────────────────────────────────
const BlogListSkeleton = memo(function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-[420px] rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({length:6}).map((_,i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
      </div>
    </div>
  );
});

export default function BlogPage() {

  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory]       = useState('');
  const [sort, setSort]               = useState('latest');
  const [page, setPage]               = useState(1);

  const { data, isLoading } = usePublishedBlogs({ category, sort, page, search });

  const blogs    = data?.blogs    ?? [];
  const featured = data?.featured ?? [];
  const pages    = data?.pages    ?? 1;
  const total    = data?.total    ?? 0;

  // Memoized handlers — no inline recreation
  const handleSearch = useCallback(() => { setSearch(searchInput); setPage(1); }, [searchInput]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }, [handleSearch]);
  const handleCategoryAll = useCallback(() => { setCategory(''); setPage(1); }, []);
  const handleSortChange = useCallback((v: string) => { setSort(v); setPage(1); }, []);
  const handlePrev = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setPage(p => Math.min(pages, p + 1)), [pages]);

  const sortOptions = [
    { value: 'latest',  label: 'Latest',  icon: Calendar },
    { value: 'popular', label: 'Popular', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-navy-900 pt-28 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold-500 opacity-10 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/4 bottom-0 w-64 h-64 rounded-full bg-blue-400 opacity-5 blur-[80px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              Our Blog
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-4">
              Export <span className="text-gold-400">Insights</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mb-8">
              Trade tips, industry news and market trends — everything you need to succeed in global exports.
            </p>
            <div className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold-400 focus:bg-white/15 transition-all"
                />
              </div>
              <Button onClick={handleSearch} className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 rounded-xl">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters — sticky */}
      <div className="border-b border-gray-100 sticky top-0 z-20 shadow-sm backdrop-blur-2xl bg-white/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <button onClick={handleCategoryAll}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${!category ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'}`}>
              All
            </button>
            {BLOG_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${category === cat ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => handleSortChange(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${sort === opt.value ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:border-navy-300'}`}>
                <opt.icon className="w-3 h-3" /> {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? <BlogListSkeleton /> : blogs.length === 0 && featured.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-gray-700 mb-2">
              {search ? `No results for "${search}"` : 'No posts yet'}
            </h3>
            <p className="text-gray-400">
              {search ? 'Try a different search term.' : 'Check back soon for export insights.'}
            </p>
            {search && (
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setSearchInput(''); }}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured */}
            {featured.length > 0 && !search && !category && page === 1 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display font-extrabold text-2xl text-navy-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold-500 fill-current" /> Featured Posts
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className={`grid gap-4 ${featured.length === 1 ? 'grid-cols-1' : featured.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                  {featured.map(blog => <FeaturedCard key={blog._id} blog={blog} />)}
                </div>
              </div>
            )}

            {/* All blogs */}
            {blogs.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display font-extrabold text-2xl text-navy-900">
                    {search ? `Results for "${search}"` : category ? category : 'Latest Articles'}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400">{total} articles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx-1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => p === '...'
                    ? <span key={`d${i}`} className="px-1 text-gray-400">...</span>
                    : <button key={p} onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${page === p ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-300'}`}>
                        {p}
                      </button>
                  )}
                <Button variant="outline" size="sm" onClick={handleNext} disabled={page === pages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-navy-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white mb-3">Ready to Export?</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">Get high-quality products with transparent pricing and dedicated support.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products"><Button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8">Browse Products</Button></Link>
            <Link href="/enquiry"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">Contact Us</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}