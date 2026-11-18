import type { Product } from '@/types/product';

export function getRelatedProducts(
  currentProduct: Product,
  catalog: Product[],
  limit = 4
): Product[] {
  const seenIds = new Set([currentProduct.id]);

  return catalog
    .flatMap((candidate, catalogIndex) => {
      if (seenIds.has(candidate.id) || !candidate.inStock) return [];
      seenIds.add(candidate.id);

      const sameCategory = candidate.category === currentProduct.category;
      const sameBrand = candidate.brand === currentProduct.brand;
      const relevance = sameCategory ? (sameBrand ? 0 : 1) : (sameBrand ? 2 : 3);

      return [{ candidate, relevance, catalogIndex }];
    })
    .sort((left, right) => left.relevance - right.relevance || left.catalogIndex - right.catalogIndex)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
