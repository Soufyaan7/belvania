import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="relative flex flex-col bg-white border border-[#EADFD7] shadow-xs animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      {/* Zone Image avec Ratio Carré Strict identique à ProductCard */}
      <div className="relative w-full aspect-square bg-[#F0E6DE]" />

      {/* Détails du Produit */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        {/* Marque */}
        <div className="h-2.5 sm:h-3 w-20 bg-[#EADFD7] rounded-none mb-2" />

        {/* Nom du produit */}
        <div className="h-3.5 sm:h-4 w-4/5 bg-[#EADFD7] rounded-none mb-2" />

        {/* Description courte */}
        <div className="h-2.5 sm:h-3 w-3/5 bg-[#F5EFEB] rounded-none mb-3" />

        {/* Prix et Boutons d'action */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-[#F0E6DE] flex flex-col gap-2">
          {/* Tarification */}
          <div className="h-4 sm:h-5 w-24 bg-[#EADFD7] rounded-none" />

          {/* Boutons d'action responsive (2 colonnes) */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-7 sm:h-8 bg-[#F5EFEB] rounded-none" />
            <div className="h-7 sm:h-8 bg-[#EADFD7] rounded-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

