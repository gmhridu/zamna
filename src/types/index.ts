export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  featured: boolean;
  category?: { id: number; name: string; slug: string };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku: string;
  slug: string;
}

export interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

export interface OrderResult {
  orderId: number;
  trackingId: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export type PageName =
  | 'home'
  | 'shop'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-tracking'
  | 'contact';
