import rates from '@/data/ameex-rabat-rates.json';

export interface AmeexDestination {
  destination: string;
  fee: number;
}

export const ameexDestinations = rates as AmeexDestination[];

export function normalizeDestination(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .trim()
    .replace(/\s+/g, ' ');
}

const destinationRates = new Map<string, AmeexDestination | null>();
for (const entry of ameexDestinations) {
  const key = normalizeDestination(entry.destination);
  const existing = destinationRates.get(key);
  if (existing === undefined) {
    destinationRates.set(key, entry);
  } else if (existing === null || existing.fee !== entry.fee) {
    destinationRates.set(key, null);
  }
}

export function findAmeexDestination(value: string): AmeexDestination | undefined {
  return destinationRates.get(normalizeDestination(value)) ?? undefined;
}
