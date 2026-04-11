import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { DashboardStats, Enquiry, Product } from '../api/types';

// ── Products ─────────────────────────────────────────────────────────────

export function useActiveProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'active'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });
}

export function useProductById(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`);
      return data;
    },
    enabled: !!category && category !== 'All',
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      description: string;
      imageUrl: string;
      originCountry: string;
      minOrderQty: number;
      priceRange: string;
    }) => {
      const res = await api.post('/products', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      category: string;
      description: string;
      imageUrl: string;
      originCountry: string;
      minOrderQty: number;
      priceRange: string;
    }) => {
      const { id, ...rest } = data;
      const res = await api.put(`/products/${id}`, rest);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', vars.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useToggleProductActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/products/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['products'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
},
  });
}

// ── Enquiries ─────────────────────────────────────────────────────────────

export function useAllEnquiries() {
  return useQuery<Enquiry[]>({
    queryKey: ['enquiries'],
    queryFn: async () => {
      const { data } = await api.get('/enquiries');
      return data;
    },
  });
}

export function useSubmitEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      productId: string | null;
      productName: string;
      message: string;
    }) => {
      const res = await api.post('/enquiries', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useMarkEnquiryRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/enquiries/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/enquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/enquiries/dashboard');
      return data;
    },
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return false;
      const { data } = await api.get('/admin/verify');
      return data.isAdmin;
    },
    retry: false,
  });
}


export function useAllProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/products/all');
      return data;
    },
  });
}