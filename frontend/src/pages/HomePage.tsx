import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Coffee, Cpu, Gem, Globe, Leaf, Palette, Shield, Shirt, Star, Truck, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useHomepageProducts, HomeProduct } from '../hooks/useHomepage';
import useSeo from '../hooks/useSeo';
import CategoryCard3D from '../components/3d/CategoryCard3D';

const categories = [
  { name: 'Agriculture',      slug: 'agriculture',   icon: Leaf,    desc: 'Fresh produce & farm goods',  color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Textiles',         slug: 'textiles',       icon: Shirt,   desc: 'Fabrics & garments',           color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Minerals',         slug: 'minerals',       icon: Gem,     desc: 'Raw minerals & ores',          color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { name: 'Electronics',      slug: 'electronics',    icon: Cpu,     desc: 'Components & devices',         color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Food & Beverages', slug: 'food-beverages', icon: Coffee,  desc: 'Packaged foods & drinks',      color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Handicrafts',      slug: 'handicrafts',    icon: Palette, desc: 'Artisan & handmade goods',     color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

const stats = [
  { value: '50+',  label: 'Countries Served' },
  { value: '200+', label: 'Product Lines' },
  { value: '15+',  label: 'Years Experience' },
  { value: '99%',  label: 'Client Satisfaction' },
];

// ── Shared card body ─────────────────────────────────────────────
const CardBody = React.memo(function CardBody({ product, badge, badgeColor = '#D4A017', imgHeight, showEnquiry, eager = false }:{
  product: HomeProduct; badge?: string; badgeColor?: string; imgHeight: number; showEnquiry?: boolean; eager?: boolean;
}) {
  const image = product.images?.[0] ?? product.imageUrl ?? '';
  return (
    <>
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: imgHeight }}>
        {image
          ? <img src={image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading={eager ? "eager" : "lazy"} decoding="async" />
          : <div className="w-full h-full flex items-center justify-center bg-gray-100"><Gem className="w-8 h-8 text-gray-300" /></div>
        }
        {badge && (
          <div className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
            style={{ background: badgeColor, color: '#0D1B2A', borderRadius: '4px' }}>
            {badge}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 px-3 pt-2 pb-1 gap-0.5">
        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#D4A017' }}>{product.category}</span>
        <h3 className="font-display font-extrabold text-gray-900 text-xs leading-snug line-clamp-2">{product.name}</h3>
        {product.originCountry && (
          <p className="flex items-center gap-1 text-gray-400 text-[10px]">
            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />{product.originCountry}
          </p>
        )}
        {product.priceRange && (
          <p className="font-bold text-xs" style={{ color: '#D4A017' }}>{product.priceRange}</p>
        )}
      </div>
      {showEnquiry && (
        <div className="px-3 pb-3 pt-1.5">
          <Link to="/enquiry" search={{ productName: product.name } as any} onClick={e => e.stopPropagation()} className="block">
            <button className="w-full h-9 text-xs font-black uppercase tracking-wide text-navy-900 hover:opacity-90 transition-all"
              style={{ background: '#D4A017', borderRadius: '8px' }}>
              Quick Enquiry
            </button>
          </Link>
        </div>
      )}
    </>
  );
});

// ── Featured card — big fixed size ───────────────────────────────
const FeaturedCard = React.memo(function FeaturedCard({ product, badge, badgeColor, eager = false }: { product: HomeProduct; badge?: string; badgeColor?: string; eager?: boolean }) {
  return (
    <Link to="/products/detail/$id" params={{ id: product._id }} className="block flex-shrink-0 w-[270px] sm:w-[360px]">
      <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="group flex flex-col rounded-2xl overflow-hidden bg-white w-full h-full"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardBody product={product} badge={badge} badgeColor={badgeColor} imgHeight={280} showEnquiry eager={eager} />
      </motion.div>
    </Link>
  );
});

// ── New Arrival Row 1 — fills grid cell, same height ─────────────
const ArrivalGridCard = React.memo(function ArrivalGridCard({ product }: { product: HomeProduct }) {
  return (
    <Link to="/products/detail/$id" params={{ id: product._id }} className="block h-full">
      <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="group flex flex-col rounded-2xl overflow-hidden bg-white w-full h-full"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minHeight: '320px' }}>
        <CardBody product={product} badge="NEW" badgeColor="#3b82f6" imgHeight={210} />
      </motion.div>
    </Link>
  );
});

// ── New Arrival Row 2 slider — fixed width ────────────────────────
const ArrivalSliderCard = React.memo(function ArrivalSliderCard({ product }: { product: HomeProduct }) {
  return (
    <Link to="/products/detail/$id" params={{ id: product._id }} className="block flex-shrink-0 w-[155px] sm:w-[185px]">
      <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="group flex flex-col rounded-2xl overflow-hidden bg-white w-full h-full"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardBody product={product} badge="NEW" badgeColor="#3b82f6" imgHeight={130} />
      </motion.div>
    </Link>
  );
});

// ── Trending Card ─────────────────────────────────────────────────
const TrendingCard = React.memo(function TrendingCard({ product, index }: { product: HomeProduct; index: number }) {
  const image = product.images?.[0] ?? product.imageUrl ?? '';
  const growthPct = ['+14%', '+8%', '+21%', '+12%', '+18%', '+9%'][index % 6];
  return (
    <Link to="/products/detail/$id" params={{ id: product._id }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: index * 0.08 }}
        whileHover={{ scale: 1.02 }}
        className="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer bg-white h-full"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {image
            ? <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" decoding="async" />
            : <div className="w-full h-full flex items-center justify-center"><Gem className="w-5 h-5 text-gray-300" /></div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: '#D4A017' }}>{growthPct} GROWTH</p>
          <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">{product.name}</h4>
          <p className="text-gray-400 text-[10px] mt-0.5">{product.category}</p>
        </div>
      </motion.div>
    </Link>
  );
});

// ── Horizontal Slider ─────────────────────────────────────────────
const HScroller = React.memo(function HScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  }, []);
  return (
    <div className="relative">
      <button onClick={() => scroll('left')}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-7 z-10 w-9 h-9 rounded-full items-center justify-center hover:scale-110 transition-all"
        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <ChevronLeft className="w-5 h-5 text-gray-900 stroke-[2.5]" />
      </button>
      <div ref={ref} className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {children}
      </div>
      <button onClick={() => scroll('right')}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-7 z-10 w-9 h-9 rounded-full items-center justify-center hover:scale-110 transition-all"
        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <ChevronRight className="w-5 h-5 text-gray-900 stroke-[2.5]" />
      </button>
      <button onClick={() => scroll('left')}
        className="sm:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 flex items-center justify-center">
        <ChevronLeft className="w-6 h-6 text-white/60" />
      </button>
      <button onClick={() => scroll('right')}
        className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 flex items-center justify-center">
        <ChevronRight className="w-6 h-6 text-white/60" />
      </button>
    </div>
  );
});

// ── Card Skeleton ─────────────────────────────────────────────────
function CardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[175px] sm:w-[200px] rounded-2xl overflow-hidden bg-white/10">
          <Skeleton className="h-[155px] w-full bg-white/10 rounded-none" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-2.5 w-16 bg-white/10 rounded" />
            <Skeleton className="h-3.5 w-full bg-white/10 rounded" />
            <Skeleton className="h-7 w-full bg-white/10 rounded-md mt-3" />
            <Skeleton className="h-7 w-full bg-white/10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Glass outer card style ────────────────────────────────────────
const glassCard = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
};

export default function HomePage() {
  useSeo('home', {
    title:       'WExports | Trusted Global Export Partner from India',
    description: 'Leading Indian export company delivering Agriculture, Textiles, Minerals and Electronics to 50+ countries worldwide.',
    keywords:    'export company india, indian exporter, agriculture export, textile export, wexports',
    canonical:   'https://wexports.vercel.app/',
  });

  const { data, isLoading } = useHomepageProducts();

  return (
    <>
      {/* ── MOBILE HERO ── */}
      <section className="md:hidden bg-[#0D3D3D] px-2 pt-2 pb-2">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: '96svh' }}>
          <video autoPlay loop muted playsInline preload="none" poster="/container1.jpg"
            className="absolute inset-0 w-full h-full object-cover object-center">
            <source src="/hero-mobile.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-end px-5 pb-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Globe className="w-3 h-3" />Global Export Excellence
              </div>
              <h1 className="font-display text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
                Your Trusted <span className="text-gold-400">Global Export</span> Partner
              </h1>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Connecting quality products from across the world to international markets.
              </p>
              <div className="flex gap-3">
                <Link to="/products">
                  <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-4">
                    Explore <ArrowRight className="ml-1 w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link to="/enquiry">
                  <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-4">
                    Contact
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DESKTOP HERO ── */}
      <section className="hidden md:block bg-[#0D3D3D] px-5 pt-5 pb-5">
        <div className="relative h-[620px] md:h-[700px] rounded-3xl overflow-hidden">
          <video autoPlay loop muted playsInline preload="none" poster="/container1.jpg"
            className="absolute inset-0 w-full h-full object-cover object-center">
            <source src="/hero-desktop.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                className="max-w-2xl backdrop-blur-[2px]">
                <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                  <Globe className="w-3 h-3" />Global Export Excellence
                </div>
                <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
                  Your Trusted <span className="text-gold-400 block">Global Export</span> Partner
                </h1>
                <p className="text-white/75 text-xl leading-relaxed mb-8 max-w-xl">
                  Connecting quality products from across the world to international markets.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/products">
                    <Button size="lg" className="group bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8">
                      Explore Products <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/enquiry">
                    <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 backdrop-blur-md">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 border-y border-navy-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-gold-400">{stat.value}</div>
                <div className="text-white/50 text-xs sm:text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-10 sm:py-16 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gold-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Explore 🔥</p>
              <h2 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight">Product Categories</h2>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-xs font-bold text-white/40 hover:text-gold-400 transition-colors">
              All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Glass category cards — desktop only */}
          <div className="hidden sm:grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <CategoryCard3D name={cat.name} slug={cat.slug} icon={cat.icon} desc={cat.desc} color={cat.color} />
              </motion.div>
            ))}
          </div>

          {/* Mobile collage */}
          <div className="grid sm:hidden grid-cols-3 gap-2" style={{ height: '220px' }}>
            {[
              { slug: 'agriculture',    src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=70', label: 'Agriculture' },
              { slug: 'textiles',       src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=70',    label: 'Textiles' },
              { slug: 'electronics',    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70', label: 'Electronics' },
              { slug: 'minerals',       src: 'https://www.sreemetaliks.com/blog/public/assets/images/blog/blog-2-Hematite_1707918282.webp', label: 'Minerals' },
              { slug: 'food-beverages', src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70',    label: 'Food & Bev' },
              { slug: 'handicrafts',    src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70', label: 'Handicrafts' },
            ].map(cat => (
              <Link key={cat.slug} to="/products/$category" params={{ category: cat.slug }}
                className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img src={cat.src} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-1.5 left-2">
                  <p className="font-display font-bold text-white/80 text-[10px] leading-tight">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop collage */}
          <div className="hidden sm:grid grid-cols-12 grid-rows-2 gap-3" style={{ height: '380px' }}>
            <Link to="/products/$category" params={{ category: 'agriculture' }}
              className="col-span-4 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" alt="Agriculture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display font-extrabold text-white/80 text-base leading-tight mb-1">Fresh Produce &amp; Farm Goods</h3>
                <p className="text-white/50 text-xs flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Explore</p>
              </div>
            </Link>
            <Link to="/products/$category" params={{ category: 'textiles' }}
              className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80" alt="Textiles" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-sm">Fabrics &amp; Garments</h3>
              </div>
            </Link>
            <Link to="/products/$category" params={{ category: 'electronics' }}
              className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" alt="Electronics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-sm">Components &amp; Devices</h3>
              </div>
            </Link>
            <Link to="/products/$category" params={{ category: 'minerals' }}
              className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://www.sreemetaliks.com/blog/public/assets/images/blog/blog-2-Hematite_1707918282.webp" alt="Minerals" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-xs">Raw Ores</h3>
              </div>
            </Link>
            <Link to="/products/$category" params={{ category: 'food-beverages' }}
              className="col-span-3 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80" alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-xs">Packaged Foods</h3>
              </div>
            </Link>
            <Link to="/products/$category" params={{ category: 'handicrafts' }}
              className="col-span-3 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&q=80" alt="Handicrafts" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-xs">Artisan Goods</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED EXPORTS ── */}
      <section className="py-4 sm:py-6 bg-[#0a2a2a]">
        <div className="px-2 sm:px-4">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative" style={glassCard}>
            <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-gold-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Handpicked ⭐</p>
                <h2 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  FEATURED <span className="text-gold-400">PRODUCTS</span>
                </h2>
              </div>
              <Link to="/products">
                <button className="flex items-center gap-1 text-xs font-bold text-white/40 hover:text-gold-400 transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            {isLoading ? <CardSkeleton count={5} /> : !data?.featured?.length ? (
              <div className="text-center py-10 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Star className="w-8 h-8 text-gold-400/20 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No featured products — mark some in admin panel.</p>
              </div>
            ) : (
              <HScroller>
                {data.featured.map((p, i) => (
                  <FeaturedCard key={p._id} product={p}
                    eager={i < 2}
                    badge={(['TOP GRADE', 'VERIFIED', 'BESTSELLER', 'PREMIUM'] as const)[i % 4]}
                    badgeColor={(['#D4A017', '#f97316', '#22c55e', '#60a5fa'] as const)[i % 4]} />
                ))}
              </HScroller>
            )}
          </div>
        </div>
      </section>

      {/* ── TRENDING NOW ── */}
      <section className="py-10 sm:py-16 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-3">Most Popular 🚀</p>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-none tracking-tight">
                  TRENDING<br /><span className="text-gold-400">NOW.</span>
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mt-3 max-w-xs">
                  High-velocity items currently dominating international supply chains.
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 mt-5 text-xs font-black uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors group">
                  View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="lg:col-span-8">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5">
                      <Skeleton className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0" />
                      <div className="flex-1 space-y-2"><Skeleton className="h-3 w-1/3 bg-white/10 rounded" /><Skeleton className="h-4 w-full bg-white/10 rounded" /></div>
                    </div>
                  ))}
                </div>
              ) : !data?.trending?.length ? (
                <p className="text-white/30 text-center py-10">No trending products yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                  {data.trending.slice(0, 4).map((p, i) => <TrendingCard key={p._id} product={p} index={i} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-4 sm:py-6 bg-[#0a2a2a]">
        <div className="px-2 sm:px-4">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative" style={{
            ...glassCard,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(96,165,250,0.08)',
          }}>
            <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Just Added 🆕</p>
                <h2 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  NEW <span className="text-blue-400">ARRIVALS</span>
                </h2>
              </div>
              <Link to="/products">
                <button className="flex items-center gap-1 text-xs font-bold text-white/40 hover:text-blue-400 transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-white/10">
                      <Skeleton className="h-[155px] w-full bg-white/10 rounded-none" />
                      <div className="p-3 space-y-1.5">
                        <Skeleton className="h-2.5 w-16 bg-white/10 rounded" />
                        <Skeleton className="h-3.5 w-full bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <CardSkeleton count={4} />
              </div>
            ) : !data?.newArrivals?.length ? (
              <p className="text-white/30 text-center py-10">No products yet.</p>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Latest Drop</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {data.newArrivals.slice(0, 4).map((p, i) => (
                      <ArrivalGridCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                {data.newArrivals.length > 4 && (
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">More New Arrivals</p>
                    <HScroller>
                      {data.newArrivals.slice(4).map((p, i) => (
                        <ArrivalSliderCard key={p._id} product={p} />
                      ))}
                    </HScroller>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-12 sm:py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Why Choose WeExports?</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Globe,  title: 'Worldwide Reach',      desc: 'We ship to 50+ countries across all major continents.',          accent: '#60a5fa' },
              { icon: Shield, title: 'Quality Assured',      desc: 'Every product undergoes rigorous quality inspection before export.', accent: '#4ade80' },
              { icon: Truck,  title: 'End-to-End Logistics', desc: 'From sourcing to doorstep — we handle documentation, customs, and freight.', accent: '#fbbf24' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative p-6 sm:p-8 rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 30% 0%, ${item.accent}18 0%, transparent 65%)` }} />
                <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}35` }}>
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: item.accent }} />
                </div>
                <h3 className="relative z-10 font-display font-bold text-base sm:text-xl text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="relative z-10 text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gold-500 to-gold-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-3 sm:mb-4">Ready to Start Importing?</h2>
            <p className="text-navy-800/80 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">Browse our catalog and send us an enquiry. Our team responds within 24 hours.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 w-full sm:w-auto">
                  Browse Products <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/enquiry">
                <Button size="lg" variant="outline" className="border-navy-900/30 text-navy-900 hover:bg-navy-900/10 px-8 w-full sm:w-auto">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}