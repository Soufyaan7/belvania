import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartLine, getCartLinePrice } from '@/types/product';
import productsData from '@/data/products.json';
import { ProductPack, activePacks } from '@/data/packs';

const currentProducts = new Map(
  (productsData as Product[]).map((product) => [product.id, product])
);

function normalizeCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap<CartLine>((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const line = entry as {
      kind?: 'product' | 'pack';
      pack?: { id?: string };
      product?: { id?: string };
      selectedOption?: string;
      quantity?: number;
    };
    if (!Number.isInteger(line.quantity) || (line.quantity ?? 0) < 1) return [];

    if (line.kind === 'pack') {
      const pack = activePacks.find((candidate) => candidate.id === line.pack?.id);
      return pack ? [{ kind: 'pack', pack, quantity: line.quantity! }] : [];
    }

    const product = currentProducts.get(line.product?.id ?? '');
    return product
      ? [{ kind: 'product', product, selectedOption: line.selectedOption, quantity: line.quantity! }]
      : [];
  });
}

let persistNormalizedCart: (() => void) | undefined;

export interface CartStore {
  items: CartLine[];
  addToCart: (product: Product, selectedOption?: string) => void;
  addPackToCart: (pack: ProductPack) => void;
  removeFromCart: (productId: string, selectedOption?: string, kind?: 'product' | 'pack') => void;
  updateQuantity: (productId: string, quantity: number, selectedOption?: string, kind?: 'product' | 'pack') => void;
  clearCart: () => void;
  restoreCartItems: (items: CartLine[]) => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get, api) => {
      persistNormalizedCart = () => {
        api.setState({ items: normalizeCartLines(api.getState().items) });
      };

      return ({
      items: [],

      addToCart: (product: Product, selectedOption?: string) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.kind !== 'pack' && item.product.id === product.id &&
              item.selectedOption === selectedOption
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1,
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                kind: 'product',
                product,
                selectedOption,
                quantity: 1,
              },
            ],
          };
        });
      },

      addPackToCart: (pack) => {
        const currentPack = activePacks.find((candidate) => candidate.id === pack.id);
        if (!currentPack) return;
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.kind === 'pack' && item.pack.id === currentPack.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.kind === 'pack' && item.pack.id === currentPack.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { kind: 'pack', pack: currentPack, quantity: 1 }] };
        });
      },

      removeFromCart: (productId: string, selectedOption?: string, kind: 'product' | 'pack' = 'product') => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (kind === 'pack') return item.kind !== 'pack' || item.pack.id !== productId;
            if (item.kind === 'pack' || item.product.id !== productId) return true;
            if (selectedOption !== undefined) {
              return item.selectedOption !== selectedOption;
            }
            return false;
          }),
        }));
      },

      updateQuantity: (productId: string, quantity: number, selectedOption?: string, kind: 'product' | 'pack' = 'product') => {
        if (quantity <= 0) {
          get().removeFromCart(productId, selectedOption, kind);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            const matches = kind === 'pack'
              ? item.kind === 'pack' && item.pack.id === productId
              : item.kind !== 'pack' && item.product.id === productId &&
                (selectedOption === undefined || item.selectedOption === selectedOption);

            if (matches) {
              return {
                ...item,
                quantity,
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      restoreCartItems: (itemsToRestore: CartLine[]) => {
        set((state) => {
          // Merge or replace items cleanly
          const merged = [...state.items];
          for (const item of itemsToRestore) {
            const idx = merged.findIndex(
              (m) =>
                m.kind === item.kind && (m.kind === 'pack'
                  ? item.kind === 'pack' && m.pack.id === item.pack.id
                  : item.kind !== 'pack' && m.product.id === item.product.id && m.selectedOption === item.selectedOption)
            );
            if (idx > -1) {
              merged[idx] = { ...item };
            } else {
              merged.push({ ...item });
            }
          }
          return { items: merged };
        });
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + getCartLinePrice(item) * item.quantity,
          0
        );
      },
      });
    },
    {
      name: 'belvania-cart-storage',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<CartStore>;
        return {
          ...state,
          items: normalizeCartLines(state.items),
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CartStore>;
        return {
          ...currentState,
          ...persisted,
          items: normalizeCartLines(persisted.items),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) persistNormalizedCart?.();
      },
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
