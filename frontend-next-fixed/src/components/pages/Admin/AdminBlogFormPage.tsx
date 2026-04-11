'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft, Plus, Trash2, Image, Video, ChevronUp, ChevronDown } from 'lucide-react';
import { useCreateBlog, useUpdateBlog, useBlogById, BLOG_CATEGORIES, BlogSection } from '../../../hooks/useBlogs';

const emptySection = (): BlogSection => ({
  heading: '', content: '', images: [], videoUrl: '',
});

export default function AdminBlogFormPage() {
  const params = useParams();
const id = params?.id as string | undefined;
 const router = useRouter();
  const isEdit = !!id;

  const { data: existingBlog, isLoading: blogLoading } = useBlogById(id ?? '');
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [form, setForm] = useState({
    title:       '',
    excerpt:     '',
    coverImage:  '',
    author:      'WExports Team',
    category:    'Export Tips',
    tags:        '',
    isPublished: false,
    isFeatured:  false,
  });

  const [sections, setSections] = useState<BlogSection[]>([emptySection()]);

  // Load existing blog data on edit
  useEffect(() => {
    if (existingBlog) {
      setForm({
        title:       existingBlog.title,
        excerpt:     existingBlog.excerpt ?? '',
        coverImage:  existingBlog.coverImage ?? '',
        author:      existingBlog.author ?? 'WExports Team',
        category:    existingBlog.category,
        tags:        existingBlog.tags?.join(', ') ?? '',
        isPublished: existingBlog.isPublished,
        isFeatured:  existingBlog.isFeatured,
      });
      setSections(
        existingBlog.sections?.length > 0
          ? existingBlog.sections.map(s => ({
              heading:  s.heading ?? '',
              content:  s.content ?? '',
              images:   s.images ?? [],
              videoUrl: s.videoUrl ?? '',
            }))
          : [emptySection()]
      );
    }
  }, [existingBlog]);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  // ── Section helpers ───────────────────────────────────────────
  const updateSection = (i: number, field: keyof BlogSection, value: any) => {
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const addImageToSection = (i: number, url: string) => {
    if (!url.trim()) return;
    setSections(prev => prev.map((s, idx) =>
      idx === i ? { ...s, images: [...(s.images ?? []), url.trim()] } : s
    ));
  };

  const removeImageFromSection = (sectionIdx: number, imgIdx: number) => {
    setSections(prev => prev.map((s, idx) =>
      idx === sectionIdx ? { ...s, images: s.images.filter((_, ii) => ii !== imgIdx) } : s
    ));
  };

  const addSection = () => setSections(prev => [...prev, emptySection()]);
  const removeSection = (i: number) => setSections(prev => prev.filter((_, idx) => idx !== i));
  const moveSection = (i: number, dir: 'up' | 'down') => {
    setSections(prev => {
      const arr = [...prev];
      const swap = dir === 'up' ? i - 1 : i + 1;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[i], arr[swap]] = [arr[swap], arr[i]];
      return arr;
    });
  };

  const handleSubmit = async (publish?: boolean) => {
    if (!form.title.trim()) return toast.error('Title required');
    if (sections.every(s => !s.content.trim())) return toast.error('At least one section needs content');

    const data = {
      ...form,
      isPublished: publish ?? form.isPublished,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      sections,
    };

    try {
      if (isEdit && id) {
        await updateBlog.mutateAsync({ id, data });
        toast.success('Blog updated!');
      } else {
        await createBlog.mutateAsync(data);
        toast.success('Blog created!');
      }
      router.push('/admin/blog');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const isLoading = createBlog.isPending || updateBlog.isPending || blogLoading;

  return (
    <div className="max-w-5xl mx-auto pb-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
          <h1 className="font-display text-xl font-extrabold text-foreground">
            {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isLoading}>
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit(true)} disabled={isLoading} className="bg-navy-900 hover:bg-navy-800 text-white gap-2">
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Title *</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Blog post title..." className="text-lg font-semibold" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Excerpt (shown in blog list)</Label>
              <textarea
                value={form.excerpt}
                onChange={e => set('excerpt', e.target.value)}
                placeholder="Short description — 2-3 lines shown in blog cards..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Cover Image URL</Label>
              <Input value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
              {form.coverImage && <img src={form.coverImage} alt="Cover" className="mt-3 h-40 w-full object-cover rounded-lg" />}
            </div>
          </div>

          {/* ── Sections ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-foreground">Content Sections</h2>
              <Button variant="outline" size="sm" onClick={addSection} className="gap-1">
                <Plus className="w-4 h-4" /> Add Section
              </Button>
            </div>

            {sections.map((section, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-4">
                {/* Section header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Section {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="h-7 w-7 p-0">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveSection(i, 'down')} disabled={i === sections.length - 1} className="h-7 w-7 p-0">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                    {sections.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeSection(i)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Section Heading (H2)</Label>
                  <Input
                    value={section.heading}
                    onChange={e => updateSection(i, 'heading', e.target.value)}
                    placeholder="Section heading (optional)..."
                  />
                </div>

                {/* Content */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Content *</Label>
                  <textarea
                    value={section.content}
                    onChange={e => updateSection(i, 'content', e.target.value)}
                    placeholder="Write section content here...&#10;&#10;Use bullet points with - at start&#10;- Point one&#10;- Point two"
                    rows={8}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                  />
                </div>

                {/* Images */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground mb-2 block flex items-center gap-1">
                    <Image className="w-3.5 h-3.5" /> Section Images
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`img-input-${i}`}
                      placeholder="Image URL..."
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          addImageToSection(i, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => {
                      const inp = document.getElementById(`img-input-${i}`) as HTMLInputElement;
                      addImageToSection(i, inp.value);
                      inp.value = '';
                    }}>Add</Button>
                  </div>
                  {section.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {section.images.map((img, ii) => (
                        <div key={ii} className="relative group">
                          <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                          <button
                            onClick={() => removeImageFromSection(i, ii)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white text-xs hidden group-hover:flex items-center justify-center"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground mb-1 block flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Section Video URL (YouTube or direct)
                  </Label>
                  <Input
                    value={section.videoUrl}
                    onChange={e => updateSection(i, 'videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://..."
                  />
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full gap-2" onClick={addSection}>
              <Plus className="w-4 h-4" /> Add Another Section
            </Button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Publish */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Publish Settings</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Published</span>
              <button type="button" onClick={() => set('isPublished', !form.isPublished)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-green-500' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Featured ⭐</span>
              <button type="button" onClick={() => set('isFeatured', !form.isFeatured)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-gold-500' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isFeatured ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-card rounded-xl border border-border p-5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Category</Label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {BLOG_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Author */}
          <div className="bg-card rounded-xl border border-border p-5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Author</Label>
            <Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Author name..." />
          </div>

          {/* Tags */}
          <div className="bg-card rounded-xl border border-border p-5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="export, india, trade" />
            {form.tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <Button onClick={() => handleSubmit()} disabled={isLoading} className="w-full bg-navy-900 hover:bg-navy-800 text-white">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : isEdit ? 'Update Post' : 'Save Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}