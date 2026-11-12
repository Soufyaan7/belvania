import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/product';
import productsData from '@/data/products.json';

const currentProducts = new Map(
  (productsData as Product[]).map((product) => [product.id, product])
);

export interface CartStore {
  items: CartItem[];
  addToCart: (product: Product, selectedOption?: string) => void;
  removeFromCart: (productId: string, selectedOption?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedOption?: string) => void;
  clearCart: () => void;
  restoreCartItems: (items: CartItem[]) => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, selectedOption?: string) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
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
                product,
                selectedOption,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeFromCart: (productId: string, selectedOption?: string) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.product.id !== productId) return true;
            if (selectedOption !== undefined) {
              return item.selectedOption !== selectedOption;
            }
            return false;
          }),
        }));
      },

      updateQuantity: (productId: string, quantity: number, selectedOption?: string) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, selectedOption);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            const matches =
              item.product.id === productId &&
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

      restoreCartItems: (itemsToRestore: CartItem[]) => {
        set((state) => {
          // Merge or replace items cleanly
          const merged = [...state.items];
          for (const item of itemsToRestore) {
            const idx = merged.findIndex(
              (m) =>
                m.product.id === item.product.id &&
                m.selectedOption === item.selectedOption
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
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'belvania-cart-storage',
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as CartStore;
        return {
          ...state,
          items: (state.items ?? []).flatMap((item) => {
            const product = currentProducts.get(item.product.id);
            return product ? [{ ...item, product }] : [];
          }),
        };
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
