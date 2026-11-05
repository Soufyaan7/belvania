import React from 'react';
import { DelayedSkeleton } from '@/components/ui/DelayedSkeleton';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';

export default function Loading() {
  return (
    <DelayedSkeleton delayMs={300}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* En-tête skeleton */}
        <div className="space-y-3 max-w-md mx-auto text-center">
          <div className="h-3 w-28 bg-[#DECFC4] mx-auto" />
          <div className="h-8 w-64 bg-[#EADFD7] mx-auto" />
          <div className="h-3.5 w-48 bg-[#F0E6DE] mx-auto" />
        </div>

        {/* Grille de squelettes de produits identique à la grille du catalogue */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </DelayedSkeleton>
  );
}

