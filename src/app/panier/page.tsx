'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { UndoToast } from '@/components/ui/UndoToast';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, CartItem, formatImageSrc } from '@/types/product';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const emptySubscribe = () => () => {};

export default function CartPage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [undoState, setUndoState] = useState<{
    message: string;
    items: CartItem[];
  } | null>(null);

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const restoreCartItems = useCartStore((state) => state.restoreCartItems);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);

  const totalAmount = isMounted ? getTotalAmount() : 0;
  const itemCount = isMounted ? items.reduce((acc, it) => acc + it.quantity, 0) : 0;

  const handleRemoveItem = (productId: string, selectedOption?: string) => {
    const itemToRemove = items.find(
      (it) =>
        it.product.id === productId &&
        (selectedOption === undefined || it.selectedOption === selectedOption)
    );
    if (itemToRemove) {
      setUndoState({
        message: `${itemToRemove.product.name} retiré du panier`,
        items: [itemToRemove],
      });
      removeFromCart(productId, selectedOption);
    }
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    setUndoState({
      message: `${items.length} article${items.length > 1 ? 's' : ''} retiré(s) du panier`,
      items: [...items],
    });
    clearCart();
  };

  const handleUndo = () => {
    if (undoState) {
      restoreCartItems(undoState.items);
      setUndoState(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-8 pb-4 border-b border-[#EADFD7] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B79A5E] block mb-1">
              Votre Sélection
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-[#141414]">
              Mon Panier ({itemCount})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-xs text-[#8C827A] hover:text-[#C62828] transition-colors underline underline-offset-4"
            >
              Vider le panier
            </button>
          )}
        </div>

        {!isMounted || items.length === 0 ? (
          /* Panier Vide */
          <div className="text-center py-16 sm:py-24 bg-white border border-[#EADFD7] p-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#DECFC4] flex items-center justify-center mx-auto text-[#8C827A]">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-medium text-[#141414]">
              Votre panier est actuellement vide
            </h2>
            <p className="text-xs sm:text-sm text-[#736A63] max-w-md mx-auto leading-relaxed">
              Explorez nos parfums rares 10ml et notre maquillage haute couture pour composer votre commande.
            </p>
            <div className="pt-2">
              <Link
                href="/#meilleures-ventes"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#141414] text-[#FAF8F5] hover:bg-[#CBB281] hover:text-[#141414] text-xs font-semibold uppercase tracking-[0.2em] transition-all"
              >
                <span>Découvrir la collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Liste des articles du panier */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Colonne Gauche : Articles */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedOption || 'def'}-${idx}`}
                  className="p-4 bg-white border border-[#EADFD7] flex gap-4 items-center"
                >
                  <div className="relative w-20 h-24 bg-[#F6F2EE] border border-[#EADFD7] shrink-0 overflow-hidden">
                    <Image
                      src={formatImageSrc(item.product.images[0])}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C827A] block">
                      {item.product.brand}
                    </span>
                    <h3 className="font-display text-sm font-medium text-[#141414] truncate mb-1">
                      {item.product.name}
                    </h3>
                    {item.selectedOption && (
                      <span className="inline-block text-[11px] text-[#736A63] bg-[#FAF8F5] px-2 py-0.5 border border-[#EADFD7] mb-2">
                        {item.selectedOption}
                      </span>
                    )}

                    <div className="flex items-center gap-3 mt-1">
                      {/* Quantité */}
                      <div className="flex items-center border border-[#DECFC4]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedOption
                            )
                          }
                          className="tap-target-44 w-9 h-9 text-[#141414] hover:bg-[#F5EFEB] transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-[#141414] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedOption
                            )
                          }
                          className="tap-target-44 w-9 h-9 text-[#141414] hover:bg-[#F5EFEB] transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(item.product.id, item.selectedOption)
                        }
                        className="tap-target-44 text-[#8C827A] hover:text-[#C62828] transition-colors"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0 tabular-nums">
                    <span className="text-sm font-bold text-[#141414] block">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-[#8C827A]">
                        {formatPrice(item.product.price)} / unité
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Colonne Droite : Récapitulatif et validation */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#EADFD7] p-5 sm:p-6 space-y-5 sticky top-24">
                <h3 className="font-display text-base font-semibold text-[#141414] uppercase tracking-wider pb-3 border-b border-[#EADFD7]">
                  Récapitulatif de Commande
                </h3>

                <div className="space-y-2.5 text-xs text-[#736A63] tabular-nums">
                  <div className="flex justify-between">
                    <span>Sous-total ({itemCount} articles)</span>
                    <span className="font-medium text-[#141414]">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span className="font-semibold text-[#2E7D32] uppercase">Gratuit</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#141414] pt-3 border-t border-[#DECFC4]">
                    <span>Total à régler (COD)</span>
                    <span className="text-lg text-[#141414]">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Badge de réassurance */}
                <div className="p-3 bg-[#FAF8F5] border border-[#DECFC4] flex items-center gap-2.5 text-[11px] text-[#736A63]">
                  <ShieldCheck className="w-5 h-5 text-[#B79A5E] shrink-0" />
                  <span>Paiement 100% à la livraison en espèces sans avance bancaire.</span>
                </div>

                {/* Bouton pour ouvrir le Checkout Express */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 px-6 bg-[#141414] text-[#FAF8F5] hover:bg-[#CBB281] hover:text-[#141414] text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#CBB281]" />
                  <span>Valider ma commande (COD)</span>
                </button>

                <Link
                  href="/#meilleures-ventes"
                  className="block text-center text-xs text-[#8C827A] hover:text-[#141414] transition-colors underline underline-offset-4"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Checkout relié à l'ensemble du panier */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Toast d'annulation (Undo) pour toute suppression d'article */}
      {undoState && (
        <UndoToast
          message={undoState.message}
          onUndo={handleUndo}
          onDismiss={() => setUndoState(null)}
          durationMs={7000}
        />
      )}

      <Footer />
    </div>
  );
}
