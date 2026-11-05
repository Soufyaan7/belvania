'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getWhatsAppConfirmationLink } from '@/utils/whatsapp';
import { formatPrice } from '@/types/product';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

function ThankYouInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BEL-COMMANDE';
  const total = searchParams.get('total') || '0';
  const name = searchParams.get('name') || '';
  const city = searchParams.get('city') || '';

  const [copied, setCopied] = useState(false);

  const whatsappUrl = getWhatsAppConfirmationLink(orderId, total);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-8">
      {/* Badge Félicitations */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Commande Enregistrée avec Succès</span>
      </div>

      {/* Titre Principal */}
      <div className="space-y-3">
        <div className="w-20 h-20 rounded-full bg-[#141414] text-[#CBB281] flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#141414] leading-tight">
          Merci pour votre commande chez Belvania !
        </h1>

        {name && (
          <p className="text-sm sm:text-base text-[#736A63] font-light">
            Chère / Cher <strong className="font-semibold text-[#141414]">{name}</strong>, votre sélection de prestige est en cours de préparation.
          </p>
        )}
      </div>

      {/* Carte Récapitulative du Montant & Numéro */}
      <div className="bg-white border border-[#EADFD7] p-6 sm:p-8 shadow-sm space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E6DE]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C827A] block">
              Numéro de Commande
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-display text-2xl font-bold tracking-widest text-[#141414]">
                {orderId}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="p-1.5 text-[#8C827A] hover:text-[#141414] transition-colors"
                title="Copier le numéro de commande"
              >
                {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C827A] block">
              Statut
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#2E7D32] mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              En attente de confirmation
            </span>
          </div>
        </div>

        {/* Bloc Montant Exact en Espèces (COD) */}
        <div className="p-5 bg-[#FAF8F5] border border-[#DECFC4] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C827A]">
              Montant exact à préparer en espèces :
            </span>
            <span className="font-display text-3xl font-bold text-[#141414] tracking-tight">
              {formatPrice(Number(total) || 0)}
            </span>
          </div>
          <p className="text-[11px] text-[#736A63] leading-relaxed">
            Paiement à la réception (COD). Veuillez prévoir l&apos;appoint en espèces lors de la remise en main propre par notre coursier{city ? ` à ${city}` : ''}.
          </p>
        </div>

        {/* 2. BOUTON ACTION PRINCIPAL : WHATSAPP */}
        <div className="pt-2 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] group"
          >
            <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>Confirmer ma commande sur WhatsApp</span>
          </a>

          <p className="text-[11px] text-[#8C827A] text-center">
            Cliquez pour envoyer un message de confirmation automatique à notre service client pour une expédition accélérée.
          </p>
        </div>
      </div>

      {/* Étapes du processus de livraison */}
      <div className="bg-white border border-[#EADFD7] p-6 text-left space-y-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#141414] pb-2 border-b border-[#F0E6DE]">
          Comment se déroule la suite ?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-[#FAF8F5] border border-[#EADFD7] space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#141414] text-[#CBB281] flex items-center justify-center text-xs font-bold">
              1
            </div>
            <strong className="text-xs text-[#141414] block pt-1">Appel / WhatsApp</strong>
            <p className="text-[11px] text-[#736A63] leading-relaxed">
              Un conseiller beauté Belvania vous contacte sous 2h pour valider l&apos;adresse.
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#EADFD7] space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#141414] text-[#CBB281] flex items-center justify-center text-xs font-bold">
              2
            </div>
            <strong className="text-xs text-[#141414] block pt-1">Expédition Sécurisée</strong>
            <p className="text-[11px] text-[#736A63] leading-relaxed">
              Votre colis est scellé dans notre écrin luxe et expédié en express.
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#EADFD7] space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#141414] text-[#CBB281] flex items-center justify-center text-xs font-bold">
              3
            </div>
            <strong className="text-xs text-[#141414] block pt-1">Réception &amp; Règlement</strong>
            <p className="text-[11px] text-[#736A63] leading-relaxed">
              Vous inspectez le colis et réglez le livreur en espèces en toute confiance.
            </p>
          </div>
        </div>
      </div>

      {/* Bouton retour boutique */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#141414] text-[#FAF8F5] hover:bg-[#CBB281] hover:text-[#141414] text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
        >
          <span>Continuer mes achats</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function ThankYouFallback() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-12 h-12 border-2 border-[#141414] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs uppercase tracking-widest text-[#8C827A]">
        Chargement de votre confirmation...
      </p>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ThankYouFallback />}>
          <ThankYouInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
