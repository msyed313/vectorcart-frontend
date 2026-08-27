import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) { setCart(null); return; }
    setLoading(true);
    try {
      const data = await cartApi.get();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { refetch(); }, [refetch]);

  const addItem = async (productId, quantity = 1) => {
    const updated = await cartApi.addItem(productId, quantity);
    setCart(updated);
    setDrawerOpen(true);
  };

  const updateItem = async (cartItemId, quantity) => {
    const updated = await cartApi.updateItem(cartItemId, quantity);
    setCart(updated);
  };

  const removeItem = async (cartItemId) => {
    const updated = await cartApi.removeItem(cartItemId);
    setCart(updated);
  };

  return (
    <CartContext.Provider value={{
      cart, loading, drawerOpen, setDrawerOpen,
      addItem, updateItem, removeItem, refetch,
      itemCount: cart?.itemCount || 0,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}