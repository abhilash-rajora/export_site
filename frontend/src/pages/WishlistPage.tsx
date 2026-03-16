import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useActiveProducts } from '../hooks/useQueries';

const getWishlist = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch {
    return [];
  }
};

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { data: allProducts } = useActiveProducts();

  useEffect(() => {
    setWishlistIds(getWishlist());
  }, []);

  const wishlistProducts = (allProducts ?? []).filter((p) => wishlistIds.includes(p._id));

  const clearWishlist = () => {
    localStorage.removeItem('wishlist');
    setWishlistIds([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 pt-24 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400 fill-current" />
                </div>
                <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
                  My Wishlist
                </h1>
              </div>
              <p className="text-white/50 text-sm">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'product' : 'products'} saved
              </p>
            </div>
            {wishlistProducts.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-red-300" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-800 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Browse our products and save the ones you like.</p>
            <Link to="/products">
              <Button className="bg-navy-900 hover:bg-navy-800 text-white px-8">
                Browse Products <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}