import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useParams } from '@tanstack/react-router';
import { AlertCircle, ChevronLeft, ChevronRight, DollarSign, Heart, MapPin, Package, Share2, Tag, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import EnquiryForm from '../components/EnquiryForm';
import { useProductById } from '../hooks/useQueries';

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: product, isLoading, isError } = useProductById(id ?? '');
  const [activeImg, setActiveImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImg, setZoomImg] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<'idle' | 'copied' | 'shared'>('idle');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (zoomOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [zoomOpen]);

  // Load wishlist state from localStorage
  useEffect(() => {
    if (!id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist') ?? '[]') as string[];
      setIsWishlisted(saved.includes(id));
    } catch {
      // ignore
    }
  }, [id]);

  const openZoom = (index: number) => {
    setZoomImg(index);
    setZoomOpen(true);
  };

  const toggleWishlist = () => {
    if (!id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist') ?? '[]') as string[];
      const next = isWishlisted
        ? saved.filter((v) => v !== id)
        : [...saved, id];
      localStorage.setItem('wishlist', JSON.stringify(next));
      setIsWishlisted(!isWishlisted);
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product?.name ?? 'Product';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setShareTooltip('shared');
      } catch {
        // user cancelled — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareTooltip('copied');
      } catch {
        // fallback: select text
      }
    }
    setTimeout(() => setShareTooltip('idle'), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
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
      <div className="min-h-screen bg-white">
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
  const descriptionLines = product.description?.split('\n').filter(line => line.trim()) ?? [];
  const hasSpecs = product.specifications && product.specifications.length > 0;

  return (
    <div className="min-h-screen bg-white">

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setZoomOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setZoomOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            {allImages.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {zoomImg + 1} / {allImages.length}
              </div>
            )}
            {allImages.length > 1 && (
              <button
                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); setZoomImg((prev) => (prev - 1 + allImages.length) % allImages.length); }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <motion.img
              key={zoomImg}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={allImages[zoomImg]}
              alt={product.name}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {allImages.length > 1 && (
              <button
                className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); setZoomImg((prev) => (prev + 1) % allImages.length); }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setZoomImg(i); }}
                    className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${i === zoomImg ? 'border-gold-400' : 'border-white/20 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero header */}
      <div className="bg-navy-900 pt-24 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />Back to Products
          </Link>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight mt-4">
            {product.name}
          </h1>
          <Badge className="mt-3 bg-gold-500/20 text-gold-300 border-gold-500/30">{product.category}</Badge>
        </div>
      </div>

      <div id="product-detail-solid-trigger" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* Left — Images + Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Main image */}
            <div
              className="relative h-80 sm:h-96 bg-muted rounded-2xl overflow-hidden mb-3 shadow-lg cursor-zoom-in group"
              onClick={() => allImages.length > 0 && openZoom(activeImg)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x, y });
              }}
              onMouseLeave={() => setMousePos({ x: 50, y: 50 })}
            >
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-150"
                    style={{ transformOrigin: `${mousePos.x}% ${mousePos.y}%` }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3" />
                    <span>Click to zoom</span>
                  </div>
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImg((prev) => (prev - 1 + allImages.length) % allImages.length); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImg((prev) => (prev + 1) % allImages.length); }}
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

            {/* Wishlist + Share — above Product Details card */}
            <div className="flex gap-2 mb-3">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={toggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
                  ${isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'bg-white border-border text-muted-foreground hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50'}
                `}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isWishlisted ? 'filled' : 'empty'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center"
                  >
                    <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={isWishlisted ? 0 : 2} />
                  </motion.span>
                </AnimatePresence>
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </motion.button>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={handleShare}
                  aria-label="Share product"
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg border border-border bg-white text-muted-foreground text-sm font-medium hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
                <AnimatePresence>
                  {shareTooltip !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-12 right-0 bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-10"
                    >
                      {shareTooltip === 'copied' ? '🔗 Link copied!' : '✓ Shared!'}
                      <span className="absolute -top-1 right-3.5 w-2 h-2 bg-foreground rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Product Details */}
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
            <br />

            {/* Specifications table */}
            {hasSpecs && (
              <div className="bg-card rounded-xl border border-border p-6 mt-4">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Specifications</h3>
                <div className="rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications!.map((spec, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : 'bg-transparent'}>
                          <td className="px-4 py-2.5 font-semibold w-1/2" style={{ color: '#565959' }}>{spec.property}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right — Description + Enquiry */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6 sticky top-24">

            {/* Description as bullet points */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">Description</h3>
              <ul className="space-y-2">
                {descriptionLines.map((line, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-muted-foreground leading-relaxed">
                    <span className="text-gold-500 font-bold mt-0.5 text-base leading-none">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enquiry form */}
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