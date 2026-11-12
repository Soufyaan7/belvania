import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirmation de Commande',
  description:
    'Votre commande Belvania Store a bien été enregistrée. Retrouvez votre récapitulatif et confirmez votre expédition sur WhatsApp.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
