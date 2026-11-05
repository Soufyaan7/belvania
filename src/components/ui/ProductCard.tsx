'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, Check } from 'lucide-react';
import { Product, formatPrice } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  // Calcule le pourcentage de remise si un ancien prix existe
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Option par défaut sélectionnée pour l'ajout rapide
  const defaultOption =
    product.volumeOptions && product.volumeOptions.length > 0
      ? product.volumeOptions[0]
      : product.shades && product.shades.length > 0
      ? product.shades[0].name
      : undefined;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultOption);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#EADFD7] hover:border-[#141414] transition-all duration-300 shadow-xs hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Zone Image avec Ratio Carré Strict */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full aspect-square overflow-hidden bg-[#F6F2EE]"
        style={{ viewTransitionName: `product-image-${product.slug}` }}
      >
        <Image
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badge "100% Original" */}
        {product.authenticityBadge && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#141414]/90 backdrop-blur-xs text-[#FAF8F5] text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#CBB281]" />
            <span>100% Original</span>
          </div>
        )}

        {/* Badge Remise (si promotion) */}
        {discountPercent && (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 px-1.5 py-0.5 bg-[#CBB281] text-[#141414] text-[8px] sm:text-[10px] tracking-wider font-bold">
            -{discountPercent}%
          </div>
        )}

        {/* Indicateur de teintes (si produit de maquillage) */}
        {product.shades && product.shades.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 z-10 hidden sm:flex items-center gap-1 p-1 bg-white/85 backdrop-blur-xs">
            <span className="text-[8px] uppercase tracking-wider text-[#736A63] mr-0.5">Teintes:</span>
            {product.shades.slice(0, 4).map((shade) => (
              <span
                key={shade.name}
                title={shade.name}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: shade.hex }}
              />
            ))}
            {product.shades.length > 4 && (
              <span className="text-[8px] text-[#736A63]">+{product.shades.length - 4}</span>
            )}
          </div>
        )}
      </Link>

      {/* Détails du Produit */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        {/* Marque en majuscules (text-xs / text-[10px]) */}
        <p className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8C827A] mb-1 truncate">
          {product.brand.toUpperCase()}
        </p>

        {/* Nom du produit (text-sm / text-xs) */}
        <Link
          href={`/products/${product.slug}`}
          className="group-hover:text-[#B79A5E] transition-colors"
        >
          <h3 className="font-display text-xs sm:text-sm md:text-base font-medium text-[#141414] line-clamp-1 mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Description courte / contenances */}
        <p className="text-[10px] sm:text-xs text-[#8C827A] line-clamp-1 leading-relaxed mb-3">
          {product.volumeOptions && product.volumeOptions.length > 0
            ? `${product.volumeOptions.join(' • ')}`
            : product.description}
        </p>

        {/* Prix et Boutons d'action */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-[#F0E6DE] flex flex-col gap-2">
          {/* Tarification */}
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="text-xs sm:text-base font-bold text-[#141414] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#A89F96] line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Boutons d'action responsive (Voir / Commander) */}
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href={`/products/${product.slug}`}
              className="py-1.5 sm:py-2 px-1 text-center text-[10px] sm:text-xs uppercase tracking-wider font-medium text-[#141414] bg-[#F5EFEB] hover:bg-[#EADFD7] transition-colors"
            >
              Voir
            </Link>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`py-1.5 sm:py-2 px-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all ${
                added
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#141414] text-white hover:bg-[#CBB281] hover:text-[#141414]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="truncate">Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span className="truncate">Acheter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
