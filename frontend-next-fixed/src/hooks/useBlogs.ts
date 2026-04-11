// frontend/src/hooks/useBlogs.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface BlogSection {
  _id?:     string;
  heading:  string;
  content:  string;
  images:   string[];
  videoUrl: string;
}

export interface Blog {
  _id:         string;
  title:       string;
  slug:        string;
  excerpt:     string;
  sections:    BlogSection[];
  coverImage:  string;
  author:      string;
  category:    string;
  tags:        string[];
  isPublished: boolean;
  isFeatured:  boolean;
  publishedAt: string;
  readTime:    number;
  views:       number;
  createdAt:   string;
}

export interface BlogsResponse {
  blogs:    Blog[];
  featured: Blog[];
  total:    number;
  page:     number;
  pages:    number;
}

export const BLOG_CATEGORIES = [
  'Export Tips', 'Industry News', 'Trade Insights',
  'Product Spotlight', 'Company Updates', 'Market Trends',
];

// ── Public ───────────────────────────────────────────────────────
export function usePublishedBlogs(params?: {
  category?: string;
  sort?: string;
  page?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: async () => {
      const res = await api.get('/blogs', { params: { limit: 9, ...params } });
      return res.data as BlogsResponse;
    },
    staleTime: 3 * 60 * 1000,
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data as { blog: Blog; related: Blog[] };
    },
    enabled: !!slug,
  });
}

// ── Admin ────────────────────────────────────────────────────────
export function useAllBlogs() {
  return useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs/admin/all');
      return res.data as Blog[];
    },
  });
}

export function useBlogById(id: string) {
  return useQuery({
    queryKey: ['admin-blog', id],
    queryFn: async () => {
      const res = await api.get(`/blogs/admin/${id}`);
      return res.data as Blog;
    },
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Blog>) => api.post('/blogs', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Blog> }) =>
      api.put(`/blogs/${id}`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blogs'] });
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
    },
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });
}

export function useTogglePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/blogs/${id}/toggle`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });
}

export function useToggleFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/blogs/${id}/feature`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });
}