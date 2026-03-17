import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item.id === product.id 
                ? { ...item, quantity: (item.quantity || 1) + 1 } 
                : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
      },
      

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, action) => {
        set({
          cart: get().cart.map((item) => {
            if (item.id === productId) {
              const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
              return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      },

      getItemCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
      
    }),
    { name: 'it-arena-cart' } // Persists cart in local storage
    
  )
  
);