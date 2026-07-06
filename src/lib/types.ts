export interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  cat: string;
  category: string;
  price: number;
  was?: number;
  sku: string;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  glyph: string;
  brand: string;
  badge: string | null;
  desc: string;
  image_url?: string;
}

export interface OrderItem {
  id: string;
  product: string;
  name: string;
  price: number;
  status: OrderStatus;
  date: string;
  items?: number;
  amount?: number;
  tracking?: string;
}

export type OrderStatus = 'delivered' | 'processing' | 'shipped' | 'pending' | 'cancelled';

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
  time: string;
  items: number;
}

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  hours: number;
  price: number;
  enrolled: number;
  students: number;
  rating: number;
  progress: number;
  instructor: string;
  glyph: string;
  cert: boolean;
  duration: string;
  desc: string;
}

export interface Service {
  id: string;
  name: string;
  title: string;
  from: number;
  price: string;
  eta: string;
  glyph: string;
  icon: string;
  desc: string;
}

export interface ServiceRequest {
  id: string;
  client: string;
  service: string;
  status: string;
  budget: string;
  date: string;
  desc?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  date: string;
  replies: number;
  message: string;
  reply?: string;
}

export interface CartItem {
  id: string;
  qty: number;
}
