import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight, DollarSign, MapPin, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../api/types';

interface ProductCardProps {
  product: Product;
}

const categoryColors: Record<string, string> = {
  Agriculture: 'bg-green-100 text-green-800 border-green-200',
  Textiles: 'bg-purple-100 text-purple-800 border-purple-200',
  Minerals: 'bg-stone-100 text-stone-700 border-stone-200',
  Electronics: 'bg-blue-100 text-blue-800 border-blue-200',
  'Food & Beverages': 'bg-orange-100 text-orange-800 border-orange-200',
  Handicrafts: 'bg-amber-100 text-amber-800 border-amber-200',
};

export default function ProductCard({ product }: ProductCardProps) {
  const categoryStyle = categoryColors[product.category] || 'bg-muted text-muted-foreground border-border';
  const allImages = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const [currentImg, setCurrentImg] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered || allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % allImages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [hovered, allImages.length]);

  return (
    <div
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCurrentImg(0); }}
    >

      <div className="px-3 pt-3">
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryStyle}`}>
      {product.category}
    </span>
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
            {/* Dot indicators */}
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
        
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-foreground text-sm sm:text-base leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
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
          <Button size="sm" className="w-full bg-navy-800 hover:bg-navy-700 text-white group/btn text-xs h-8">
            View & Enquire
            <ArrowRight className="w-3 h-3 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}