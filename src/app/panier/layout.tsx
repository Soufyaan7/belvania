import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Panier | Belvania Store',
  description:
    'Consultez les articles sélectionnés dans votre panier Belvania Store et finalisez votre commande avec le paiement à la livraison (COD).',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
