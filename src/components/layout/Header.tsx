'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ShoppingBag, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const emptySubscribe = () => () => {};

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const cartItems = useCartStore((state) => state.items);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EADFD7] transition-all">
      {/* 1. Bandeau d'annonce supérieur fixe */}
      <div className="bg-[#141414] text-[#F5EFEB] py-1.5 sm:py-2 px-3 text-center text-[10px] sm:text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#CBB281] shrink-0" />
        <span className="truncate">Livraison Express • Paiement à la réception (COD)</span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#CBB281] shrink-0" />
      </div>

      {/* 2. Barre de navigation principale (Alignement parfait Mobile & Desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* GAUCHE : Menu Burger (Mobile) ou Navigation (Desktop) */}
          <div className="flex items-center w-20 md:w-auto">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="tap-target-44 -ml-2 text-[#141414] hover:text-[#B79A5E] focus:outline-none md:hidden transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414] hover:text-[#B79A5E] transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/category/parfum"
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]/80 hover:text-[#B79A5E] transition-colors"
              >
                Parfums
              </Link>
              <Link
                href="/category/makeup"
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]/80 hover:text-[#B79A5E] transition-colors"
              >
                Maquillage
              </Link>
              <Link
                href="/#authenticite"
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]/80 hover:text-[#B79A5E] transition-colors"
              >
                Authenticité 100%
              </Link>
            </nav>
          </div>

          {/* CENTRE : Logo BELVANIA Parfaitement Centré */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
            <Link href="/" className="group inline-flex flex-col items-center">
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.22em] text-[#141414] group-hover:opacity-90 transition-opacity">
                BELVANIA
              </span>
              <span className="block text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.32em] text-[#8C827A] -mt-0.5">
                Store • Beauté & Luxe
              </span>
            </Link>
          </div>

          {/* DROITE : Recherche & Panier */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-3 md:space-x-4 w-20 md:w-auto">
            {/* Bouton Recherche */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="tap-target-44 text-[#141414] hover:text-[#B79A5E] focus:outline-none transition-colors"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Bouton Panier avec badge */}
            <Link
              href="/panier"
              className="relative tap-target-44 text-[#141414] hover:text-[#B79A5E] focus:outline-none transition-colors group"
              aria-label="Panier d'achats"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:scale-105 transition-transform" />
              {isMounted && totalCartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold text-white bg-[#141414] border border-[#FAF8F5] rounded-full shadow-sm animate-in fade-in zoom-in duration-200 tabular-nums">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Barre de recherche déroulante */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-[#EADFD7] animate-in slide-in-from-top-2 duration-200">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Rechercher un parfum, une marque, un rouge à lèvres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#DECFC4] rounded-none py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-[#A3978E] text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                autoFocus
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#A3978E]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-[#8C827A] hover:text-[#141414]"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu Mobile Drawer / Sidebar propre & responsive */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay sombre avec effet flouté */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Tiroir latéral gauche coulissant */}
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] h-full bg-[#FAF8F5] shadow-2xl flex flex-col justify-between p-6 border-r border-[#EADFD7] overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* Entête du tiroir */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EADFD7]">
                <div>
                  <span className="font-display text-xl font-bold tracking-[0.2em] text-[#141414]">
                    BELVANIA
                  </span>
                  <p className="text-[9px] uppercase tracking-widest text-[#8C827A]">
                    100% Produits Originaux
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="tap-target-44 text-[#141414] hover:text-[#B79A5E] focus:outline-none transition-colors -mr-2"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Liens de navigation Mobile */}
              <nav className="mt-6 flex flex-col space-y-3">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] transition-colors border-b border-[#F0E6DE]"
                >
                  <span>Accueil</span>
                  <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                </Link>

                <Link
                  href="/category/parfum"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] transition-colors border-b border-[#F0E6DE]"
                >
                  <span>Parfums Rares & Luxe</span>
                  <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                </Link>

                <Link
                  href="/category/makeup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] transition-colors border-b border-[#F0E6DE]"
                >
                  <span>Maquillage Haute Couture</span>
                  <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                </Link>

                <Link
                  href="/#authenticite"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] transition-colors border-b border-[#F0E6DE]"
                >
                  <span>Garantie Authenticité</span>
                  <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                </Link>

                <Link
                  href="/panier"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] transition-colors border-b border-[#F0E6DE]"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Mon Panier
                  </span>
                  <span className="text-[10px] bg-[#141414] text-white px-2 py-0.5 rounded-full font-semibold">
                    {isMounted ? totalCartCount : 0}
                  </span>
                </Link>
              </nav>
            </div>

            {/* Pied du menu mobile */}
            <div className="pt-6 border-t border-[#EADFD7] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#141414]">
                <ShieldCheck className="w-4 h-4 text-[#B79A5E] shrink-0" />
                <span className="font-medium text-[11px]">100% Produits Authentiques</span>
              </div>
              <p className="text-[10px] text-[#8C827A] leading-relaxed">
                Paiement sécurisé en espèces à la réception de votre commande.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
