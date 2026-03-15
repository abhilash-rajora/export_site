import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronRight, Coffee, Cpu, Gem, Globe, Leaf, Palette, Shield, Shirt, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useActiveProducts } from '../hooks/useQueries';
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import api from "../api/axios";

const categories = [
  { name: 'Agriculture', icon: Leaf, desc: 'Fresh produce & farm goods', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Textiles', icon: Shirt, desc: 'Fabrics & garments', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Minerals', icon: Gem, desc: 'Raw minerals & ores', color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { name: 'Electronics', icon: Cpu, desc: 'Components & devices', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Food & Beverages', icon: Coffee, desc: 'Packaged foods & drinks', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Handicrafts', icon: Palette, desc: 'Artisan & handmade goods', color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

const stats = [
  { value: '50+', label: 'Countries Served' },
  { value: '200+', label: 'Product Lines' },
  { value: '15+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
];

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function HomePage() {

  const [seo, setSeo] = useState<SeoData | null>(null);

  useEffect(() => {
    api.get("/seo/home")
      .then(res => setSeo(res.data))
      .catch(() => {});
  }, []);

  const { data: products, isLoading } = useActiveProducts();
  const featuredProducts = products?.slice(0, 6) ?? [];

  return (
    <>
      <Helmet>
        <title>
          {seo?.title || "WeExports | Trusted Global Export Partner"}
        </title>
        <meta
          name="description"
          content={
            seo?.description ||
            "Leading export company delivering agriculture, textiles, minerals and electronics worldwide."
          }
        />
        <meta
          name="keywords"
          content={
            seo?.keywords ||
            "export company, we exports, agriculture export, textile exporter"
          }
        />
      </Helmet>

      <section className="relative h-[600px] pt-24 flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden group">
            <img
              src="\container.jpg"
              alt="Global shipping port"
              className="w-full h-full object-cover object-right scale-100 origin-right transition-transform duration-700 ease-in-out"
            />
            <div className="hero-overlay absolute inset-0" />
            <img/>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <Globe className="w-3 h-3" />Global Export Excellence
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              Your Trusted <span className="text-gold-400">Global Export</span> Partner
            </h1>
            <p className="text-white/75 text-xl leading-relaxed mb-8 max-w-xl">
              Connecting quality products from across the world to international markets.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold shadow-gold px-8">
                  Explore Products <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/enquiry">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">Get in Touch</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-navy-900 border-y border-navy-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="font-display text-3xl font-extrabold text-gold-400">{stat.value}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="category-section" className="py-20 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-extrabold text-foreground text-white tracking-tight">Product Categories</h2>
            <p className="text-muted-foreground mt-3 text-lg text-white max-w-xl mx-auto">We export a diverse range of products across six major categories.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to="/products" search={{ category: cat.name }} className={`flex flex-col items-center p-4 rounded-xl border ${cat.color} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center`}>
                  <cat.icon className="w-7 h-7 mb-2" />
                  <span className="font-semibold text-sm leading-snug">{cat.name}</span>
                  <span className="text-xs opacity-70 mt-0.5">{cat.desc}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D3D3D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-extrabold text-foreground text-white tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-3 text-white text-lg">Handpicked quality exports available now</p>
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

      <section id="why-choose-section" className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">Why Choose WeExports?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Worldwide Reach', desc: 'We ship to 50+ countries across all major continents.' },
              { icon: Shield, title: 'Quality Assured', desc: 'Every product undergoes rigorous quality inspection before export.' },
              { icon: Truck, title: 'End-to-End Logistics', desc: 'From sourcing to doorstep — we handle documentation, customs, and freight.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="p-8 rounded-xl border border-white/10 bg-white/5">
                <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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