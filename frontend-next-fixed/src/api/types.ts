export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  images: string[];
  specifications?: { property: string; value: string }[];
  originCountry: string;
  minOrderQty: number;
  priceRange: string;
  isActive: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  views:      number;
  soldCount:  number;
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  productId: string | null;
  productName: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  activeRate: number;
  totalEnquiries: number;
  newEnquiries: number;
  recentEnquiries: Enquiry[];
}

export interface AdminAuth {
  token: string;
  email: string;
  role: string;
}