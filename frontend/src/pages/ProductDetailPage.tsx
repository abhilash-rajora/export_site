import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useParams } from '@tanstack/react-router';
import { AlertCircle, ChevronLeft, ChevronRight, DollarSign, MapPin, Package, Tag } from 'lucide-react';
import { motion } from "framer-motion";
import { useState } from 'react';
import EnquiryForm from '../components/EnquiryForm';
import { useProductById } from '../hooks/useQueries';

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: product, isLoading, isError } = useProductById(id ?? '');
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-200">
        <div className="bg-navy-900 pt-24 pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Skeleton className="h-4 w-32 mb-4 bg-white/10" />
            <Skeleton className="h-10 w-2/3 bg-white/10" />
          </div>
        </div>
        <div id="product-detail-solid-trigger" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-slate-200">
        <div id="product-detail-solid-trigger" className="container mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-6">This product may no longer be available.</p>
          <Link to="/products">
            <Button variant="outline"><ChevronLeft className="mr-2 w-4 h-4" />Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="bg-navy-900 pt-24 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />Back to Products
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mt-4">
            {product.name}
          </h1>
          <Badge className="mt-3 bg-gold-500/20 text-gold-300 border-gold-500/30">{product.category}</Badge>
        </div>
      </div>

      <div id="product-detail-solid-trigger" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>

            {/* Main image */}
            <div className="relative h-80 sm:h-96 bg-muted rounded-2xl overflow-hidden mb-3 shadow-lg">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg((prev) => (prev - 1 + allImages.length) % allImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveImg((prev) => (prev + 1) % allImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold-500 shadow-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-foreground">Product Details</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Tag, label: 'Category', value: product.category },
                  { icon: MapPin, label: 'Origin', value: product.originCountry },
                  { icon: Package, label: 'Min. Order', value: `${product.minOrderQty} units` },
                  { icon: DollarSign, label: 'Price Range', value: product.priceRange },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <item.icon className="w-3 h-3" /> {item.label}
                    </div>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-display font-bold text-xl text-foreground mb-1">Send an Enquiry</h2>
                <p className="text-muted-foreground text-sm">Interested in this product? Fill the form below and we'll contact you within 24 hours.</p>
              </div>
              <EnquiryForm productId={product._id} productName={product.name} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}