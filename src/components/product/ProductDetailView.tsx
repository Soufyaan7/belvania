'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  Check,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from 'lucide-react';
import { Product, formatPrice, formatImageSrc } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  // 1. État de la galerie d'images
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageChange = (idx: number) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setSelectedImageIndex(idx);
      });
    } else {
      setSelectedImageIndex(idx);
    }
  };

  // 2. État du modal Checkout Express
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 3. État des variantes
  const defaultVariant =
    product.category === 'parfum'
      ? '10ml'
      : product.shades && product.shades.length > 0
      ? product.shades[0].name
      : undefined;

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(defaultVariant);

  // 3. Quantité
  const [quantity, setQuantity] = useState(1);

  // 4. Accordéon (onglets ouverts)
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    pyramid: true, // Ouvert par défaut pour voir la pyramide olfactive ou conseils
    delivery: true, // Ouvert par défaut pour la réassurance COD
    authenticity: false,
  });

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 5. Store Panier
  const addToCart = useCartStore((state) => state.addToCart);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2500);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 md:pb-16">
      {/* Fil d'Ariane (Breadcrumbs) */}
      <nav className="flex items-center space-x-2 text-xs text-[#8C827A] mb-8">
        <Link href="/" className="hover:text-[#141414] transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category === 'parfum' ? 'Parfums' : 'Maquillage'}</span>
        <span>/</span>
        <span className="text-[#141414] font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Grille Principale Produit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* ================= GAUCHE : GALERIE D'IMAGES ================= */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Miniatures cliquables */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleImageChange(idx)}
                  className={`relative w-20 h-24 sm:w-24 sm:h-28 bg-white border-2 transition-all overflow-hidden shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#141414] shadow-sm'
                      : 'border-[#EADFD7] hover:border-[#8C827A] opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Afficher l'image ${idx + 1}`}
                >
                  <Image
                    src={formatImageSrc(img)}
                    alt={`${product.name} miniature ${idx + 1}`}
                    fill
                    sizes="(max-width: 639px) 80px, 96px"
                    className="object-contain object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image Principale avec Badges */}
          <div
            className="relative flex-1 aspect-4/5 sm:aspect-square md:aspect-4/5 bg-white border border-[#EADFD7] overflow-hidden"
            style={{ viewTransitionName: `product-image-${product.slug}` }}
          >
            <Image
              src={formatImageSrc(product.images[selectedImageIndex] || product.images[0])}
              alt={product.name}
              fill
              preload
              sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 160px), (max-width: 1279px) calc(58.333vw - 172.67px), 574px"
              quality={85}
              className="object-contain object-center transition-all duration-500"
            />

            {/* Badge Authenticité 100% Original */}
            {product.authenticityBadge && (
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141414]/90 backdrop-blur-xs text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#CBB281]" />
                <span>100% Original Garanti</span>
              </div>
            )}

            {/* Badge Remise */}
            {discountPercent && (
              <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-[#CBB281] text-[#141414] text-xs uppercase tracking-wider font-bold shadow-md">
                -{discountPercent}%
              </div>
            )}
          </div>
        </div>

        {/* ================= DROITE : INFORMATIONS ET COMMANDES ================= */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Marque en majuscules */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B79A5E]">
              {product.brand.toUpperCase()}
            </span>
            <span className="text-[11px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              En Stock • Expédié en 24h
            </span>
          </div>

          {/* Titre Produit */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-[#141414] leading-tight mb-4">
            {product.name}
          </h1>

          {/* Prix et Réduction */}
          <div className="flex items-baseline gap-3 p-3.5 bg-[#F5EFEB] border border-[#EADFD7] mb-6 tabular-nums">
            <span className="text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-[#8C827A] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-semibold text-[#B79A5E] bg-white px-2 py-0.5 border border-[#DECFC4]">
                  -10 %
                </span>
              </>
            )}
          </div>

          {/* Badges de Réassurance Produit (COD & Originalité) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 p-3 bg-white border border-[#EADFD7]">
              <ShieldCheck className="w-5 h-5 text-[#B79A5E] shrink-0" />
              <div className="text-[11px] leading-tight text-[#141414]">
                <strong className="block font-semibold">100% Original</strong>
                <span className="text-[#8C827A]">Batch code vérifié</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-[#EADFD7]">
              <Truck className="w-5 h-5 text-[#B79A5E] shrink-0" />
              <div className="text-[11px] leading-tight text-[#141414]">
                <strong className="block font-semibold">Paiement à la livraison</strong>
                <span className="text-[#8C827A]">Réglez à réception (COD)</span>
              </div>
            </div>
          </div>

          {/* Description courte */}
          <p className="text-xs sm:text-sm text-[#736A63] leading-relaxed mb-6 font-light">
            {product.description}
          </p>

          {/* AFFICHAGE CONTENANCE : Parfums (10ml officiel, sans sélecteur artificiel) */}
          {product.category === 'parfum' && (
            <div className="mb-6 p-3 bg-white border border-[#EADFD7] flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C827A] font-semibold">
                  Contenance Officielle
                </span>
                <span className="font-display text-sm sm:text-base font-semibold text-[#141414]">
                  10ml • Flacon Vaporisateur Nomade
                </span>
              </div>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#B79A5E] font-semibold bg-[#FAF8F5] px-2.5 py-1 border border-[#DECFC4]">
                Format Authentique
              </span>
            </div>
          )}

          {/* SÉLECTEUR DE TEINTES / RÉFÉRENCES : Maquillage avec plusieurs teintes */}
          {product.category === 'makeup' && product.shades && product.shades.length > 1 && (
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#141414] mb-2.5">
                Choisir la Teinte / Référence :{' '}
                <span className="text-[#B79A5E] font-bold">{selectedVariant}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.shades.map((shade) => {
                  const isSelected = selectedVariant === shade.name;
                  return (
                    <button
                      key={shade.name}
                      type="button"
                      onClick={() => setSelectedVariant(shade.name)}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#141414] bg-[#141414] text-white shadow-xs'
                          : 'border-[#DECFC4] bg-white text-[#141414] hover:border-[#141414]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: shade.hex }}
                      />
                      <span>{shade.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* RÉFÉRENCE UNIQUE : Maquillage avec une seule référence (sans sélecteur) */}
          {product.category === 'makeup' && product.shades && product.shades.length === 1 && (
            <div className="mb-6 p-3 bg-white border border-[#EADFD7] flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: product.shades[0].hex }}
              />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C827A] font-semibold">
                  Référence Disponible
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#141414]">
                  {product.shades[0].name}
                </span>
              </div>
            </div>
          )}

          {/* Quantité & Bouton CTA Desktop */}
          <div className="space-y-4 pt-2 mb-8">
            <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-4">
              {/* Sélecteur quantité */}
              <div className="col-span-2 flex w-fit items-center border border-[#DECFC4] bg-white md:col-span-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="min-h-11 min-w-11 p-3 text-[#141414] hover:bg-[#F5EFEB] transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-semibold text-[#141414] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="min-h-11 min-w-11 p-3 text-[#141414] hover:bg-[#F5EFEB] transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bouton Acheter Maintenant (Ouvre directement le Modal COD) */}
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="col-span-1 flex min-h-11 min-w-0 items-center justify-center gap-1.5 bg-[#141414] px-2 py-3 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-[#FAF8F5] shadow-md transition-all hover:bg-[#CBB281] hover:text-[#141414] md:min-h-0 md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-xs md:tracking-[0.2em]"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-[#CBB281]" />
                <span className="min-w-0">
                  <span className="md:hidden">Acheter maintenant</span>
                  <span className="hidden md:inline">Acheter maintenant (Paiement à la réception)</span>
                </span>
              </button>

              {/* Bouton Ajouter au Panier */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`col-span-1 flex min-h-11 min-w-0 items-center justify-center gap-1.5 border px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition-all md:px-5 md:py-4 md:text-xs ${
                  addedFeedback
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                    : 'bg-white text-[#141414] border-[#DECFC4] hover:border-[#141414]'
                }`}
                title="Ajouter au panier"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Panier</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification de confirmation */}
            {addedFeedback && (
              <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Produit ajouté à votre panier.
                </span>
                <Link
                  href="/panier"
                  className="font-semibold underline uppercase tracking-wider text-[11px]"
                >
                  Voir mon panier
                </Link>
              </div>
            )}
          </div>

          {/* ================= ACCORDÉONS DÉROULANTS ================= */}
          <div className="border-t border-[#EADFD7] divide-y divide-[#EADFD7]">
            {/* Accordéon 1 : Pyramide Olfactive (si parfum) ou Conseils d'application (si maquillage) */}
            {product.fragranceNotes ? (
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('pyramid')}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#141414] py-1"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B79A5E]" />
                    Pyramide Olfactive
                  </span>
                  {accordionOpen.pyramid ? (
                    <ChevronUp className="w-4 h-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                  )}
                </button>

                {accordionOpen.pyramid && (
                  <div className="mt-3 space-y-2.5 text-xs text-[#736A63] pl-6 animate-in fade-in duration-200">
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#EADFD7]">
                      <strong className="text-[#141414] uppercase tracking-wider text-[10px] block mb-0.5">
                        Notes de Tête :
                      </strong>
                      <span>{product.fragranceNotes.top.join(' • ')}</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#EADFD7]">
                      <strong className="text-[#141414] uppercase tracking-wider text-[10px] block mb-0.5">
                        Notes de Cœur :
                      </strong>
                      <span>{product.fragranceNotes.heart.join(' • ')}</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#EADFD7]">
                      <strong className="text-[#141414] uppercase tracking-wider text-[10px] block mb-0.5">
                        Notes de Fond :
                      </strong>
                      <span>{product.fragranceNotes.base.join(' • ')}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('pyramid')}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#141414] py-1"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B79A5E]" />
                    Conseils d&apos;Utilisation &amp; Fini
                  </span>
                  {accordionOpen.pyramid ? (
                    <ChevronUp className="w-4 h-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                  )}
                </button>

                {accordionOpen.pyramid && (
                  <div className="mt-3 text-xs text-[#736A63] leading-relaxed pl-6 animate-in fade-in duration-200 space-y-2">
                    <p>
                      Appliquez délicatement à l&apos;aide de l&apos;applicateur ou au doigt selon l&apos;effet désiré.
                      Formule haute tenue, texture fondante et non collante.
                    </p>
                    <p className="text-[11px] text-[#8C827A]">
                      Testé sous contrôle dermatologique. Convient à tous types de peaux.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Accordéon 2 : Modalités de Livraison & COD */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('delivery')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#141414] py-1"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B79A5E]" />
                  Livraison &amp; Paiement à la Réception
                </span>
                {accordionOpen.delivery ? (
                  <ChevronUp className="w-4 h-4 text-[#8C827A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                )}
              </button>

              {accordionOpen.delivery && (
                <div className="mt-3 text-xs text-[#736A63] leading-relaxed pl-6 animate-in fade-in duration-200 space-y-1.5">
                  <p>
                    • <strong>Livraison express sécurisée</strong> : Expédition sous 24 à 48 heures ouvrées dans un colis protecteur scellé.
                  </p>
                  <p>
                    • <strong>Paiement à la réception (COD)</strong> : Aucun paiement préalable en ligne. Réglez simplement en espèces au livreur à l&apos;arrivée.
                  </p>
                </div>
              )}
            </div>

            {/* Accordéon 3 : Authenticité Certifiée Belvania */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('authenticity')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#141414] py-1"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B79A5E]" />
                  Garantie 100% Authenticité
                </span>
                {accordionOpen.authenticity ? (
                  <ChevronUp className="w-4 h-4 text-[#8C827A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                )}
              </button>

              {accordionOpen.authenticity && (
                <div className="mt-3 text-xs text-[#736A63] leading-relaxed pl-6 animate-in fade-in duration-200 space-y-1.5">
                  <p>
                    Belvania Store s&apos;engage formellement sur l&apos;authenticité de chaque flacon et fard.
                    Importation directe depuis les circuits officiels de distribution européens.
                    Vérification du code de lot (batch code) sur chaque unité.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BARRE FIXE INFÉRIEURE MOBILE (Sticky Bottom Bar) ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#DECFC4] p-3 px-4 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3">
          {/* Prix et Variante */}
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#141414] leading-tight tabular-nums">
              {formatPrice(product.price * quantity)}
            </span>
            <span className="text-[10px] text-[#8C827A] truncate max-w-[120px]">
              {selectedVariant || 'Format standard'}
            </span>
          </div>

          {/* Boutons d'action Mobile */}
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`min-h-11 min-w-11 shrink-0 border p-3 transition-colors ${
                addedFeedback
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                  : 'bg-white border-[#DECFC4] text-[#141414] active:bg-[#F5EFEB]'
              }`}
              aria-label="Ajouter au panier"
            >
              {addedFeedback ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 bg-[#141414] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] shadow-sm transition-all active:bg-[#CBB281] active:text-[#141414]"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#CBB281]" />
              <span className="min-w-0 text-center">Acheter (COD)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Commande Express COD */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        directItem={{
          product,
          selectedOption: selectedVariant,
          quantity,
        }}
      />
    </div>
  );
};
