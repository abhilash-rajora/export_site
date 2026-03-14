import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCreateProduct, useProductById, useUpdateProduct } from '../../hooks/useQueries';

const CATEGORIES = ['Agriculture', 'Textiles', 'Minerals', 'Electronics', 'Food & Beverages', 'Handicrafts', 'Chemicals', 'Metals', 'Plastics', 'Machinery', 'Automotive Parts', 'Pharmaceuticals', 'Furniture', 'Construction Materials', 'Energy Products', 'Consumer Goods', 'Other'];

const defaultForm = {
  name: '',
  category: '',
  description: '',
  imageUrl: '',
  images: [''],
  specifications: [{ property: '', value: '' }],
  originCountry: '',
  minOrderQty: '',
  priceRange: '',
};

export default function AdminProductFormPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params.id;
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);

  const { data: product, isLoading: isLoadingProduct } = useProductById(id ?? '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        images: product.images?.length ? product.images : [''],
        specifications: product.specifications?.length ? product.specifications : [{ property: '', value: '' }],
        originCountry: product.originCountry,
        minOrderQty: String(product.minOrderQty),
        priceRange: product.priceRange,
      });
    }
  }, [isEdit, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    if (form.images.length < 5) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index: number) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: updated.length ? updated : [''] }));
  };

  const handleSpecChange = (index: number, field: 'property' | 'value', value: string) => {
    const updated = [...form.specifications];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, specifications: updated }));
  };

  const addSpecRow = () => {
    setForm((prev) => ({ ...prev, specifications: [...prev.specifications, { property: '', value: '' }] }));
  };

  const removeSpecRow = (index: number) => {
    const updated = form.specifications.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, specifications: updated.length ? updated : [{ property: '', value: '' }] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.description || !form.originCountry || !form.minOrderQty || !form.priceRange) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const cleanImages = form.images.filter(url => url.trim() !== '');
    const cleanSpecs = form.specifications.filter(s => s.property.trim() !== '' && s.value.trim() !== '');
    const data = {
      name: form.name,
      category: form.category,
      description: form.description,
      imageUrl: cleanImages[0] || form.imageUrl || '',
      images: cleanImages,
      specifications: cleanSpecs,
      originCountry: form.originCountry,
      minOrderQty: Number(form.minOrderQty),
      priceRange: form.priceRange,
    };
    try {
      if (isEdit && id) {
        await updateProduct.mutateAsync({ id, ...data });
        toast.success('Product updated successfully.');
      } else {
        await createProduct.mutateAsync(data);
        toast.success('Product created successfully.');
      }
      navigate({ to: '/admin/products' });
    } catch {
      toast.error(isEdit ? 'Failed to update product.' : 'Failed to create product.');
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  if (isEdit && isLoadingProduct) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48 bg-white/10" />
        <Skeleton className="h-96 rounded-xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors text-sm mb-4">
          <ChevronLeft className="w-4 h-4" />Back to Products
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-sidebar-foreground tracking-tight">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-sidebar-foreground/50 mt-1">
          {isEdit ? 'Update the product details below' : 'Fill in the details to create a new product listing'}
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 rounded-xl border border-sidebar-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-sidebar-foreground text-sm font-medium">Product Name <span className="text-destructive">*</span></Label>
            <Input name="name" placeholder="e.g. Organic Basmati Rice" value={form.name} onChange={handleChange} required className="bg-white/5 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30" />
          </div>

          {/* Category + Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sidebar-foreground text-sm font-medium">Category <span className="text-destructive">*</span></Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="bg-white/5 border-sidebar-border text-sidebar-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-sidebar-border shadow-lg">
                  {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sidebar-foreground text-sm font-medium">Origin Country <span className="text-destructive">*</span></Label>
              <Input name="originCountry" placeholder="e.g. India" value={form.originCountry} onChange={handleChange} required className="bg-white/5 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sidebar-foreground text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <p className="text-sidebar-foreground/40 text-xs">Each line will be shown as a bullet point. Press Enter for a new point.</p>
            <Textarea
              name="description"
              placeholder={`Premium quality product\nAvailable in bulk quantities\nSustainably sourced`}
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              className="bg-white/5 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30 font-mono text-sm"
            />
            {/* Preview */}
            {form.description && (
              <div className="bg-white/5 rounded-lg p-3 border border-sidebar-border/50">
                <p className="text-sidebar-foreground/40 text-xs mb-2 uppercase tracking-widest">Preview</p>
                <ul className="space-y-1">
                  {form.description.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-sidebar-foreground/80">
                      <span className="text-gold-400 mt-0.5">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sidebar-foreground text-sm font-medium">Specifications</Label>
                <p className="text-sidebar-foreground/40 text-xs mt-0.5">Add product specifications like size, weight, color, etc.</p>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={addSpecRow} className="text-gold-400 hover:text-gold-300 hover:bg-white/5 text-xs h-7">
                <Plus className="w-3 h-3 mr-1" /> Add Row
              </Button>
            </div>
            <div className="rounded-lg border border-sidebar-border overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_auto] bg-white/5 border-b border-sidebar-border">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">Property</div>
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">Value</div>
                <div className="w-10" />
              </div>
              {form.specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] border-b border-sidebar-border/50 last:border-b-0">
                  <div className="p-1.5 border-r border-sidebar-border/50">
                    <Input
                      placeholder="e.g. Color"
                      value={spec.property}
                      onChange={(e) => handleSpecChange(index, 'property', e.target.value)}
                      className="bg-transparent border-0 text-sidebar-foreground placeholder:text-sidebar-foreground/20 h-8 text-sm focus-visible:ring-0 px-2"
                    />
                  </div>
                  <div className="p-1.5 border-r border-sidebar-border/50">
                    <Input
                      placeholder="e.g. Red"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="bg-transparent border-0 text-sidebar-foreground placeholder:text-sidebar-foreground/20 h-8 text-sm focus-visible:ring-0 px-2"
                    />
                  </div>
                  <div className="flex items-center justify-center w-10">
                    <button
                      type="button"
                      onClick={() => removeSpecRow(index)}
                      className="text-sidebar-foreground/30 hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sidebar-foreground text-sm font-medium">Product Images <span className="text-sidebar-foreground/40 font-normal">(up to 5)</span></Label>
              {form.images.length < 5 && (
                <Button type="button" size="sm" variant="ghost" onClick={addImageField} className="text-gold-400 hover:text-gold-300 hover:bg-white/5 text-xs h-7">
                  <Plus className="w-3 h-3 mr-1" /> Add Image
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {form.images.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Image URL ${index + 1}`}
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="bg-white/5 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30"
                    />
                    {form.images.length > 1 && (
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeImageField(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-9 w-9 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {url && (
                    <div className="h-24 rounded-lg overflow-hidden bg-sidebar-accent">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MOQ + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sidebar-foreground text-sm font-medium">Minimum Order Quantity <span className="text-destructive">*</span></Label>
              <Input name="minOrderQty" type="number" min="1" placeholder="e.g. 100" value={form.minOrderQty} onChange={handleChange} required className="bg-white/5 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sidebar-foreground text-sm font-medium">Price Range <span className="text-destructive">*</span></Label>
              <Input name="priceRange" placeholder="e.g. $2 - $5 per kg" value={form.priceRange} onChange={handleChange} required className="bg-white/5 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending} className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold shadow-gold">
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEdit ? 'Updating...' : 'Creating...'}</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />{isEdit ? 'Save Changes' : 'Create Product'}</>
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: '/admin/products' })} className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5">
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}