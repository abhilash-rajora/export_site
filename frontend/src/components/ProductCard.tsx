import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight, DollarSign, Heart, MapPin, Package, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../api/types';

interface ProductCardProps {
  product: Product;
  hideStockBadge?: boolean;
}

const categoryColors: Record<string, string> = {
  Agriculture: 'bg-green-100 text-green-800 border-green-200',
  Textiles: 'bg-purple-100 text-purple-800 border-purple-200',
  Minerals: 'bg-stone-100 text-stone-700 border-stone-200',
  Electronics: 'bg-blue-100 text-blue-800 border-blue-200',
  'Food & Beverages': 'bg-orange-100 text-orange-800 border-orange-200',
  Handicrafts: 'bg-amber-100 text-amber-800 border-amber-200',
};

const getWishlist = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch {
    return [];
  }
};

const toggleWishlistItem = (id: string): boolean => {
  const list = getWishlist();
  const exists = list.includes(id);
  const updated = exists ? list.filter((i) => i !== id) : [...list, id];
  localStorage.setItem('wishlist', JSON.stringify(updated));
  return !exists;
};

export default function ProductCard({ product, hideStockBadge = false }: ProductCardProps) {
  const categoryStyle = categoryColors[product.category] || 'bg-muted text-muted-foreground border-border';
  const allImages = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const [currentImg, setCurrentImg] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    setWishlisted(getWishlist().includes(product._id));
  }, [product._id]);

  useEffect(() => {
    if (!hovered || allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % allImages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [hovered, allImages.length]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlistItem(product._id);
    setWishlisted(added);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product._id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, url });
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const inStock = product.inStock !== false;

  return (
    <div
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCurrentImg(0); }}
    >
      {/* Category + Stock badge */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryStyle}`}>
          {product.category}
        </span>
        {inStock && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            ● In Stock
          </span>
        )}
      </div>

      {/* Image carousel */}
      <div className="relative h-48 bg-muted overflow-hidden flex-shrink-0">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImg]}
              alt={product.name}
              className="w-full h-full object-contain transition-opacity duration-300"
              loading="lazy"
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {allImages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Wishlist + Share buttons on image */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWishlist}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-md text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
            title="Share product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {shareMsg && (
          <div className="absolute bottom-8 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
            {shareMsg}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-foreground text-sm sm:text-base leading-snug mb-1 line-clamp-3 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="space-y-1 mb-3 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span className="truncate">{product.originCountry}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span className="truncate">{product.priceRange}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span>Min. {product.minOrderQty}</span>
          </div>
        </div>
        <Link to="/products/$id" params={{ id: product._id }}>
          <Button
            size="sm"
            className="w-full bg-navy-800 hover:bg-navy-700 text-white group/btn text-xs h-8"
            disabled={!inStock}
          >
            {inStock ? (
              <>View & Enquire <ArrowRight className="w-3 h-3 ml-1.5 group-hover/btn:translate-x-1 transition-transform" /></>
            ) : (
              'Out of Stock'
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}