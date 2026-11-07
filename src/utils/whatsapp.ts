/**
 * Utilitaires WhatsApp pour Belvania Store
 */

export function getWhatsAppConfirmationLink(
  orderId: string,
  total: number | string,
  customNumber?: string
): string {
  const number = customNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) {
    console.error('[Belvania] NEXT_PUBLIC_WHATSAPP_NUMBER non configuré dans .env.local');
    return '#whatsapp-non-configure';
  }
  const cleanNumber = number.replace(/\D/g, '');

  const text = `Bonjour Belvania, je confirme ma commande ${orderId} d'un montant de ${total} DH.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppDirectOrderLink({
  fullName,
  phone,
  city,
  address,
  items,
  total,
  customNumber,
}: {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  items: string;
  total: number;
  customNumber?: string;
}): string {
  const number = customNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) {
    console.error('[Belvania] NEXT_PUBLIC_WHATSAPP_NUMBER non configuré dans .env.local');
    return '#whatsapp-non-configure';
  }
  const cleanNumber = number.replace(/\D/g, '');

  const text = `Bonjour Belvania Store, je souhaite valider ma commande :
- Nom : ${fullName || 'Non spécifié'}
- Téléphone : ${phone || 'Non spécifié'}
- Ville : ${city || 'Casablanca'}
- Adresse : ${address || 'À préciser'}
- Articles commandés :
${items}
- Total à payer : ${total} DH (Paiement à la livraison COD)`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
