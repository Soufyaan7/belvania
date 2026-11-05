'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

interface ProductCatalogSectionProps {
  products: Product[];
  initialCategory?: 'all' | 'parfum' | 'makeup';
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  products,
  initialCategory = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'parfum' | 'makeup'>(initialCategory);

  const filteredProducts = products.filter((product) => {
    if (activeTab === 'all') return true;
    return product.category === activeTab;
  });

  const parfumCount = products.filter((p) => p.category === 'parfum').length;
  const makeupCount = products.filter((p) => p.category === 'makeup').length;

  return (
    <section id="meilleures-ventes" className="py-12 sm:py-20 bg-[#F5EFEB] border-y border-[#EADFD7]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 border-b border-[#DECFC4]">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B79A5E] block mb-1">
              Catalogue Belvania Store
            </span>
            <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-medium text-[#141414]">
              Nos Meilleures Ventes &amp; Nouveautés
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#736A63] mt-2 md:mt-0 max-w-md">
            Parfums authentiques 10ml et maquillage haute performance des plus grandes maisons de luxe.
          </p>
        </div>

        {/* Boutons d'onglets de filtrage (Scrollable sur mobile pour éviter les cassures) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] shrink-0 transition-all border ${
              activeTab === 'all'
                ? 'bg-[#141414] text-[#FAF8F5] border-[#141414] shadow-sm'
                : 'bg-white text-[#141414] border-[#DECFC4] hover:border-[#141414]'
            }`}
          >
            Tous ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parfum')}
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] shrink-0 transition-all border ${
              activeTab === 'parfum'
                ? 'bg-[#141414] text-[#FAF8F5] border-[#141414] shadow-sm'
                : 'bg-white text-[#141414] border-[#DECFC4] hover:border-[#141414]'
            }`}
          >
            Parfums ({parfumCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('makeup')}
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] shrink-0 transition-all border ${
              activeTab === 'makeup'
                ? 'bg-[#141414] text-[#FAF8F5] border-[#141414] shadow-sm'
                : 'bg-white text-[#141414] border-[#DECFC4] hover:border-[#141414]'
            }`}
          >
            Maquillage ({makeupCount})
          </button>
        </div>

        {/* Grille responsive : 2 colonnes sur mobile (< 640px) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
