'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import type { ProductPack } from '@/data/packs';
import { getPackProducts } from '@/data/packs';
import { formatPrice, formatImageSrc } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';

export function PackDetailView({ pack }: { pack: ProductPack }) {
  const contents = getPackProducts(pack);
  const addPackToCart = useCartStore((state) => state.addPackToCart);
  const [quantity, setQuantity] = useState(1);
  const selectedImage = pack.images[0];
  const [added, setAdded] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const handleAdd = () => {
    for (let index = 0; index < quantity; index += 1) addPackToCart(pack);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return <>
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-12 md:pb-12 lg:px-8">
      <nav className="mb-7 text-xs text-[#8C827A]"><Link href="/" className="hover:text-[#141414]">Accueil</Link> / <Link href="/packs" className="hover:text-[#141414]">Packs Exclusifs</Link> / <span className="text-[#141414]">{pack.name}</span></nav>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="bg-[#F5EFEB] p-3 sm:p-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-white"><Image src={formatImageSrc(selectedImage)} alt={`${pack.name} et ses parfums`} fill sizes="(max-width: 1023px) 90vw, 45vw" priority className="object-contain p-2 sm:p-4" /></div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#B79A5E]">{pack.badge ?? 'Packs Exclusifs'}</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-[#141414] sm:text-4xl">{pack.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#736A63]">{pack.detailedDescription}</p>
          <div className="mt-6 border-y border-[#EADFD7] py-5"><h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8C827A]">Le duo comprend</h2><ul className="mt-3 space-y-3">{contents.map(({ product, quantity: count, selectedOption }) => <li key={product.id} className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-[#141414]">{product.name}</span><span className="shrink-0 text-xs text-[#8C827A]">{selectedOption}{count > 1 ? ` × ${count}` : ''}</span></li>)}</ul></div>
          <div className="mt-5 text-2xl font-bold tabular-nums text-[#141414]">{formatPrice(pack.price)}</div>
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-[auto_1fr_1fr]">
            <div className="col-span-2 flex h-12 w-fit items-center border border-[#DECFC4] bg-white md:col-span-1"><button type="button" aria-label="Diminuer la quantité" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-11 w-11"><Minus className="mx-auto h-3.5 w-3.5" /></button><span className="w-7 text-center text-xs font-semibold tabular-nums">{quantity}</span><button type="button" aria-label="Augmenter la quantité" onClick={() => setQuantity((value) => value + 1)} className="h-11 w-11"><Plus className="mx-auto h-3.5 w-3.5" /></button></div>
            <button type="button" onClick={() => setCheckoutOpen(true)} className="flex min-h-12 min-w-0 w-full items-center justify-center gap-1.5 bg-[#141414] px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-white hover:bg-[#CBB281] hover:text-[#141414] sm:text-xs"><Sparkles className="h-4 w-4 shrink-0 text-[#CBB281]" /><span>Acheter maintenant</span></button>
            <button type="button" onClick={handleAdd} className="flex min-h-12 min-w-0 w-full items-center justify-center gap-1.5 border border-[#DECFC4] bg-white px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-[#141414] hover:border-[#141414] sm:text-xs">{added ? <Check className="h-4 w-4 shrink-0" /> : <ShoppingBag className="h-4 w-4 shrink-0" />}<span>{added ? 'Ajouté' : 'Ajouter au panier'}</span></button>
          </div>
          {added && <p className="mt-3 text-xs text-[#2E7D32]">Pack ajouté au panier. <Link href="/panier" className="underline">Voir le panier</Link></p>}
        </div>
      </div>
    </div>
    <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} directItem={{ kind: 'pack', pack, quantity }} />
  </>;
}
