import type { Product } from '@/types/product';
import productsData from '@/data/products.json';

export interface PackProduct {
  productId: string;
  quantity: number;
  selectedOption: string;
}

export interface ProductPack {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  products: PackProduct[];
  price: number;
  images: string[];
  active: boolean;
  badge?: string;
  order: number;
}

const catalog = productsData as Product[];

export const packs: ProductPack[] = [
  {
    id: 'the-signature-duo',
    name: 'The Signature Duo',
    slug: 'the-signature-duo',
    shortDescription:
      'Deux signatures olfactives réunies dans un duo exclusif. L’intensité de L’Interdit Rouge rencontre la douceur raffinée de Burberry Goddess.',
    detailedDescription:
      'Deux signatures olfactives réunies dans un duo exclusif. L’intensité de L’Interdit Rouge rencontre la douceur raffinée de Burberry Goddess. Deux fragrances de 10 ml pour accompagner chaque moment.',
    products: [
      { productId: 'parfum_l_interdit_rouge', quantity: 1, selectedOption: '10ml' },
      { productId: 'parfum_burberry_goddess', quantity: 1, selectedOption: '10ml' },
    ],
    price: 249,
    images: ['/images/the-signature-duo.png'],
    active: true,
    badge: 'Pack Exclusif',
    order: 1,
  },
];

export const activePacks = packs.filter((pack) => pack.active).sort((left, right) => left.order - right.order);

export function getPackBySlug(slug: string): ProductPack | undefined {
  return activePacks.find((pack) => pack.slug === slug);
}

export function getPackProducts(pack: ProductPack): Array<{ product: Product; quantity: number; selectedOption: string }> {
  return pack.products.flatMap((entry) => {
    const product = catalog.find((candidate) => candidate.id === entry.productId);
    return product ? [{ product, quantity: entry.quantity, selectedOption: entry.selectedOption }] : [];
  });
}
