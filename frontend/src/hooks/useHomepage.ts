// frontend/src/hooks/useHomepage.ts

import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export interface HomeProduct {
  _id: string;
  name: string;
  category: string;
  description?: string;
  images?: string[];
  imageUrl?: string;
  priceRange?: string;
  originCountry?: string;
  minOrderQty?: number;
  isFeatured?: boolean;
  views?: number;
  soldCount?: number;
  createdAt?: string;
}

export interface HomepageData {
  featured:    HomeProduct[];
  newArrivals: HomeProduct[];
  trending:    HomeProduct[];
  categories:  HomeProduct[];
}

export function useHomepageProducts() {
  return useQuery<HomepageData>({
    queryKey: ['homepage-products'],
    queryFn:  async () => {
      const { data } = await api.get('/products/homepage');
      return data;
    },
    staleTime:            5 * 60 * 1000,  // 5 min — don't refetch if fresh
    gcTime:               10 * 60 * 1000, // 10 min keep in memory
    refetchOnWindowFocus: false,           // no refetch on tab switch
    refetchOnReconnect:   false,           // no refetch on network reconnect
    retry:                1,              // only 1 retry on failure
  });
}