import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // SKU or SKU + options identifier
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
  stock?: number;
}

interface CartStore {
  items: CartItem[];
  savedItems: CartItem[];
  isOpen: boolean;
  
  // Cart Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Drawer Actions
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Save for Later Actions
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      savedItems: [],
      isOpen: false,
      
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      })),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
      saveForLater: (id) => set((state) => {
        const itemToSave = state.items.find((i) => i.id === id);
        if (!itemToSave) return {};
        
        // Add to savedItems if not already there
        const alreadySaved = state.savedItems.some((i) => i.id === id);
        const updatedSaved = alreadySaved 
          ? state.savedItems 
          : [...state.savedItems, itemToSave];
          
        return {
          items: state.items.filter((i) => i.id !== id),
          savedItems: updatedSaved
        };
      }),
      
      moveToCart: (id) => set((state) => {
        const itemToMove = state.savedItems.find((i) => i.id === id);
        if (!itemToMove) return {};
        
        // Add back to items
        const existingInCart = state.items.find((i) => i.id === id);
        const updatedItems = existingInCart
          ? state.items.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.items, { ...itemToMove, quantity: 1 }];
          
        return {
          savedItems: state.savedItems.filter((i) => i.id !== id),
          items: updatedItems
        };
      }),
      
      removeSaved: (id) => set((state) => ({
        savedItems: state.savedItems.filter((i) => i.id !== id)
      }))
    }),
    {
      name: "aura-cart",
    }
  )
);
