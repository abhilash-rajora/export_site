import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronRight, Coffee, Cpu, Gem, Globe, Leaf, Palette, Shield, Shirt, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useActiveProducts } from '../hooks/useQueries';
import useSeo from '../hooks/useSeo';
import CategoryCard3D from '../components/3d/CategoryCard3D';

const categories = [
  { name: 'Agriculture',      slug: 'agriculture',    icon: Leaf,    desc: 'Fresh produce & farm goods',  color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Textiles',         slug: 'textiles',        icon: Shirt,   desc: 'Fabrics & garments',           color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Minerals',         slug: 'minerals',        icon: Gem,     desc: 'Raw minerals & ores',          color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { name: 'Electronics',      slug: 'electronics',     icon: Cpu,     desc: 'Components & devices',         color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Food & Beverages', slug: 'food-beverages',  icon: Coffee,  desc: 'Packaged foods & drinks',      color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Handicrafts',      slug: 'handicrafts',     icon: Palette, desc: 'Artisan & handmade goods',     color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

const stats = [
  { value: '50+',  label: 'Countries Served' },
  { value: '200+', label: 'Product Lines' },
  { value: '15+',  label: 'Years Experience' },
  { value: '99%',  label: 'Client Satisfaction' },
];

export default function HomePage() {
  useSeo('home', {
    title:       'WExports | Trusted Global Export Partner from India',
    description: 'Leading Indian export company delivering Agriculture, Textiles, Minerals and Electronics to 50+ countries worldwide.',
    keywords:    'export company india, indian exporter, agriculture export, textile export, wexports',
    canonical:   'https://wexports.vercel.app/',
  });

  const { data: products, isLoading } = useActiveProducts();
  const featuredProducts = products?.slice(0, 6) ?? [];

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
                <div className="h-4" />
                <div className="flex flex-wrap gap-4">
                  <Link to="/products">
                    <Button size="lg" className="group bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8">
                      Explore Products
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
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

      {/* Categories — glassmorphism */}
      <section id="category-section" className="py-20 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">Product Categories</h2>
            <p className="text-white/60 mt-3 text-lg max-w-xl mx-auto">We export a diverse range of products across six major categories.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <CategoryCard3D name={cat.name} slug={cat.slug} icon={cat.icon} desc={cat.desc} color={cat.color} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">Featured Products</h2>
              <p className="text-white mt-3 text-lg">Handpicked quality exports available now</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center">
              <Button variant="ghost" className="text-gold-600 hover:text-gold-700 hover:bg-gold-50 font-semibold">
                View All <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Products coming soon. Check back shortly!</p>
              <Link to="/enquiry" className="mt-4 inline-block">
                <Button className="bg-gold-500 hover:bg-gold-400 text-navy-900 mt-4">Make an Enquiry</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {featuredProducts.map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose */}
      <section id="why-choose-section" className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">Why Choose WeExports?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe,  title: 'Worldwide Reach',      desc: 'We ship to 50+ countries across all major continents.',                                           accent: '#60a5fa' },
              { icon: Shield, title: 'Quality Assured',      desc: 'Every product undergoes rigorous quality inspection before export.',                              accent: '#4ade80' },
              { icon: Truck,  title: 'End-to-End Logistics', desc: 'From sourcing to doorstep — we handle documentation, customs, and freight.',                      accent: '#fbbf24' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative p-8 rounded-2xl overflow-hidden cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {/* Top edge glare */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

                {/* Hover accent glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 30% 0%, ${item.accent}18 0%, transparent 65%)` }} />

                {/* Icon */}
                <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.accent}18`,
                    border: `1px solid ${item.accent}35`,
                    boxShadow: `0 0 20px ${item.accent}20`,
                  }}>
                  <item.icon className="w-6 h-6" style={{ color: item.accent }} />
                </div>

                <h3 className="relative z-10 font-display font-bold text-xl text-white mb-3">{item.title}</h3>
                <p className="relative z-10 text-white/55 leading-relaxed">{item.desc}</p>

                {/* Bottom reflection */}
                <div className="absolute bottom-0 left-4 right-4 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
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