'use client';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Loader2, Package, Pencil, Plus, Search, Star, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useState } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/api/types';
import { useAllProducts, useDeleteProduct, useToggleProductActive } from '@/hooks/useQueries';
import api from '@/api/axios';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useAllProducts();
  const deleteProduct = useDeleteProduct();
  const toggleActive = useToggleProductActive();
  const queryClient = useQueryClient();
  const [togglingStock, setTogglingStock] = useState<string | null>(null);
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);

  const filtered = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct.mutateAsync(product._id);
      toast.success(`"${product.name}" deleted successfully.`);
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      await toggleActive.mutateAsync(product._id);
      toast.success(`"${product.name}" ${product.isActive ? 'deactivated' : 'activated'}.`);
    } catch {
      toast.error('Failed to update product status.');
    }
  };

  const handleToggleStock = async (product: Product) => {
    setTogglingStock(product._id);
    try {
      await api.put(`/products/${product._id}`, { ...product, inStock: !product.inStock });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`"${product.name}" marked as ${!product.inStock ? 'In Stock' : 'Out of Stock'}.`);
    } catch {
      toast.error('Failed to update stock status.');
    } finally {
      setTogglingStock(null);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    setTogglingFeatured(product._id);
    const newVal = !product.isFeatured;
    try {
      await api.put(`/products/${product._id}`, { isFeatured: newVal });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['homepage-products'] });
      toast.success(newVal ? `⭐ "${product.name}" added to Featured!` : `"${product.name}" removed from Featured.`);
    } catch {
      toast.error('Failed to update featured status.');
    } finally {
      setTogglingFeatured(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-black/80 tracking-tight">Products</h1>
          <p className="text-sidebar-foreground/50 mt-1">Manage your export product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold shadow-gold">
            <Plus className="w-4 h-4 mr-2" />Add Product
          </Button>
        </Link>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/5 border-sidebar-border text-sidebar-foreground/60 placeholder:text-sidebar-foreground/30"
        />
      </div>

      <div className="bg-white/5 rounded-xl border border-sidebar-border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg bg-white/5" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-10 h-10 text-sidebar-foreground/50 mx-auto mb-3" />
            <p className="text-sidebar-foreground/50 font-medium">
              {search ? 'No products match your search.' : 'No products yet.'}
            </p>
            {!search && (
              <Link href="/admin/products/new" className="mt-4 inline-block">
                <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-900 mt-4">
                  <Plus className="w-4 h-4 mr-2" />Add First Product
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sidebar-border">
                  {['Product', 'Category', 'Origin', 'Price', 'Status', 'Stock', 'Featured', 'Actions'].map((h, i) => (
                    <th key={h}
                      className={`${i === 7 ? 'text-right px-6' : i === 0 ? 'text-left px-6' : 'text-left px-4'} py-3 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sidebar-border">
                {filtered.map((product, i) => (
                  <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sidebar-accent overflow-hidden flex-shrink-0">
                          {product.imageUrl
                            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-sidebar-foreground/60" /></div>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sidebar-foreground/60 text-sm">{product.name}</p>
                          <p className="text-sidebar-foreground/50 text-xs">Min. {product.minOrderQty} units</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><span className="text-sidebar-foreground/70 text-sm">{product.category}</span></td>
                    <td className="px-4 py-4"><span className="text-sidebar-foreground/70 text-sm">{product.originCountry}</span></td>
                    <td className="px-4 py-4"><span className="text-sidebar-foreground/70 text-sm">{product.priceRange}</span></td>
                    <td className="px-4 py-4">
                      <Badge className={product.isActive ? 'bg-green-500/15 text-green-400 border-green-500/30 text-xs' : 'bg-red-500/15 text-red-400 border-red-500/30 text-xs'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => handleToggleStock(product)} disabled={togglingStock === product._id}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200 ${product.inStock !== false ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25' : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'}`}>
                        {togglingStock === product._id ? <Loader2 className="w-3 h-3 animate-spin" /> : product.inStock !== false ? '● In Stock' : '● Out of Stock'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => handleToggleFeatured(product)} disabled={togglingFeatured === product._id}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200 ${product.isFeatured ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 hover:bg-gold-500/30' : 'bg-white/5 text-sidebar-foreground/30 border border-white/10 hover:bg-gold-500/10 hover:text-gold-400 hover:border-gold-500/30'}`}>
                        {togglingFeatured === product._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Star className={`w-3 h-3 ${product.isFeatured ? 'fill-current' : ''}`} />}
                        {product.isFeatured ? 'Featured' : 'Feature'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button type="button" onClick={() => handleToggle(product)} disabled={toggleActive.isPending}
                          className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/10 transition-colors">
                          {toggleActive.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : product.isActive ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/products/${product._id}/edit`}>
                          <button type="button" className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button type="button" className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border border-gray-200 shadow-xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900">Delete Product</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-100">Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700 border-0" onClick={() => handleDelete(product)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!isLoading && products && (
        <p className="text-sidebar-foreground/30 text-xs mt-4">{filtered.length} of {products.length} products</p>
      )}
    </div>
  );
}