"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Search } from 'lucide-react';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useActiveProducts } from '@/hooks/useQueries';
import { useRouter, useParams, useSearchParams } from "next/navigation";

// ── Category config ──────────────────────────────
export const CATEGORY_LIST = [
  { label: 'Agriculture', slug: 'agriculture' },
  { label: 'Textiles', slug: 'textiles' },
  { label: 'Minerals', slug: 'minerals' },
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Food & Beverages', slug: 'food-beverages' },
  { label: 'Handicrafts', slug: 'handicrafts' },
];

function slugToLabel(slug: string): string {
  return CATEGORY_LIST.find(c => c.slug === slug)?.label ?? slug;
}

function labelToSlug(label: string): string {
  return CATEGORY_LIST.find(c => c.label === label)?.slug ??
    label.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
}

const ALL_CATEGORIES = ['All', ...CATEGORY_LIST.map(c => c.label)];

export default function ProductsPage() {

  const router = useRouter();

  // ✅ FIXED params
  const params = useParams();
  const categorySlug = Array.isArray(params?.category)
    ? params.category[0]
    : params?.category;

  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");

  // ✅ FIXED dependency
  useEffect(() => {
    if (!categorySlug && categoryQuery && categoryQuery !== 'All') {
      const slug = labelToSlug(categoryQuery);
      router.replace(`/products/${slug}`);
    }
  }, [categorySlug, categoryQuery]);

  const activeCategory = categorySlug ? slugToLabel(categorySlug) : 'All';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 16;

  const { data: products, isLoading } = useActiveProducts();

  // ✅ FIXED scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleCategoryChange = (label: string) => {
    setPage(1);
    if (label === 'All') {
      router.push('/products');
    } else {
      router.push(`/products/${labelToSlug(label)}`);
    }
  };

  const filteredProducts = (products ?? []).filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;

    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.originCountry.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-navy-900 text-white pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">
              {activeCategory !== 'All' ? `${activeCategory} Products` : 'Our Products'}
            </h1>
            <p className="text-white/60 text-lg">
              {activeCategory !== 'All'
                ? `Premium ${activeCategory} exports from India`
                : 'Explore our full catalog of quality export products'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search exports..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 rounded-full border-gray-200 bg-gray-50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center border-b border-gray-200 w-full max-w-2xl">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 ${
                  activeCategory === cat
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) =>
              <Skeleton key={i} className="h-80 rounded-xl" />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paginatedProducts.map((product, i) => (
              <motion.div key={product._id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}