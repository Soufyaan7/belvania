import { NextResponse } from 'next/server';

// 19. Cache d'idempotence (Idempotency Key / Déduplication Stripe-style)
const idempotencyCache = new Map<
  string,
  { response: { success: boolean; orderId: string; message: string }; timestamp: number }
>();

function cleanExpiredKeys() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;
  for (const [key, value] of idempotencyCache.entries()) {
    if (now - value.timestamp > maxAge) {
      idempotencyCache.delete(key);
    }
  }
}

export interface CheckoutPayload {
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: Array<{
    id: string;
    name: string;
    brand: string;
    selectedOption?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}

export async function POST(request: Request) {
  try {
    // 19. Vérification de la clé d'idempotence
    const idempotencyKey =
      request.headers.get('idempotency-key') ||
      request.headers.get('Idempotency-Key');

    if (idempotencyKey) {
      cleanExpiredKeys();
      const cached = idempotencyCache.get(idempotencyKey);
      if (cached) {
        return NextResponse.json(cached.response, {
          headers: { 'X-Idempotent-Replay': 'true' },
        });
      }
    }

    const data: CheckoutPayload = await request.json();

    // 1. Validation de base
    if (!data.customer?.phone || !data.customer?.fullName || !data.customer?.city) {
      return NextResponse.json(
        { success: false, error: 'Veuillez renseigner votre nom, téléphone et ville.' },
        { status: 400 }
      );
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Votre commande ne contient aucun article.' },
        { status: 400 }
      );
    }

    // 2. Génération d'un numéro de commande unique (ex: BEL-4829)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BEL-${randomSuffix}`;
    const orderDate = new Date().toLocaleString('fr-FR', {
      timeZone: 'Africa/Casablanca',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    // 3. Formatage de la liste des articles pour le tableur / webhook
    const itemsSummary = data.items
      .map(
        (item) =>
          `${item.name} (${item.brand})${
            item.selectedOption ? ` [${item.selectedOption}]` : ''
          } x ${item.quantity} = ${item.price * item.quantity} DH`
      )
      .join('\n');

    // 4. Payload formaté pour Google Apps Script / Webhook (colonnes A à J)
    const webhookPayload = {
      date: orderDate,
      orderId,
      customerName: data.customer.fullName,
      phone: data.customer.phone,
      city: data.customer.city,
      address: data.customer.address || 'Non spécifiée',
      items: itemsSummary,
      totalAmount: data.totalAmount,
      notes: data.customer.notes || '',
      status: 'En attente de confirmation',
    };

    // 5. Envoi vers Google Script Webhook — URL serveur uniquement (sans NEXT_PUBLIC_)
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (googleScriptUrl && googleScriptUrl.startsWith('http')) {
      let sheetWriteOk = false;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        let scriptResponse: Response;
        try {
          // Content-Type: 'text/plain;charset=utf-8' évite les prévols CORS (OPTIONS)
          scriptResponse = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(webhookPayload),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }

        if (scriptResponse.ok) {
          try {
            const scriptData = await scriptResponse.json() as { success?: boolean; duplicate?: boolean; orderId?: string };
            sheetWriteOk = scriptData.success === true;
            if (scriptData.duplicate) {
              // Double idempotence côté Apps Script — considéré comme succès
              sheetWriteOk = true;
            }
          } catch {
            // Apps Script a répondu 200 mais sans JSON valide — on accepte
            sheetWriteOk = true;
          }
        }
      } catch (webhookErr) {
        console.error('[Belvania] Erreur Webhook Google Script:', webhookErr);
        sheetWriteOk = false;
      }

      if (!sheetWriteOk) {
        return NextResponse.json(
          { success: false, error: 'La commande n\'a pas pu être enregistrée. Veuillez réessayer ou contacter le support.' },
          { status: 502 }
        );
      }
    } else {
      // Pas d'URL configurée : mode développement local — on simule l'enregistrement
      console.log('ℹ️ [Belvania Store] GOOGLE_SCRIPT_URL non configurée. Commande simulée :', {
        orderId,
        customer: data.customer,
        total: data.totalAmount,
      });
    }

    const responsePayload = {
      success: true,
      orderId,
      message: 'Commande enregistrée avec succès.',
    };

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, {
        response: responsePayload,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Erreur API Checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue lors de la commande.' },
      { status: 500 }
    );
  }
}
