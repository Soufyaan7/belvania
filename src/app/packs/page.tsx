import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PackCard } from '@/components/packs/PackCard';
import { activePacks } from '@/data/packs';

export default function PacksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <nav className="mb-6 text-xs text-[#8C827A]">
          <Link href="/" className="hover:text-[#141414]">
            Accueil
          </Link>{' '}
          / Packs Exclusifs
        </nav>
        <div className="mb-8 border-b border-[#DECFC4] pb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B79A5E]">
            Compositions choisies
          </span>
          <h1 className="mt-1 font-display text-3xl font-medium text-[#141414] sm:text-4xl">
            Packs Exclusifs
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#736A63]">
            Des essentiels de grandes maisons réunis dans des offres combinées.
          </p>
        </div>
        {activePacks.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {activePacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        ) : (
          <div className="border border-[#EADFD7] bg-white px-6 py-14 text-center">
            <h2 className="font-display text-xl font-medium text-[#141414]">
              Aucun pack disponible pour le moment
            </h2>
            <p className="mt-2 text-sm text-[#736A63]">
              De nouvelles compositions seront bientôt proposées.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
