import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = productsData as Product[];
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = productsData as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  return {
    title: `${product.name} - ${product.brand}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Belvania Store`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const products = productsData as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />
      <main className="flex-1">
        <ProductDetailView product={product} />
      </main>
      <Footer />
    </div>
  );
}
