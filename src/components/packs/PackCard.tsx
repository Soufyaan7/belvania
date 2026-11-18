'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, PackagePlus } from 'lucide-react';
import type { ProductPack } from '@/data/packs';
import { getPackProducts } from '@/data/packs';
import { formatPrice, formatImageSrc } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

export function PackCard({ pack }: { pack: ProductPack }) {
  const addPackToCart = useCartStore((state) => state.addPackToCart);
  const [added, setAdded] = useState(false);
  const included = getPackProducts(pack);

  return (
    <article className="group grid overflow-hidden border border-[#EADFD7] bg-white shadow-xs transition-shadow hover:shadow-md sm:grid-cols-[1fr_1.05fr]">
      <Link href={`/packs/${pack.slug}`} className="relative block min-h-64 overflow-hidden bg-[#F5EFEB] sm:min-h-72" aria-label={`Découvrir ${pack.name}`}>
        <Image src={formatImageSrc(pack.images[0])} alt={pack.name} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-5" />
        {pack.badge && <span className="absolute left-3 top-3 bg-[#141414] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#CBB281]">{pack.badge}</span>}
      </Link>
      <div className="flex flex-col p-5 sm:p-7">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B79A5E]">Packs Exclusifs</span>
        <Link href={`/packs/${pack.slug}`}><h3 className="mt-2 font-display text-xl font-medium text-[#141414] sm:text-2xl">{pack.name}</h3></Link>
        <ul className="mt-3 space-y-1.5 text-xs text-[#736A63]">
          {included.map(({ product, selectedOption }) => <li key={product.id}>{product.name} <span className="text-[#B79A5E]">— {selectedOption}</span></li>)}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-[#8C827A]">{pack.shortDescription}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E6DE] pt-5">
          <span className="text-lg font-bold tabular-nums text-[#141414]">{formatPrice(pack.price)}</span>
          <div className="flex gap-2">
            <Link href={`/packs/${pack.slug}`} className="inline-flex min-h-11 items-center border border-[#DECFC4] px-3 text-[10px] font-semibold uppercase tracking-wider text-[#141414] transition-colors hover:border-[#141414]">Découvrir le pack</Link>
            <button type="button" onClick={() => { addPackToCart(pack); setAdded(true); setTimeout(() => setAdded(false), 1500); }} className="inline-flex min-h-11 items-center gap-1.5 bg-[#141414] px-3 text-[10px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#CBB281] hover:text-[#141414]">
              {added ? <Check className="h-3.5 w-3.5" /> : <PackagePlus className="h-3.5 w-3.5" />}{added ? 'Ajouté' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
