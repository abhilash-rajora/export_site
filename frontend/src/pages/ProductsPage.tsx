import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { Package, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import { useActiveProducts } from '../hooks/useQueries';
import useSeo from '../hooks/useSeo';

// ── Category config (single source of truth) ──────────────────────────────
export const CATEGORY_LIST = [
  { label: 'Agriculture',      slug: 'agriculture' },
  { label: 'Textiles',         slug: 'textiles' },
  { label: 'Minerals',         slug: 'minerals' },
  { label: 'Electronics',      slug: 'electronics' },
  { label: 'Food & Beverages', slug: 'food-beverages' },
  { label: 'Handicrafts',      slug: 'handicrafts' },
];

// slug → display label   e.g. "food-beverages" → "Food & Beverages"
function slugToLabel(slug: string): string {
  return CATEGORY_LIST.find(c => c.slug === slug)?.label ?? slug;
}

// display label → slug   e.g. "Food & Beverages" → "food-beverages"
function labelToSlug(label: string): string {
  return CATEGORY_LIST.find(c => c.label === label)?.slug ?? label.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
}

const ALL_CATEGORIES = ['All', ...CATEGORY_LIST.map(c => c.label)];

export default function ProductsPage() {
  // Base SEO (overridden per-category below via Helmet)
  useSeo('products', 'Our Products | Explore Our Export Catalog');

  const navigate = useNavigate();

  // ── Read category from CLEAN URL param: /products/:category ──────────────
  const { category: categorySlug } = useParams({ strict: false }) as { category?: string };

  // ── Legacy support: read ?category= query param then redirect to clean URL ─
  const searchParams = useSearch({ strict: false }) as { category?: string };

  useEffect(() => {
    // If someone opens /products?category=Agriculture → redirect to /products/agriculture
    if (!categorySlug && searchParams.category && searchParams.category !== 'All') {
      const slug = labelToSlug(searchParams.category);
      navigate({ to: '/products/$category', params: { category: slug }, replace: true });
    }
  }, [categorySlug, searchParams.category]);

  // ── Active category label ─────────────────────────────────────────────────
  const activeCategory = categorySlug ? slugToLabel(categorySlug) : 'All';

  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useActiveProducts();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // ── Category change → navigate to clean URL ───────────────────────────────
  const handleCategoryChange = (label: string) => {
    if (label === 'All') {
      navigate({ to: '/products' });
    } else {
      navigate({ to: '/products/$category', params: { category: labelToSlug(label) } });
    }
  };

  const filteredProducts = (products ?? []).filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.originCountry.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ── Per-category SEO meta ─────────────────────────────────────────────────
  const metaTitle = activeCategory !== 'All'
    ? `${activeCategory} Export Products from India | WExports`
    : 'Export Products from India | WExports';

  const metaDesc = activeCategory !== 'All'
    ? `Buy premium ${activeCategory} products exported from India. Verified supplier, competitive pricing, global delivery. Get a free quote today.`
    : 'Explore WExports full catalog — Agriculture, Textiles, Minerals, Electronics, Food & Beverages, Handicrafts and more. India\'s trusted export platform.';

  const canonicalUrl = activeCategory !== 'All'
    ? `https://wexports.vercel.app/products/${labelToSlug(activeCategory)}`
    : 'https://wexports.vercel.app/products';

  return (
    <div className="min-h-screen bg-white">

      {/* ── Dynamic SEO per category ── */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={`${activeCategory.toLowerCase()} export india, india exporter, buy ${activeCategory.toLowerCase()}, wexports`} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="bg-navy-900 text-white pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">
              {activeCategory !== 'All' ? `${activeCategory} Products` : 'Our Products'}
            </h1>
            <p className="text-white/60 text-lg">
              {activeCategory !== 'All'
                ? `Premium ${activeCategory} exports from India — quality assured, globally delivered.`
                : 'Explore our full catalog of quality export products'}
            </p>
          </motion.div>
        </div>
      </div>

      <div id="products-solid-trigger" className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            {ALL_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-card text-foreground border-border hover:border-navy-300 hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {search || activeCategory !== 'All' ? 'Try adjusting your search or filters.' : 'Products will appear here once added.'}
            </p>
            {(search || activeCategory !== 'All') && (
              <Button variant="outline" onClick={() => { setSearch(''); handleCategoryChange('All'); }}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={product} hideStockBadge={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <div id="products-transparent-trigger" />
    </div>
  );
}