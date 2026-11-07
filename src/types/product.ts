export type ProductCategory = 'parfum' | 'makeup';

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface ProductShade {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  authenticityBadge: boolean;
  fragranceNotes?: FragranceNotes;
  volumeOptions?: string[];
  shades?: ProductShade[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedOption?: string;
  quantity: number;
}

export const CURRENCY = 'DH';

export function formatPrice(price: number): string {
  return `${price} ${CURRENCY}`;
}

export function formatImageSrc(src?: string): string {
  if (!src) return '/placeholder.png';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  return `/${src}`;
}
