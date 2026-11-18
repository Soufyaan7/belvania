import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PackDetailView } from '@/components/packs/PackDetailView';
import { getPackBySlug } from '@/data/packs';

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pack = getPackBySlug(slug);
  if (!pack) notFound();
  return <div className="flex min-h-screen flex-col bg-[#FAF8F5]"><Header /><main className="flex-1"><PackDetailView pack={pack} /></main><Footer /></div>;
}
