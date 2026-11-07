import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCatalogSection } from '@/components/home/ProductCatalogSection';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  PackageCheck,
  Headphones,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Parfums',
    subtitle: 'Flacons de Voyage 10ml • 100% Originaux',
    slug: 'parfum',
    href: '/category/parfum',
    count: '10 Créations d\'Exception',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Maquillage',
    subtitle: 'Teint, Lèvres & Pommettes • Haute Couture',
    slug: 'makeup',
    href: '/category/makeup',
    count: '10 Créations Iconiques',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function HomePage() {
  const products = productsData as Product[];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Banner Élégant */}
        <section className="relative overflow-hidden bg-[#141414] text-[#FAF8F5] py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 border-b border-[#2A2A2A]">
          {/* Subtle luxury ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#CBB281]/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-7 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1F1F] border border-[#333333] text-[11px] uppercase tracking-[0.25em] text-[#CBB281] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#CBB281]" />
              <span>Maison de Haute Beauté • Paris</span>
              <Sparkles className="w-3.5 h-3.5 text-[#CBB281]" />
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#FAF8F5] leading-[1.15] max-w-4xl mx-auto">
              Parfums &amp; Maquillage de Marque <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#E8DDD2]">100% Originaux</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-[#B0A79E] leading-relaxed tracking-wide font-light">
              L&apos;assurance de créations authentiques directement issues des plus prestigieuses maisons.
              Commandez en toute confiance avec notre service de <strong>Paiement à la Réception (COD)</strong> partout à domicile.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#meilleures-ventes"
                className="w-full sm:w-auto px-9 py-4 bg-[#FAF8F5] text-[#141414] hover:bg-[#CBB281] hover:text-[#141414] text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-200 flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Découvrir la collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#pourquoi-belvania"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#FAF8F5]/30 text-[#FAF8F5] hover:border-[#CBB281] hover:text-[#CBB281] text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-200"
              >
                Garantie Authenticité
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Carrousel / Grille de Catégories (Mobile-First) */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B79A5E] block mb-1">
              Univers d&apos;Exception
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#141414]">
              Explorer par Catégorie
            </h2>
            <div className="w-12 h-0.5 bg-[#CBB281] mx-auto mt-3" />
          </div>

          {/* Grille 2 Grandes Catégories Officielles : Parfums & Maquillage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative overflow-hidden aspect-4/3 sm:aspect-16/9 bg-[#141414] border border-[#EADFD7] hover:border-[#141414] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  className="object-cover object-center brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white flex flex-col justify-end">
                  <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#CBB281] font-semibold block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-wide">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF8F5]/80 mt-1 font-light max-w-md">
                    {cat.subtitle}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF8F5] group-hover:text-[#CBB281] transition-colors">
                    <span>Explorer la collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Section "Meilleures Ventes & Nouveautés" avec filtrage */}
        <ProductCatalogSection products={products} />

        {/* 4. Section d'engagement "Pourquoi Belvania ?" */}
        <section id="authenticite" className="scroll-mt-20 py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pourquoi-belvania" className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex p-3 rounded-full bg-[#141414] text-[#CBB281] mb-3">
              <BadgeCheck className="w-8 h-8 stroke-[1.5]" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B79A5E] block mb-1">
              Confiance &amp; Sérénité
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-medium text-[#141414]">
              Pourquoi Choisir Belvania ?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#736A63] leading-relaxed">
              Dans un marché envahi de contrefaçons, Belvania s&apos;érige en sanctuaire d&apos;authenticité absolue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Pilier 1 : 100% Produits Originaux */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADFD7] hover:border-[#141414] transition-all duration-300">
              <div className="w-12 h-12 rounded-none bg-[#FAF8F5] border border-[#EADFD7] flex items-center justify-center text-[#B79A5E] mb-5">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#141414] mb-2">
                100% Originaux Certifiés
              </h3>
              <p className="text-xs text-[#736A63] leading-relaxed">
                Chaque flacon et article possède son numéro de lot (batch code) vérifiable. Aucun testeur, aucun duplicata, uniquement l&apos;officiel.
              </p>
            </div>

            {/* Pilier 2 : Paiement à la réception (COD) */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADFD7] hover:border-[#141414] transition-all duration-300">
              <div className="w-12 h-12 rounded-none bg-[#FAF8F5] border border-[#EADFD7] flex items-center justify-center text-[#B79A5E] mb-5">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#141414] mb-2">
                Paiement à la Livraison
              </h3>
              <p className="text-xs text-[#736A63] leading-relaxed">
                Zéro paiement en ligne requis à l&apos;avance. Vous commandez et vous réglez en toute tranquillité en espèces lors de la remise en main propre.
              </p>
            </div>

            {/* Pilier 3 : Emballage Soigné & Express */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADFD7] hover:border-[#141414] transition-all duration-300">
              <div className="w-12 h-12 rounded-none bg-[#FAF8F5] border border-[#EADFD7] flex items-center justify-center text-[#B79A5E] mb-5">
                <PackageCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#141414] mb-2">
                Écrin Luxe &amp; Express
              </h3>
              <p className="text-xs text-[#736A63] leading-relaxed">
                Vos commandes sont protégées dans des coffrets premium scellés pour préserver intacte la pyramide olfactive de chaque précieux nectar.
              </p>
            </div>

            {/* Pilier 4 : Conseils Beauté Dédiés */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADFD7] hover:border-[#141414] transition-all duration-300">
              <div className="w-12 h-12 rounded-none bg-[#FAF8F5] border border-[#EADFD7] flex items-center justify-center text-[#B79A5E] mb-5">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#141414] mb-2">
                Conseillers Privés 7j/7
              </h3>
              <p className="text-xs text-[#736A63] leading-relaxed">
                Une question sur la tenue d&apos;un sillage ou sur le choix de votre carnation ? Nos spécialistes beauté vous guident immédiatement.
              </p>
            </div>
          </div>

          {/* Bandeau de réassurance synthétique */}
          <div className="mt-12 p-6 bg-[#141414] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-[#CBB281] font-semibold">
                Garantie Inconditionnelle Belvania
              </span>
              <p className="text-sm font-display text-[#FAF8F5]">
                Produit non conforme ou emballage altéré ? Échange immédiat sans frais.
              </p>
            </div>
            <Link
              href="#meilleures-ventes"
              className="px-6 py-3 bg-[#FAF8F5] text-[#141414] hover:bg-[#CBB281] transition-colors text-xs uppercase tracking-widest font-semibold shrink-0"
            >
              Commander maintenant
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
