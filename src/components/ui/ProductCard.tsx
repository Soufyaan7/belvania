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

  // Variante par défaut
  const initialOption =
    product.category === 'parfum'
      ? '10ml'
      : product.shades && product.shades.length > 0
      ? product.shades[0].name
      : undefined;

  const [selectedOption, setSelectedOption] = useState<string | undefined>(initialOption);

  // Calcule le pourcentage de remise si un ancien prix existe
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedOption);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const hasMultipleShades =
    product.category === 'makeup' && product.shades && product.shades.length > 1;
  const hasSingleShade =
    product.category === 'makeup' && product.shades && product.shades.length === 1;

  return (
    <div
      className="group relative flex flex-col h-full bg-white border border-[#EADFD7] hover:border-[#141414] transition-all duration-300 shadow-xs hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Zone Image avec Ratio Carré Strict & Cadrage Haute Qualité */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full aspect-square overflow-hidden bg-[#F6F2EE] shrink-0"
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

        {/* Contenance 10ml discrète sur l'image pour les parfums */}
        {product.category === 'parfum' && (
          <div className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[9px] sm:text-[10px] tracking-wider font-semibold">
            10ml
          </div>
        )}
      </Link>

      {/* Détails du Produit avec Hauteur Homogène */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        {/* Marque en majuscules discrète et raffinée */}
        <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C827A] mb-1 truncate">
          {product.brand.toUpperCase()}
        </p>

        {/* Nom du produit avec 2 lignes max pour égaliser toutes les hauteurs de carte */}
        <Link
          href={`/products/${product.slug}`}
          className="group-hover:text-[#B79A5E] transition-colors mb-1.5"
        >
          <h3 className="font-display text-xs sm:text-sm font-medium text-[#141414] line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Référence ou Contenance sous le nom */}
        <div className="mb-2">
          {product.category === 'parfum' && (
            <span className="inline-flex items-center text-[10px] sm:text-xs text-[#736A63] bg-[#FAF8F5] px-2 py-0.5 border border-[#EADFD7] tracking-wide font-medium">
              Contenance : 10ml
            </span>
          )}

          {hasSingleShade && product.shades && (
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-[#736A63] bg-[#FAF8F5] px-2 py-0.5 border border-[#EADFD7] tracking-wide font-medium">
              <span
                className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: product.shades[0].hex }}
              />
              <span>Réf : {product.shades[0].name}</span>
            </span>
          )}

          {/* Sélecteur interactif de références / teintes si plusieurs variantes */}
          {hasMultipleShades && product.shades && (
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#8C827A] block font-semibold">
                Choisir la teinte :
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.shades.map((shade) => {
                  const isSelected = selectedOption === shade.name;
                  return (
                    <button
                      key={shade.name}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedOption(shade.name);
                      }}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] sm:text-[10px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#141414] bg-[#141414] text-white font-semibold shadow-2xs'
                          : 'border-[#DECFC4] bg-white text-[#524B45] hover:border-[#141414]'
                      }`}
                      title={`Sélectionner ${shade.name}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: shade.hex }}
                      />
                      <span className="truncate max-w-[68px] sm:max-w-[85px]">{shade.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Prix et Boutons d'action fixés en bas de carte */}
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-[#F0E6DE] flex flex-col gap-2">
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

          {/* Boutons d'action responsive (Voir / Acheter) */}
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href={`/products/${product.slug}`}
              className="py-2 px-1 text-center text-[10px] sm:text-xs uppercase tracking-wider font-medium text-[#141414] bg-[#F5EFEB] hover:bg-[#EADFD7] transition-colors flex items-center justify-center tap-target-44"
            >
              Voir
            </Link>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`py-2 px-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all tap-target-44 cursor-pointer ${
                added
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#141414] text-white hover:bg-[#CBB281] hover:text-[#141414]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3 shrink-0" />
                  <span className="truncate">Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 shrink-0" />
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
