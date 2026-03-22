import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Coffee, Cpu, Gem, Globe, Leaf, Palette, Shield, Shirt, Star, Truck, Sparkles, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
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

// ── Full Product Card — white, vertical buttons ───────────────────
function ProductCard({
  product,
  badge,
  badgeColor = '#D4A017',
}: {
  product: HomeProduct;
  badge?: string;
  badgeColor?: string;
}) {
  const image = product.images?.[0] ?? product.imageUrl ?? '';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex-shrink-0 w-[200px] sm:w-[215px] flex flex-col rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '175px' }}>
        {image
          ? <img src={image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Gem className="w-10 h-10 text-gray-300" />
            </div>
        }
        {badge && (
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest"
            style={{ background: badgeColor, color: '#0D1B2A' }}>
            {badge}
          </div>
        )}
      </div>

      {/* Text area */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-1 gap-1">
        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#D4A017' }}>{product.category}</span>
        <h3 className="font-display font-extrabold text-gray-900 text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.originCountry && (
          <p className="flex items-center gap-1 text-gray-400 text-[10px]">
            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />{product.originCountry}
          </p>
        )}
        {product.priceRange && (
          <p className="font-bold text-xs mt-0.5" style={{ color: '#D4A017' }}>{product.priceRange}</p>
        )}
      </div>

      {/* Buttons — vertical, partially rounded (rounded-lg not full) */}
      <div className="flex flex-col gap-2 px-3 pb-3 pt-2">
        <Link to="/enquiry" search={{ productName: product.name } as any} onClick={e => e.stopPropagation()}>
          <button className="w-full h-8 text-[11px] font-black uppercase tracking-wide text-navy-900 hover:opacity-90 active:scale-95 transition-all"
            style={{ background: '#D4A017', borderRadius: '8px' }}>
            Quick Enquiry
          </button>
        </Link>
        <Link to="/products/detail/$id" params={{ id: product._id }}>
          <button className="w-full h-8 text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-1 border border-gray-200" style={{ borderRadius: '8px' }}>
            View Detail <ArrowRight className="w-3 h-3" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// ── Trending compact card (unchanged) ─────────────────────────────
function TrendingCard({ product, index }: { product: HomeProduct; index: number }) {
  const image = product.images?.[0] ?? product.imageUrl ?? '';
  const growthPct = ['+14%', '+8%', '+21%', '+12%', '+18%', '+9%'][index % 6];
  return (
    <Link to="/products/detail/$id" params={{ id: product._id }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: index * 0.08 }}
        whileHover={{ scale: 1.02 }}
        className="group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer overflow-hidden bg-white"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      >

        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
          {image
            ? <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            : <div className="w-full h-full flex items-center justify-center"><Gem className="w-5 h-5 text-gold-400/30" /></div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: '#D4A017' }}>{growthPct} GROWTH</p>
          <h4 className="font-display font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">{product.name}</h4>
          <p className="text-gray-400 text-xs mt-0.5">{product.category}</p>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Horizontal Slider ─────────────────────────────────────────────
function HScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <button onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {children}
      </div>
      <button onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────
function CardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Skeleton className="h-44 w-full bg-white/10 rounded-none" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-3 w-20 bg-white/10 rounded" />
            <Skeleton className="h-4 w-full bg-white/10 rounded" />
            <Skeleton className="h-3 w-24 bg-white/10 rounded" />
            <Skeleton className="h-8 w-full bg-white/10 rounded-xl mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

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
      <section className="md:hidden bg-[#0D3D3D] px-[8px] pt-[8px] pb-[8px]">
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
              <h1 className="font-display text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
                Your Trusted <span className="text-gold-400">Global Export</span> Partner
              </h1>
              <p className="text-white text-base leading-relaxed mb-6">
                Connecting quality products from across the world to international markets.
              </p>
              <div className="flex gap-3">
                <Link to="/products">
                  <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-5">
                    Explore Products <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link to="/enquiry">
                  <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-5">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DESKTOP HERO ── */}
      <section className="hidden md:block bg-[#0D3D3D] px-[20px] pt-[20px] pb-[20px]">
        <div className="relative h-[620px] md:h-[700px] rounded-3xl overflow-hidden">
          <video autoPlay loop muted playsInline preload="none" poster="/container1.jpg"
            className="absolute inset-0 w-full h-full object-cover object-center">
            <source src="/hero-desktop.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                className="max-w-2xl backdrop-blur-[2px]"
              >
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center hover:scale-105 transition-transform duration-300">
                <div className="font-display text-3xl font-extrabold text-gold-400">{stat.value}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Explore 🔥</p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Product Categories</h2>
            </div>
            <Link to="/products" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors">
              All Products <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Glass category cards — top */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <CategoryCard3D name={cat.name} slug={cat.slug} icon={cat.icon} desc={cat.desc} color={cat.color} />
              </motion.div>
            ))}
          </div>

          {/* Image collage — below */}
          <div className="grid grid-cols-12 grid-rows-2 gap-3" style={{ height: '400px' }}>

            {/* Agriculture — tall left */}
            <Link to="/products/$category" params={{ category: 'agriculture' }}
              className="col-span-4 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80"
                alt="Agriculture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display font-extrabold text-white/80 text-base leading-tight mb-1">Fresh Produce &amp; Farm Goods</h3>
                <p className="text-white/50 text-xs flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Explore</p>
              </div>
            </Link>

            {/* Textiles — top center */}
            <Link to="/products/$category" params={{ category: 'textiles' }}
              className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"
                alt="Textiles" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-sm">Fabrics &amp; Garments</h3>
              </div>
            </Link>

            {/* Electronics — top right */}
            <Link to="/products/$category" params={{ category: 'electronics' }}
              className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                alt="Electronics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-sm">Components &amp; Devices</h3>
              </div>
            </Link>

            {/* Minerals — bottom center left */}
            <Link to="/products/$category" params={{ category: 'minerals' }}
              className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://www.sreemetaliks.com/blog/public/assets/images/blog/blog-2-Hematite_1707918282.webp"
                alt="Minerals" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-xs">Raw Ores</h3>
              </div>
            </Link>

            {/* Food & Beverages — bottom center */}
            <Link to="/products/$category" params={{ category: 'food-beverages' }}
              className="col-span-3 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"
                alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-xs">Packaged Foods</h3>
              </div>
            </Link>

            {/* Handicrafts — bottom right */}
            <Link to="/products/$category" params={{ category: 'handicrafts' }}
              className="col-span-3 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&q=80"
                alt="Handicrafts" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-display font-bold text-white/80 text-xs">Artisan Goods</h3>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── FEATURED EXPORTS ── */}
      <section className="py-6 bg-[#0a2a2a]">
        <div className="px-3 sm:px-4">
          {/* Outer glass card */}https://www.sreemetaliks.com/blog/public/assets/images/blog/blog-2-Hematite_1707918282.webp
          <div className="rounded-3xl p-6 sm:p-8" style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.05)',
          }}>
            {/* Top glare line */}
            <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />

            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-gold-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Handpicked ⭐</p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  FEATURED <span className="text-gold-400">EXPORTS</span>
                </h2>
              </div>
              <Link to="/products">
                <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors border border-white/10 hover:border-gold-400/30 px-4 py-2 rounded-lg">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {isLoading ? <CardSkeleton count={5} /> : !data?.featured?.length ? (
              <div className="text-center py-12 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Star className="w-10 h-10 text-gold-400/20 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No featured products — mark some as featured in admin panel.</p>
              </div>
            ) : (
              <HScroller>
                {data.featured.map((p, i) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    badge={['TOP GRADE', 'VERIFIED', 'BESTSELLER', 'PREMIUM'][i % 4]}
                    badgeColor={['#D4A017', '#f97316', '#22c55e', '#60a5fa'][i % 4]}
                  />
                ))}
              </HScroller>
            )}
          </div>
        </div>
      </section>

      {/* ── TRENDING NOW ── */}
      <section className="py-16 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-4">Most Popular 🚀</p>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-none tracking-tight mb-2">
                  TRENDING<br /><span className="text-gold-400">NOW.</span>
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mt-4 max-w-xs">
                  High-velocity items currently dominating international supply chains.
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 mt-6 text-xs font-black uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors group">
                  View All Products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="lg:col-span-8">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Skeleton className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" />
                      <div className="flex-1 space-y-2"><Skeleton className="h-3 w-1/3 bg-white/10 rounded" /><Skeleton className="h-4 w-full bg-white/10 rounded" /></div>
                    </div>
                  ))}
                </div>
              ) : !data?.trending?.length ? (
                <p className="text-white/30 text-center py-16">No trending products yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.trending.slice(0, 6).map((p, i) => <TrendingCard key={p._id} product={p} index={i} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-6 bg-[#0a2a2a]">
        <div className="px-3 sm:px-4">
         
          {/* Outer glass card */}
          <div className="rounded-3xl p-6 sm:p-8" style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(96,165,250,0.08)',
          }}>
             {/* Top glare line */}
            <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Just Added 🆕</p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  NEW <span className="text-blue-400">ARRIVALS</span>
                </h2>
              </div>
              <Link to="/products">
                <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-blue-400 transition-colors border border-white/10 hover:border-blue-400/30 px-4 py-2 rounded-lg">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {isLoading ? <CardSkeleton count={5} /> : !data?.newArrivals?.length ? (
              <p className="text-white/30 text-center py-12">No products yet.</p>
            ) : (
              <HScroller>
                {data.newArrivals.map((p, i) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    badge="NEW"
                    badgeColor="#3b82f6"
                  />
                ))}
              </HScroller>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">Why Choose WeExports?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe,  title: 'Worldwide Reach',      desc: 'We ship to 50+ countries across all major continents.',                         accent: '#60a5fa' },
              { icon: Shield, title: 'Quality Assured',      desc: 'Every product undergoes rigorous quality inspection before export.',            accent: '#4ade80' },
              { icon: Truck,  title: 'End-to-End Logistics', desc: 'From sourcing to doorstep — we handle documentation, customs, and freight.',    accent: '#fbbf24' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative p-8 rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 30% 0%, ${item.accent}18 0%, transparent 65%)` }} />
                <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}35`, boxShadow: `0 0 20px ${item.accent}20` }}>
                  <item.icon className="w-6 h-6" style={{ color: item.accent }} />
                </div>
                <h3 className="relative z-10 font-display font-bold text-xl text-white mb-3">{item.title}</h3>
                <p className="relative z-10 text-white/55 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gold-500 to-gold-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl font-extrabold text-navy-900 tracking-tight mb-4">Ready to Start Importing?</h2>
            <p className="text-navy-800/80 text-lg mb-8 max-w-xl mx-auto">Browse our catalog and send us an enquiry. Our team responds within 24 hours.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 shadow-navy">
                  Browse Products <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/enquiry">
                <Button size="lg" variant="outline" className="border-navy-900/30 text-navy-900 hover:bg-navy-900/10 px-8">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}