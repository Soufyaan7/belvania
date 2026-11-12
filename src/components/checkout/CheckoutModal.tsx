'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  User,
  MapPin,
  Building,
  MessageCircle,
} from 'lucide-react';
import { Product, formatPrice, formatImageSrc } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { getWhatsAppConfirmationLink, getWhatsAppDirectOrderLink } from '@/utils/whatsapp';
import { ameexDestinations, findAmeexDestination } from '@/utils/ameex';

export interface CheckoutItem {
  product: Product;
  selectedOption?: string;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Si directItem est fourni, on commande ce produit directement (Achat Express)
  // Sinon, on commande l'ensemble du panier Zustand
  directItem?: CheckoutItem;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directItem,
}) => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // Détermine la liste des articles à commander
  const itemsToOrder: CheckoutItem[] = directItem
    ? [directItem]
    : cartItems;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Calculs financiers
  const subtotal = itemsToOrder.reduce(
    (acc, it) => acc + it.product.price * it.quantity,
    0
  );
  const selectedDestination = findAmeexDestination(city);
  const shippingFee = selectedDestination?.fee;
  const totalAmount = shippingFee === undefined ? null : subtotal + shippingFee;

  // État du formulaire

  // États d'envoi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // 19. Idempotency Key (UUID conservé lors des réessais pour éviter les doublons)
  const idempotencyKeyRef = React.useRef<string>('');

  React.useEffect(() => {
    if (isOpen && !idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
  }, [isOpen]);

  // 10. Swipe-to-dismiss gesture sur bottom sheet mobile
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = React.useRef(0);
  const touchStartTimeRef = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = e.timeStamp;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartYRef.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const elapsed = Math.max(1, e.timeStamp - touchStartTimeRef.current);
    const velocity = dragY / elapsed; // px/ms
    if (dragY > 110 || velocity > 0.4) {
      setDragY(450);
      setTimeout(() => {
        handleModalClose();
        setDragY(0);
      }, 150);
    } else {
      setDragY(0);
    }
  };

  if (!isOpen) return null;

  // Formatage des articles pour WhatsApp et webhook
  const itemsTextSummary = itemsToOrder
    .map(
      (item) =>
        `- ${item.product.name} (${item.product.brand})${
          item.selectedOption ? ` [${item.selectedOption}]` : ''
        } x ${item.quantity} = ${item.product.price * item.quantity} DH`
    )
    .join('\n');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError('Veuillez saisir votre nom et prénom.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setError('Veuillez renseigner un numéro de téléphone valide pour la livraison.');
      return;
    }

    if (!address.trim()) {
      setError('Veuillez indiquer votre adresse de livraison ou quartier.');
      return;
    }

    if (!selectedDestination || shippingFee === undefined || totalAmount === null) {
      setError('Destination inconnue. Please verify your city pour calculer les frais de livraison.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          city,
          address: address.trim(),
          notes: notes.trim(),
        },
        items: itemsToOrder.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          brand: it.product.brand,
          selectedOption: it.selectedOption,
          price: it.product.price,
          quantity: it.quantity,
        })),
        subtotal,
        shippingFee,
        totalAmount,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKeyRef.current,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande.');
      }

      setConfirmedOrderId(data.orderId);
      idempotencyKeyRef.current = '';

      // 1. Toujours vider le panier Zustand
      clearCart();

      // 2. Redirection fluide vers la page de confirmation /thank-you
      const redirectUrl = `/thank-you?orderId=${encodeURIComponent(
        data.orderId
      )}&total=${encodeURIComponent(totalAmount)}&name=${encodeURIComponent(
        fullName.trim()
      )}&city=${encodeURIComponent(city)}`;

      onClose();
      router.push(redirectUrl);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'La connexion au serveur a pris du retard. Vous pouvez valider directement sur WhatsApp ci-dessous.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (confirmedOrderId) {
      setConfirmedOrderId(null);
      setFullName('');
      setPhone('');
      setAddress('');
      setNotes('');
      idempotencyKeyRef.current = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Overlay fond sombre */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleModalClose}
      />

      {/* Boîte de dialogue Bottom Sheet Mobile & Centrée Desktop */}
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-t-2xl sm:rounded-none max-h-[90vh] pb-safe flex flex-col shadow-2xl border-t sm:border border-[#EADFD7] z-10 overflow-hidden animate-in slide-in-from-bottom duration-300 sm:zoom-in-95 motion-reduce:animate-none"
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Poignée de tirage tactile Bottom Sheet (Mobile uniquement) */}
        <div
          className="w-full pt-3 pb-2 cursor-grab active:cursor-grabbing sm:hidden shrink-0 touch-none flex justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Glisser vers le bas pour fermer"
        >
          <div className="w-12 h-1.5 bg-[#DECFC4] rounded-full" />
        </div>

        {/* Entête du Modal */}
        <div
          className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EADFD7] bg-white touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CBB281]" />
            <h2 className="font-display text-base sm:text-xl font-semibold text-[#141414] tracking-wide">
              {confirmedOrderId ? 'Commande Confirmée' : 'Commande Express (COD)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="tap-target-44 text-[#8C827A] hover:text-[#141414] transition-colors -mr-2"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Corps du Modal avec scroll fluide interne */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {confirmedOrderId ? (
            /* ================= VUE SUCCÈS ================= */
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#B79A5E] font-semibold block mb-1">
                  Merci pour votre confiance
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#141414]">
                  Votre commande a été enregistrée !
                </h3>
              </div>

              {/* Numéro de commande */}
              <div className="p-4 bg-white border border-[#EADFD7] max-w-sm mx-auto shadow-xs">
                <span className="text-xs text-[#8C827A] uppercase tracking-wider block">
                  Numéro de Commande
                </span>
                <span className="font-display text-2xl font-bold tracking-widest text-[#141414]">
                  {confirmedOrderId}
                </span>
              </div>

              {/* Instructions de livraison */}
              <div className="p-4 bg-[#F5EFEB] border border-[#DECFC4] max-w-md mx-auto text-xs text-[#736A63] leading-relaxed space-y-2 text-left">
                <p className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#B79A5E] shrink-0 mt-0.5" />
                  <span>
                    Notre service client vous contactera par téléphone ou WhatsApp au <strong>{phone}</strong> pour confirmer votre adresse avant l&apos;envoi.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-[#B79A5E] shrink-0 mt-0.5" />
                  <span>
                    Montant total à régler en espèces à la livraison : <strong>{totalAmount === null ? 'Choisir une ville' : formatPrice(totalAmount)}</strong>.
                  </span>
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppConfirmationLink(confirmedOrderId, totalAmount as number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Confirmer sur WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#141414] text-[#FAF8F5] hover:bg-[#CBB281] hover:text-[#141414] text-xs font-semibold uppercase tracking-[0.2em] transition-all"
                >
                  Retourner à la boutique
                </button>
              </div>
            </div>
          ) : (
            /* ================= VUE FORMULAIRE ================= */
            <>
              {/* Récapitulatif Produit(s) */}
              <div className="bg-white border border-[#EADFD7] p-3 sm:p-4">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8C827A] block mb-2.5">
                  Articles commandés ({itemsToOrder.reduce((acc, it) => acc + it.quantity, 0)})
                </span>

                <div className="space-y-2.5 divide-y divide-[#F0E6DE]">
                  {itemsToOrder.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-3 ${idx > 0 ? 'pt-2.5' : ''}`}>
                      <div className="relative w-12 h-14 sm:w-14 sm:h-16 bg-[#F6F2EE] border border-[#EADFD7] shrink-0 overflow-hidden">
                        <Image
                          src={formatImageSrc(item.product.images[0])}
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 639px) 48px, 56px"
                          className="object-contain object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#8C827A] block">
                          {item.product.brand}
                        </span>
                        <h4 className="text-xs font-medium text-[#141414] truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] sm:text-[11px] text-[#736A63]">
                          {item.selectedOption ? `${item.selectedOption} • ` : ''}Qté: {item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#141414]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synthèse des coûts */}
                <div className="mt-3.5 pt-2.5 border-t border-[#EADFD7] space-y-1 text-xs text-[#736A63]">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-medium text-[#141414]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span className="font-medium text-[#141414]">{shippingFee === undefined ? 'To be calculated' : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#141414] pt-2 border-t border-[#DECFC4]">
                    <span>Total à payer à la réception</span>
                    <span className="text-base text-[#141414]">{totalAmount === null ? 'Choisir une ville' : formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Formulaire de coordonnées de livraison */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8C827A] block">
                  Informations de livraison
                </span>

                {/* Bloc d'erreur avec Fallback WhatsApp */}
                {error && (
                  <div className="p-3 bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>

                    {totalAmount !== null && <div className="pt-1">
                      <a
                        href={getWhatsAppDirectOrderLink({
                          fullName: fullName.trim(),
                          phone: phone.trim(),
                          city,
                          address: address.trim(),
                          items: itemsTextSummary,
                          total: totalAmount as number,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                        <span>Commander directement sur WhatsApp</span>
                      </a>
                    </div>}
                  </div>
                )}

                {/* Nom & Prénom */}
                <div>
                  <label className="block text-xs font-semibold text-[#141414] mb-1 uppercase tracking-wider">
                    Nom &amp; Prénom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fatima Zahra Alami"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#DECFC4] px-3.5 py-2 pl-9 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                    />
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-[#A89F96]" />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs font-semibold text-[#141414] mb-1 uppercase tracking-wider">
                    Numéro de Téléphone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#DECFC4] px-3.5 py-2 pl-9 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                    />
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#A89F96]" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-[#8C827A] mt-1 block">
                    Notre livreur vous appellera sur ce numéro avant son passage.
                  </span>
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-xs font-semibold text-[#141414] mb-1 uppercase tracking-wider">
                    Ville *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="ameex-destinations"
                      autoComplete="address-level2"
                      placeholder="Rechercher une ville"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onBlur={() => {
                        const match = findAmeexDestination(city);
                        if (match) setCity(match.destination);
                      }}
                      className="w-full bg-white border border-[#DECFC4] px-3.5 py-2 pl-9 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                    />
                    <datalist id="ameex-destinations">
                      {ameexDestinations.map((entry, index) => (
                        <option key={`${entry.destination}-${index}`} value={entry.destination} />
                      ))}
                    </datalist>
                    <Building className="absolute left-3 top-2.5 w-4 h-4 text-[#A89F96] pointer-events-none" />
                  </div>
                  {city && !selectedDestination && (
                    <p role="alert" className="mt-1 text-xs text-[#C62828]">
                      Ville non reconnue. Verifiez votre destination pour calculer les frais.
                    </p>
                  )}
                </div>

                {/* Adresse complète */}
                <div>
                  <label className="block text-xs font-semibold text-[#141414] mb-1 uppercase tracking-wider">
                    Adresse Complète de Livraison *
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={2}
                      placeholder="Ex: Boulevard d'Anfa, Résidence Les Fleurs, Appt 4..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-[#DECFC4] px-3.5 py-2 pl-9 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors resize-none"
                    />
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#A89F96]" />
                  </div>
                </div>

                {/* Remarques */}
                <div>
                  <label className="block text-[10px] font-medium text-[#736A63] mb-1">
                    Instructions particulières (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Livrer l'après-midi..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-[#DECFC4] px-3.5 py-1.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                  />
                </div>

                {/* Badge de réassurance COD */}
                <div className="p-2.5 bg-[#FAF8F5] border border-[#DECFC4] flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#141414] text-[#CBB281] rounded-full shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#736A63] leading-snug">
                    <strong className="text-[#141414] block">Zéro Paiement en Ligne Requis</strong>
                    Paiement en espèces uniquement à la remise de votre colis.
                  </div>
                </div>

                {/* Bouton de Soumission */}
                <div className="pt-1 pb-2">
                  <button
                    type="submit"
                    disabled={loading || !selectedDestination}
                    className="w-full py-3.5 px-5 bg-[#141414] text-[#FAF8F5] hover:bg-[#CBB281] hover:text-[#141414] active:scale-[0.99] text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enregistrement en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Valider la commande • {totalAmount === null ? 'Choisir une ville' : formatPrice(totalAmount)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
