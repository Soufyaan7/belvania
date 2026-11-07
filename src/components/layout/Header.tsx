'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import productsData from '@/data/products.json';
import { Product, formatPrice } from '@/types/product';

const emptySubscribe = () => () => {};

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const cartItems = useCartStore((state) => state.items);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 1. Bloquer le défilement de la page lorsque le drawer est ouvert
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  // 2. Fermer le menu lors de l'appui sur la touche Échap
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Filtrage des produits pour la recherche instantanée
  const searchResults: Product[] = searchQuery.trim().length > 1
    ? (productsData as Product[])
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EADFD7] transition-all">
      {/* 1. Bandeau d'annonce supérieur fixe */}
      <div className="bg-[#141414] text-[#F5EFEB] py-1.5 sm:py-2 px-3 text-center text-[10px] sm:text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#CBB281] shrink-0" />
        <span className="truncate">Livraison Express • Paiement à la réception (COD)</span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#CBB281] shrink-0" />
      </div>

      {/* 2. Barre de navigation principale (Desktop, Tablette, Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* GAUCHE : Bouton Hamburger (fonctionnel sur Desktop, Tablette et Mobile) + Navigation Desktop */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 min-w-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="tap-target-44 -ml-2 text-[#141414] hover:text-[#B79A5E] focus:outline-none transition-colors cursor-pointer shrink-0"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={menuOpen}
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
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
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]/80 hover:text-[#B79A5E] transition-colors whitespace-nowrap"
              >
                Authenticité 100%
              </Link>
            </nav>
          </div>

          {/* CENTRE : Logo BELVANIA Parfaitement Centré */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
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
          <div className="flex items-center justify-end space-x-1 sm:space-x-3 md:space-x-4 shrink-0">
            {/* Bouton Recherche */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="tap-target-44 text-[#141414] hover:text-[#B79A5E] focus:outline-none transition-colors cursor-pointer"
              aria-label="Recherche"
              aria-expanded={searchOpen}
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

        {/* Barre de recherche déroulante avec aperçu direct des produits */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-[#EADFD7] animate-in slide-in-from-top-2 duration-200">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Rechercher un parfum, une marque, un rouge à lèvres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#DECFC4] rounded-none py-2.5 pl-10 pr-20 text-xs tracking-wider placeholder-[#A3978E] text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                autoFocus
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#A3978E]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8C827A] hover:text-[#141414] py-1 px-1.5 transition-colors cursor-pointer"
                >
                  Effacer
                </button>
              )}

              {/* Résultats instantanés de recherche */}
              {searchQuery.trim().length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DECFC4] shadow-xl z-50 divide-y divide-[#F0E6DE] max-h-80 overflow-y-auto animate-in fade-in duration-150">
                  {searchResults.length > 0 ? (
                    searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#FAF8F5] transition-colors group text-left"
                      >
                        <div className="relative w-10 h-10 bg-[#F6F2EE] shrink-0 border border-[#EADFD7] overflow-hidden">
                          <Image
                            src={prod.images[0]}
                            alt={prod.name}
                            fill
                            sizes="40px"
                            className="object-cover object-center"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider text-[#8C827A] block truncate">
                            {prod.brand}
                          </span>
                          <span className="text-xs font-medium text-[#141414] group-hover:text-[#B79A5E] transition-colors block truncate">
                            {prod.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#141414] tabular-nums shrink-0">
                          {formatPrice(prod.price)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[#8C827A]">
                      Aucun produit trouvé pour &laquo;&nbsp;{searchQuery}&nbsp;&raquo;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu Latéral (Drawer) monté via React Portal dans document.body */}
      {isMounted &&
        menuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex">
            {/* Overlay sombre avec effet flouté couvrant 100% de la fenêtre */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in motion-reduce:animate-none"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Tiroir latéral gauche coulissant fluide et pleine hauteur */}
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu principal"
              className="relative z-10 w-[320px] max-w-[85vw] sm:w-[380px] h-full min-h-screen h-dvh bg-[#FAF8F5] shadow-2xl flex flex-col justify-between p-5 sm:p-6 border-r border-[#EADFD7] overflow-y-auto pt-safe pb-safe animate-in slide-in-from-left duration-300 motion-reduce:animate-none"
            >
              <div>
                {/* Entête du tiroir */}
                <div className="flex items-center justify-between pb-5 border-b border-[#EADFD7]">
                  <div>
                    <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#141414]">
                      BELVANIA
                    </span>
                    <p className="text-[9px] uppercase tracking-widest text-[#8C827A] mt-0.5">
                      100% Produits Originaux
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="tap-target-44 text-[#141414] hover:text-[#B79A5E] focus:outline-none transition-colors -mr-2 cursor-pointer"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>

                {/* Liens de navigation */}
                <nav className="mt-6 flex flex-col space-y-2.5">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] hover:pl-1 transition-all border-b border-[#F0E6DE]"
                  >
                    <span>Accueil</span>
                    <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                  </Link>

                  <Link
                    href="/category/parfum"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] hover:pl-1 transition-all border-b border-[#F0E6DE]"
                  >
                    <span>Parfums Rares &amp; Luxe</span>
                    <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                  </Link>

                  <Link
                    href="/category/makeup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] hover:pl-1 transition-all border-b border-[#F0E6DE]"
                  >
                    <span>Maquillage Haute Couture</span>
                    <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                  </Link>

                  <Link
                    href="/#authenticite"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] hover:pl-1 transition-all border-b border-[#F0E6DE]"
                  >
                    <span>Garantie Authenticité</span>
                    <ChevronRight className="w-4 h-4 text-[#CBB281]" />
                  </Link>

                  <Link
                    href="/panier"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-xs uppercase tracking-[0.18em] font-medium text-[#141414] hover:text-[#B79A5E] hover:pl-1 transition-all border-b border-[#F0E6DE]"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Mon Panier
                    </span>
                    <span className="text-[10px] bg-[#141414] text-white px-2 py-0.5 rounded-full font-semibold tabular-nums">
                      {isMounted ? totalCartCount : 0}
                    </span>
                  </Link>
                </nav>

                {/* Bouton d'assistance WhatsApp directe */}
                <div className="mt-6 pt-2">
                  <a
                    href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour Belvania, je souhaite des informations sur vos produits')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                    <span>Assistance WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Pied du tiroir avec réassurance luxe */}
              <div className="pt-6 mt-6 border-t border-[#EADFD7] space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#141414]">
                  <ShieldCheck className="w-4 h-4 text-[#B79A5E] shrink-0" />
                  <span className="font-medium text-[11px]">100% Produits Authentiques</span>
                </div>
                <p className="text-[10px] text-[#8C827A] leading-relaxed">
                  Paiement sécurisé en espèces à la réception de votre commande partout au Maroc.
                </p>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </header>
  );
};
