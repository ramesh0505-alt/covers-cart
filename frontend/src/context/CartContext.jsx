/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

// ── localStorage helpers ──────────────────────────────────────────────────────
const STORAGE_KEY = 'coverscart_cart';
const loadCart = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch (error) {
    console.error(error);
    return [];
  }
};
const saveCart = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  catch (error) {
    console.error(error);
  }
};

export function CartProvider({ children }) {
  // FIX 1: Hydrate from localStorage on mount
  const [items, setItems] = useState(() => loadCart());

  // FIX 1: Sync to localStorage on every change
  useEffect(() => { saveCart(items); }, [items]);

  const addToCart = useCallback((product, quantity = 1) => {
    // FIX 6: Normalise — accept both full product objects and flat {id,title,price,images}
    const norm = product?.product ?? product;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === norm.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === norm.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product: norm, quantity }];
    });
    toast.success(`${norm.title} added to cart!`);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + (i.product.salePrice || i.product.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
