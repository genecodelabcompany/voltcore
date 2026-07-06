import type { Product } from './types';

// In-memory product lookup for cart/checkout operations.
// Products are fetched from the API and cached here.
let _products: Product[] = [];

export function setProducts(products: Product[]) {
  _products = products;
}

export function productById(id: string): Product | undefined {
  return _products.find(p => p.id === id);
}
