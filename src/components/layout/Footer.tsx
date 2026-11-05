'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Headphones, Sparkles, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#141414] text-[#F5EFEB] border-t border-[#2A2A2A] mt-auto">
      {/* 1. Section de Réassurance */}
      <div className="border-b border-[#262626] py-10 md:py-14 bg-[#191919]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Badge 1: 100% Authentique */}
            <div className="flex items-start space-x-4 p-4 rounded-xs bg-[#1F1F1F]/60 border border-[#2D2D2D] hover:border-[#CBB281]/50 transition-colors">
              <div className="p-3 bg-[#141414] border border-[#333333] text-[#CBB281] rounded-full shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EFEB]">
                  Produits 100% Authentiques
                </h4>
                <p className="mt-1.5 text-xs text-[#A89F96] leading-relaxed">
                  Tous nos parfums et cosmétiques sont certifiés d&apos;origine garantie, importés directement des maisons officielles.
                </p>
              </div>
            </div>

            {/* Badge 2: Paiement à la livraison */}
            <div className="flex items-start space-x-4 p-4 rounded-xs bg-[#1F1F1F]/60 border border-[#2D2D2D] hover:border-[#CBB281]/50 transition-colors">
              <div className="p-3 bg-[#141414] border border-[#333333] text-[#CBB281] rounded-full shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EFEB]">
                  Paiement à la Livraison (COD)
                </h4>
                <p className="mt-1.5 text-xs text-[#A89F96] leading-relaxed">
                  Commandez en toute sérénité sans carte bancaire préalable. Vous ne réglez qu&apos;à la réception de votre colis.
                </p>
              </div>
            </div>

            {/* Badge 3: Support Client */}
            <div className="flex items-start space-x-4 p-4 rounded-xs bg-[#1F1F1F]/60 border border-[#2D2D2D] hover:border-[#CBB281]/50 transition-colors">
              <div className="p-3 bg-[#141414] border border-[#333333] text-[#CBB281] rounded-full shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EFEB]">
                  Support Client Dédié
                </h4>
                <p className="mt-1.5 text-xs text-[#A89F96] leading-relaxed">
                  Nos conseillers beauté sont disponibles 7j/7 pour vous guider par WhatsApp ou téléphone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Corps du Footer avec liens de navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Colonne 1: Marque Belvania */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-display text-2xl font-bold tracking-[0.25em] text-[#F5EFEB]">
              BELVANIA
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-[#CBB281]">
              Haute Parfumerie & Cosmétiques
            </p>
            <p className="text-xs text-[#9E958C] leading-relaxed pr-2">
              L&apos;incarnation de l&apos;élégance et de la rareté. Découvrez nos créations olfactives prestigieuses et nos soins de maquillage emblématiques.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#333333] flex items-center justify-center text-[#A89F96] hover:text-[#CBB281] hover:border-[#CBB281] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#333333] flex items-center justify-center text-[#A89F96] hover:text-[#CBB281] hover:border-[#CBB281] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2: Univers Produits */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5EFEB] mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#CBB281]" />
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A89F96]">
              <li>
                <Link href="/#parfums" className="hover:text-[#F5EFEB] transition-colors">
                  Parfums de Niche
                </Link>
              </li>
              <li>
                <Link href="/#parfums" className="hover:text-[#F5EFEB] transition-colors">
                  Extraits de Parfum
                </Link>
              </li>
              <li>
                <Link href="/#makeup" className="hover:text-[#F5EFEB] transition-colors">
                  Rouges à Lèvres Couture
                </Link>
              </li>
              <li>
                <Link href="/#makeup" className="hover:text-[#F5EFEB] transition-colors">
                  Teint Lumineux & Glow
                </Link>
              </li>
              <li>
                <Link href="/#nouveautes" className="hover:text-[#F5EFEB] transition-colors">
                  Éditions Limitées
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Service & Informations */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5EFEB] mb-4">
              Service Client
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A89F96]">
              <li>
                <Link href="/livraison" className="hover:text-[#F5EFEB] transition-colors">
                  Modalités de Livraison
                </Link>
              </li>
              <li>
                <Link href="/paiement-cod" className="hover:text-[#F5EFEB] transition-colors">
                  Paiement à la Réception
                </Link>
              </li>
              <li>
                <Link href="/authenticite" className="hover:text-[#F5EFEB] transition-colors">
                  Certificat d&apos;Authenticité
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F5EFEB] transition-colors">
                  Foire Aux Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5EFEB] transition-colors">
                  Contactez un Conseiller
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Newsletter Privilège */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5EFEB] mb-4">
              Cercle Privilège
            </h5>
            <p className="text-xs text-[#9E958C] leading-relaxed mb-4">
              Recevez en avant-première nos arrivages exclusifs et invitations privées.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Votre adresse email..."
                  className="w-full bg-[#1F1F1F] border border-[#333333] px-3.5 py-2.5 text-xs text-white placeholder-[#787068] focus:outline-none focus:border-[#CBB281] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#FAF8F5] text-[#141414] hover:bg-[#CBB281] transition-colors flex items-center justify-center"
                  aria-label="S'inscrire"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-[#787068] block">
                Zéro spam, désinscription à tout moment.
              </span>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Copyright et mentions */}
      <div className="border-t border-[#242424] py-6 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-[#736A63]">
          <p>© 2026 Belvania Store. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/mentions-legales" className="hover:text-[#A89F96] transition-colors">
              Mentions Légales
            </Link>
            <Link href="/confidentialite" className="hover:text-[#A89F96] transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/cgv" className="hover:text-[#A89F96] transition-colors">
              Conditions Générales de Vente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
