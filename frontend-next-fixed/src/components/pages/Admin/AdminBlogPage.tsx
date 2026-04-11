
'use client';

import { Plus, Eye, EyeOff, Trash2, Edit, Calendar, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllBlogs, useDeleteBlog, useTogglePublish, useToggleFeatured } from '../../../hooks/useBlogs';
import Link from 'next/link';
import Image from 'next/image';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminBlogPage() {
  const { data: blogs, isLoading } = useAllBlogs();
  const deleteBlog     = useDeleteBlog();
  const togglePublish  = useTogglePublish();
  const toggleFeatured = useToggleFeatured();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { await deleteBlog.mutateAsync(id); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try { await togglePublish.mutateAsync(id); toast.success(isPublished ? 'Unpublished' : 'Published'); }
    catch { toast.error('Failed'); }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try { await toggleFeatured.mutateAsync(id); toast.success(isFeatured ? 'Removed from featured' : 'Marked featured ⭐'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">{blogs?.length ?? 0} total posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-navy-900 hover:bg-navy-800 text-white gap-2"><Plus className="w-4 h-4" /> New Post</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : blogs?.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-2xl">
          <h3 className="font-display font-bold text-xl mb-2">No blog posts yet</h3>
          <Link href="/admin/blog/new"><Button className="bg-navy-900 text-white gap-2 mt-4"><Plus className="w-4 h-4" /> Create First Post</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs?.map((blog, i) => (
            <motion.div key={blog._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                {blog.coverImage ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-navy-900/10 flex items-center justify-center text-[10px] font-bold text-navy-900/30">BLOG</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">{blog.title}</h3>
                  {blog.isFeatured && <span className="text-gold-500 text-xs">⭐</span>}
                  <Badge variant={blog.isPublished ? 'default' : 'secondary'} className={blog.isPublished ? 'bg-green-100 text-green-700 border-green-200' : ''}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full font-medium">{blog.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views} views</span>
                  {blog.publishedAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedAt)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(blog._id, blog.isFeatured)}
                  className={blog.isFeatured ? 'text-gold-600 border-gold-200 hover:bg-gold-50' : 'text-gray-500'}>
                  <Star className={`w-3.5 h-3.5 mr-1 ${blog.isFeatured ? 'fill-current' : ''}`} />{blog.isFeatured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                  className={blog.isPublished ? 'text-orange-600 border-orange-200 hover:bg-orange-50' : 'text-green-600 border-green-200 hover:bg-green-50'}>
                  {blog.isPublished ? <><EyeOff className="w-3.5 h-3.5 mr-1" />Unpublish</> : <><Eye className="w-3.5 h-3.5 mr-1" />Publish</>}
                </Button>
                <Link href={`/admin/blog/${blog._id}`}>
                  <Button size="sm" variant="outline"><Edit className="w-3.5 h-3.5 mr-1" />Edit</Button>
                </Link>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/5"
                  onClick={() => handleDelete(blog._id, blog.title)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}