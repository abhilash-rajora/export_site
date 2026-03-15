import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, ImagePlus, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCreateProduct, useProductById, useUpdateProduct } from '../../hooks/useQueries';
import api from '../../api/axios';

const CATEGORIES = ['Agriculture', 'Textiles', 'Minerals', 'Electronics', 'Food & Beverages', 'Handicrafts', 'Chemicals', 'Metals', 'Plastics', 'Machinery', 'Automotive Parts', 'Pharmaceuticals', 'Furniture', 'Construction Materials', 'Energy Products', 'Consumer Goods', 'Other'];

const defaultForm = {
  name: '',
  category: '',
  description: '',
  imageUrl: '',
  images: [] as string[],
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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
        images: product.images?.length ? product.images : [],
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

  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, or WebP images allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data.url;
      setForm((prev) => {
        const updated = [...prev.images];
        if (index < updated.length) {
          updated[index] = uploadedUrl;
        } else {
          updated.push(uploadedUrl);
        }
        return { ...prev, images: updated };
      });
      toast.success('Image uploaded successfully.');
    } catch {
      toast.error('Failed to upload image. Try again.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleFilePick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddUrl = () => {
    const trimmed = pendingUrl.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
    setPendingUrl('');
    setUrlMode(false);
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
    const cleanSpecs = form.specifications.filter(s => s.property.trim() !== '' && s.value.trim() !== '');
    const data = {
      name: form.name,
      category: form.category,
      description: form.description,
      imageUrl: form.images[0] || '',
      images: form.images,
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
            <Label className="text-sidebar-foreground text-sm font-medium">Description <span className="text-destructive">*</span></Label>
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

          {/* Specifications */}
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
                    <Input placeholder="e.g. Color" value={spec.property} onChange={(e) => handleSpecChange(index, 'property', e.target.value)} className="bg-transparent border-0 text-sidebar-foreground placeholder:text-sidebar-foreground/20 h-8 text-sm focus-visible:ring-0 px-2" />
                  </div>
                  <div className="p-1.5 border-r border-sidebar-border/50">
                    <Input placeholder="e.g. Red" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="bg-transparent border-0 text-sidebar-foreground placeholder:text-sidebar-foreground/20 h-8 text-sm focus-visible:ring-0 px-2" />
                  </div>
                  <div className="flex items-center justify-center w-10">
                    <button type="button" onClick={() => removeSpecRow(index)} className="text-sidebar-foreground/30 hover:text-destructive transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Images ── */}
          <div className="space-y-3">
            <div>
              <Label className="text-sidebar-foreground text-sm font-medium">
                Product Images <span className="text-sidebar-foreground/40 font-normal">(up to 5)</span>
              </Label>
              <p className="text-sidebar-foreground/40 text-xs mt-0.5">Upload a file or paste an image URL</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Existing images */}
              {form.images.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5 border border-sidebar-border">
                  <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1.5 left-1.5 bg-gold-500 text-navy-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      Cover
                    </div>
                  )}
                </div>
              ))}

              {/* Upload / URL slot */}
              {form.images.length < 5 && (
                <div className={`rounded-2xl border-2 border-dashed border-sidebar-border flex flex-col overflow-hidden transition-all duration-200 hover:border-gold-400/60 ${form.images.length === 0 ? 'col-span-3 h-48' : 'aspect-square'}`}>
                  {/* Tabs */}
                  <div className="flex border-b border-sidebar-border flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setUrlMode(false)}
                      className={`flex-1 text-xs font-semibold py-2 transition-colors ${!urlMode ? 'bg-white/10 text-gold-400' : 'text-sidebar-foreground/30 hover:text-sidebar-foreground/60'}`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlMode(true)}
                      className={`flex-1 text-xs font-semibold py-2 transition-colors ${urlMode ? 'bg-white/10 text-gold-400' : 'text-sidebar-foreground/30 hover:text-sidebar-foreground/60'}`}
                    >
                      URL
                    </button>
                  </div>

                  {!urlMode ? (
                    <button
                      type="button"
                      onClick={() => handleFilePick(form.images.length)}
                      disabled={uploadingIndex !== null}
                      className="flex-1 flex flex-col items-center justify-center gap-3 text-sidebar-foreground/40 hover:text-gold-400 hover:bg-white/5 transition-all group"
                    >
                      {uploadingIndex === form.images.length ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
                          <span className="text-xs font-medium">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-sidebar-border group-hover:border-gold-400/50 group-hover:bg-gold-400/5 flex items-center justify-center transition-all">
                            <ImagePlus className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold">Click to upload</p>
                            <p className="text-xs text-sidebar-foreground/30 mt-0.5">JPG, PNG, WebP · Max 5MB</p>
                          </div>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-5">
                      <div className="w-full">
                        <p className="text-xs text-sidebar-foreground/50 mb-2 font-medium">Paste an image URL below</p>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={pendingUrl}
                          onChange={(e) => setPendingUrl(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                          className="w-full bg-white/5 border border-sidebar-border rounded-xl px-3 py-2 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:border-gold-400 transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-bold py-2 rounded-xl transition-colors"
                      >
                        Add Image
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden file inputs */}
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                ref={(el) => { fileInputRefs.current[index] = el; }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, index);
                  e.target.value = '';
                }}
              />
            ))}
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