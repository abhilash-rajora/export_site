import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight, DollarSign, Heart, Package, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../api/types';
import { cn } from '@/utils/utils';
import { useNavigate } from '@tanstack/react-router';

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
  const navigate = useNavigate();

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
      setShareMsg('Link copied ✔');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const inStock = product.inStock !== false;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-border/60 overflow-hidden flex flex-col h-full
                 transition-all duration-300 ease-out
                 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] hover:border-border"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCurrentImg(0); }}
    >
      {/* Subtle top gold line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Category + Stock badge */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${categoryStyle}`}>
          {product.category}
        </span>
        {!hideStockBadge && (
          inStock ? (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              ● In Stock
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
              Out of Stock
            </span>
          )
        )}
      </div>

      {/* Image */}
      <div className="relative mx-3 mt-3 h-44 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl overflow-hidden flex-shrink-0">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImg]}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {allImages.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentImg ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Wishlist + Share */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleWishlist}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 ${
              wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500'
            }`}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
            title="Share product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {shareMsg && (
          <div className="absolute bottom-8 right-2 bg-black/75 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
            {shareMsg}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-sm sm:text-[15px] leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] text-gray-900 group-hover:text-navy-800 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Meta info */}
        <div className="space-y-1.5 mb-4 mt-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>🌍</span>
            <span className="truncate">{product.originCountry}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <DollarSign className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span className="truncate font-semibold text-navy-800">{product.priceRange}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span>Min. {product.minOrderQty}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 mb-3" />

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Quick Enquiry */}
          <Button
            size="sm"
            disabled={!inStock}
            className={cn(
              "w-1/2 font-semibold text-[10px] sm:text-xs h-9 rounded-xl transition-all duration-200 px-1 truncate",
              inStock
                ? "bg-navy-800 hover:bg-navy-700 text-white shadow-sm hover:shadow-md"
                : "bg-gray-300 text-gray-800 cursor-not-allowed border border-gray-200"
            )}
            onClick={(e) => {
              e.preventDefault();
              if (!inStock) return;
              navigate({ to: '/enquiry', search: { productName: product.name } });
            }}
          >
            {inStock ? "Enquiry" : "Out of Stock"}
          </Button>

          {/* View */}
          <Link to="/products/$id" params={{ id: product._id }} className="w-1/2">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-[10px] sm:text-xs h-9 rounded-xl border-navy-800/20 text-navy-800 hover:bg-navy-50 hover:border-navy-800/40 transition-all duration-200 group/btn px-1"
            >
              View
              <ArrowRight className="ml-1 w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}