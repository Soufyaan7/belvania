import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';
import { Sparkles, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CATEGORY_MAP: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
  }
> = {
  parfum: {
    title: 'Parfums',
    subtitle: 'Flacons de Voyage 10ml • 100% Originaux',
    description:
      'Découvrez notre sélection exclusive de parfums de prestige en flacons 10ml garantis 100% originaux : Yves Saint Laurent, Carolina Herrera, Givenchy, Prada, Valentino, Narciso Rodriguez, Burberry. Paiement à la réception partout au Maroc.',
  },
  makeup: {
    title: 'Maquillage',
    subtitle: 'Teint, Pommettes & Lèvres • Références Iconiques',
    description:
      'Sublimez votre éclat avec nos créations maquillage 100% authentiques : blushs fondants, correcteurs haute couvrance, huiles à lèvres et fonds de teint signés NARS, YSL, Huda Beauty, IT Cosmetics et NYX.',
  },
};

// Allow a blocking route: category parameters are required synchronously to render the catalog
export const instant = false;

export async function generateStaticParams() {
  return [{ category: 'parfum' }, { category: 'makeup' }];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORY_MAP[category.toLowerCase()];

  if (!config) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: `${config.title} | Belvania Store`,
      description: config.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const normalizedCategory = category.toLowerCase();
  const config = CATEGORY_MAP[normalizedCategory];

  if (!config) {
    notFound();
  }

  const products = (productsData as Product[]).filter(
    (p) => p.category === normalizedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-1">
        {/* Banner Catégorie */}
        <section className="bg-[#141414] text-[#FAF8F5] py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A2A2A] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#CBB281]/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-4 z-10">
            {/* Fil d'Ariane */}
            <nav className="flex items-center justify-center space-x-2 text-xs text-[#A89F96] mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <span className="text-[#CBB281] font-medium uppercase tracking-wider">
                {normalizedCategory === 'parfum' ? 'Parfums' : 'Maquillage'}
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#333333] text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#CBB281]">
              <Sparkles className="w-3 h-3 text-[#CBB281]" />
              <span>{config.subtitle}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#FAF8F5]">
              {config.title}
            </h1>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#B0A79E] leading-relaxed font-light">
              {config.description}
            </p>
          </div>
        </section>

        {/* Section Produits */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EADFD7]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
              {products.length} {products.length > 1 ? 'Créations disponibles' : 'Création disponible'}
            </span>
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-[#141414] hover:text-[#B79A5E] flex items-center gap-1 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>

          {/* Grille 2 colonnes Mobile (< 640px) & 4 colonnes Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Réassurance COD & Authenticité */}
        <section className="py-12 bg-white border-t border-[#EADFD7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-center">
              <div className="p-5 bg-[#FAF8F5] border border-[#EADFD7] flex flex-col items-center">
                <ShieldCheck className="w-8 h-8 text-[#B79A5E] mb-2" />
                <h4 className="font-display text-sm font-semibold text-[#141414] uppercase tracking-wider mb-1">
                  100% Produits Originaux
                </h4>
                <p className="text-xs text-[#736A63]">
                  Numéro de lot vérifiable. Zéro contrefaçon, garantie officielle.
                </p>
              </div>

              <div className="p-5 bg-[#FAF8F5] border border-[#EADFD7] flex flex-col items-center">
                <Truck className="w-8 h-8 text-[#B79A5E] mb-2" />
                <h4 className="font-display text-sm font-semibold text-[#141414] uppercase tracking-wider mb-1">
                  Paiement à la Réception (COD)
                </h4>
                <p className="text-xs text-[#736A63]">
                  Réglez en espèces à la livraison directement lors de la remise en main propre.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

