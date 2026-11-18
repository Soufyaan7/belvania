import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { activePacks } from '@/data/packs';
import { PackCard } from '@/components/packs/PackCard';

export function PacksSection() {
  if (activePacks.length === 0) return null;
  return (
    <section className="py-12 sm:py-16" aria-labelledby="packs-exclusifs-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#DECFC4] pb-4">
          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B79A5E]">
              Sélections à partager
            </span>
            <h2 id="packs-exclusifs-title" className="font-display text-2xl font-medium text-[#141414] sm:text-3xl">
              Packs Exclusifs
            </h2>
          </div>
          <Link
            href="/packs"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#736A63] hover:text-[#141414]"
          >
            Tous les packs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
          {activePacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  );
}
