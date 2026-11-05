import React from 'react';
import { DelayedSkeleton } from '@/components/ui/DelayedSkeleton';

export default function ProductDetailLoading() {
  return (
    <DelayedSkeleton delayMs={300}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse motion-reduce:animate-none">
        {/* Breadcrumb skeleton */}
        <div className="h-3 w-48 bg-[#EADFD7] mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Galerie image gauche */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="hidden md:flex flex-col gap-3">
              <div className="w-20 h-24 bg-[#EADFD7]" />
              <div className="w-20 h-24 bg-[#EADFD7]" />
            </div>
            <div className="flex-1 aspect-4/5 sm:aspect-square md:aspect-4/5 bg-[#EADFD7]" />
          </div>

          {/* Détails droite */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="h-3 w-28 bg-[#DECFC4]" />
            <div className="h-8 w-3/4 bg-[#EADFD7]" />
            <div className="h-16 w-full bg-[#F5EFEB]" />
            <div className="h-20 w-full bg-[#FAF8F5] border border-[#EADFD7]" />
            <div className="h-14 w-full bg-[#141414]/10" />
          </div>
        </div>
      </div>
    </DelayedSkeleton>
  );
}

