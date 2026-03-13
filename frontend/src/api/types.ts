// Mirrors the Motoko backend types, adapted for REST/MongoDB
// _id is used instead of bigint id

export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  images: string[]; 
  originCountry: string;
  minOrderQty: number;
  priceRange: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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