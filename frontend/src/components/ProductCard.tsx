import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight, DollarSign, Heart, MapPin, Package, Share2 } from 'lucide-react';
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
      setShareMsg('Product link copied ✔');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const inStock = product.inStock !== false;

  return (
    
    <div
      className="group bg-white rounded-xl border border-border will-change-transform overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] flex flex-col h-full"
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
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
        
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImg]}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
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
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
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
        <h3 className="font-display font-bold text-sm sm:text-base leading-snug mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-navy-800 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="space-y-1 mb-3 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-xs">🌍</span>
            <span className="truncate">{product.originCountry}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span className="truncate font-semibold text-navy-800">
              {product.priceRange}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span>Min. {product.minOrderQty}</span>
          </div>
        </div>

        
          <div className="flex gap-2 mt-2">

            {/* Quick Enquiry / Out of Stock */}
            <Button
              size="sm"
              disabled={!inStock}
              className={cn(
                "w-1/2 font-semibold text-xs h-9",
                inStock
                  ? "bg-navy-800 hover:bg-navy-700 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-600 cursor-not-allowed"
              )}
             onClick={(e) => {
                e.preventDefault();
                if (!inStock) return;
                navigate({ to: '/enquiry', search: { productName: product.name } });
              }}
            >
              {inStock ? "Quick Enquiry" : "Out of Stock"}
            </Button>

            {/* View Button */}
            <Link to="/products/$id" params={{ id: product._id }} className="w-1/2">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs h-9 border-navy-800 text-navy-800 hover:bg-navy-50"
              >
                View
                <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

          </div>
      </div>
    </div>
  );
}