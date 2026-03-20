import { Link } from '@tanstack/react-router';
import { ArrowRight, DollarSign, Heart, Package, Share2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../api/types';
import { cn } from '@/utils/utils';
import { useNavigate } from '@tanstack/react-router';

interface ProductCardProps {
  product: Product;
  hideStockBadge?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Agriculture:       { bg: 'bg-green-50',  text: 'text-green-700'  },
  Textiles:          { bg: 'bg-purple-50', text: 'text-purple-700' },
  Minerals:          { bg: 'bg-stone-50',  text: 'text-stone-600'  },
  Electronics:       { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  'Food & Beverages':{ bg: 'bg-orange-50', text: 'text-orange-700' },
  Handicrafts:       { bg: 'bg-amber-50',  text: 'text-amber-700'  },
};

const getWishlist = (): string[] => {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
  catch { return []; }
};

const toggleWishlistItem = (id: string): boolean => {
  const list = getWishlist();
  const exists = list.includes(id);
  const updated = exists ? list.filter((i) => i !== id) : [...list, id];
  localStorage.setItem('wishlist', JSON.stringify(updated));
  return !exists;
};

export default function ProductCard({ product, hideStockBadge = false }: ProductCardProps) {
  const cat = categoryColors[product.category] || { bg: 'bg-gray-50', text: 'text-gray-600' };
  const allImages = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const [currentImg, setCurrentImg] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const navigate = useNavigate();
  const inStock = product.inStock !== false;

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
    e.preventDefault(); e.stopPropagation();
    setWishlisted(toggleWishlistItem(product._id));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/products/${product._id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, url });
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg('Copied ✔');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full',
        'border border-gray-200',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.14)] hover:border-gray-300',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCurrentImg(0); }}
    >
      {/* ── IMAGE BLOCK ── */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden flex-shrink-0">
        {allImages.length > 0 ? (
          <img
            src={allImages[currentImg]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* VERIFIED SUPPLIER badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-400 text-amber-900 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase shadow-sm">
          <ShieldCheck className="w-3 h-3" />
          Verified Supplier
        </div>

        {/* Out of stock overlay */}
        {!inStock && !hideStockBadge && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1">
            {allImages.map((_, i) => (
              <div key={i} className={cn(
                'rounded-full transition-all duration-300',
                i === currentImg ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
              )} />
            ))}
          </div>
        )}

        {/* Wishlist + Share — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleWishlist}
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200',
              wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500'
            )}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('w-3.5 h-3.5', wishlisted && 'fill-current')} />
          </button>
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
            title="Share product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          {shareMsg && (
            <span className="bg-black/75 text-white text-[10px] px-2 py-0.5 rounded-md text-center">
              {shareMsg}
            </span>
          )}
        </div>
      </div>

      {/* ── CONTENT BLOCK ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">

        {/* Category + Origin row */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn('text-[10px] font-bold tracking-widest uppercase', cat.text)}>
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 tracking-wider uppercase">
            🌍 {product.originCountry}
          </span>
        </div>

        {/* Product name */}
        <h3 className="font-display font-extrabold text-base sm:text-lg leading-snug text-gray-900 mb-3 line-clamp-2 min-h-[2.75rem] group-hover:text-navy-800 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
            Price Range
          </p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
            {product.priceRange}
          </p>
        </div>

        {/* Min order */}
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-4">
          Min Order: <span className="text-gray-600">{product.minOrderQty}</span>
        </p>

        {/* Spacer */}
        <div className="mt-auto space-y-2">
          {/* Quick Enquiry — dark filled */}
          <button
            disabled={!inStock}
            onClick={(e) => {
              e.preventDefault();
              if (!inStock) return;
              navigate({ to: '/enquiry', search: { productName: product.name } });
            }}
            className={cn(
              'w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200',
              inStock
                ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            {inStock ? 'Quick Enquiry' : 'Out of Stock'}
          </button>

          {/* View Details — outlined */}
          <Link to="/products/detail/$id" params={{ id: product._id }} className="block">
            <button className="w-full py-2.5 rounded-xl text-sm font-bold tracking-wide border-2 border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all duration-200 active:scale-[.98] flex items-center justify-center gap-1.5">
              View Details
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}