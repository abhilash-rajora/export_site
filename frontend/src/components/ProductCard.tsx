import { Link } from '@tanstack/react-router';
import { Heart, Package, Share2, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import type { Product } from '../api/types';
import { cn } from '@/utils/utils';
import { useNavigate } from '@tanstack/react-router';

interface ProductCardProps {
  product: Product;
  hideStockBadge?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Agriculture:        { bg: 'bg-green-50',  text: 'text-green-700'  },
  Textiles:           { bg: 'bg-purple-50', text: 'text-purple-700' },
  Minerals:           { bg: 'bg-stone-50',  text: 'text-stone-600'  },
  Electronics:        { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  'Food & Beverages': { bg: 'bg-orange-50', text: 'text-orange-700' },
  Handicrafts:        { bg: 'bg-amber-50',  text: 'text-amber-700'  },
};

const getWishlist = (): string[] => {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
};
const toggleWishlistItem = (id: string): boolean => {
  const list = getWishlist();
  const exists = list.includes(id);
  localStorage.setItem('wishlist', JSON.stringify(exists ? list.filter(i => i !== id) : [...list, id]));
  return !exists;
};

// React.memo prevents re-render when parent re-renders with same props
const ProductCard = React.memo(function ProductCard({ product, hideStockBadge = false }: ProductCardProps) {
  const cat = categoryColors[product.category] || { bg: 'bg-gray-50', text: 'text-gray-600' };
  const allImages = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const [currentImg, setCurrentImg] = useState(0);
  const [hovered, setHovered]       = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareMsg, setShareMsg]     = useState('');
  const navigate = useNavigate();
  const inStock = product.inStock !== false;

  useEffect(() => { setWishlisted(getWishlist().includes(product._id)); }, [product._id]);

  useEffect(() => {
    if (!hovered || allImages.length <= 1) return;
    const t = setInterval(() => setCurrentImg(p => (p + 1) % allImages.length), 1200);
    return () => clearInterval(t);
  }, [hovered, allImages.length]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlisted(toggleWishlistItem(product._id));
  }, [product._id]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/products/${product._id}`;
    navigator.share ? navigator.share({ title: product.name, url })
      : (navigator.clipboard.writeText(url), setShareMsg('Copied ✔'), setTimeout(() => setShareMsg(''), 2000));
  }, [product._id, product.name]);

  return (
    <Link to="/products/detail/$id" params={{ id: product._id }} className="block h-full">
    <div
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full',
        'border border-gray-200 transition-all duration-300 cursor-pointer',
        'hover:-translate-y-1 hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12)] hover:border-gray-300',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCurrentImg(0); }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden flex-shrink-0 bg-gray-100" style={{ aspectRatio: '4/3' }}>
        {allImages.length > 0 ? (
          <img src={allImages[currentImg]} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}

        {/* Verified badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-400 text-amber-900 px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase">
          <ShieldCheck className="w-2.5 h-2.5" />Verified
        </div>

        {/* Out of stock */}
        {!inStock && !hideStockBadge && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Image dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {allImages.map((_, i) => (
              <div key={i} className={cn('rounded-full transition-all', i === currentImg ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50')} />
            ))}
          </div>
        )}

        {/* Wishlist + Share */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button onClick={handleWishlist}
            className={cn('w-6 h-6 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all',
              wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500')}>
            <Heart className={cn('w-3 h-3', wishlisted && 'fill-current')} />
          </button>
          <button onClick={handleShare}
            className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md text-gray-500 hover:text-blue-500 transition-all">
            <Share2 className="w-3 h-3" />
          </button>
          {shareMsg && <span className="bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded text-center">{shareMsg}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">

        {/* Category + Origin */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn('text-[11px] font-bold tracking-widest uppercase', cat.text)}>{product.category}</span>
          <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">🌍 {product.originCountry}</span>
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-sm leading-snug text-gray-900 mb-2 line-clamp-2 group-hover:text-navy-800 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-1.5">
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Price Range</p>
          <p className="text-lg font-black text-gray-900 leading-none">{product.priceRange}</p>
        </div>

        {/* Min order */}
        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">
          Min Order: <span className="text-gray-700 font-semibold">{product.minOrderQty}</span>
        </p>

        {/* Buttons */}
        <div className="mt-auto">
          <button disabled={!inStock}
            onClick={e => { e.preventDefault(); e.stopPropagation(); if (!inStock) return; navigate({ to: '/enquiry', search: { productName: product.name } }); }}
            className={cn('w-full py-2 rounded-xl text-xs font-bold tracking-wide transition-all',
              inStock ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed')}>
            {inStock ? 'Quick Enquiry' : 'Out of Stock'}
          </button>

        </div>
      </div>
    </div>
    </Link>
  );
});

export default ProductCard;