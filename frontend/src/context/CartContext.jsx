import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "jonesaica_cart_v1";
const CHECKOUT_KEY = "jonesaica_checkout_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => {
    const handler = (event) => addItem(event.detail);
    window.addEventListener("jonesaica:add-to-cart", handler);
    return () => window.removeEventListener("jonesaica:add-to-cart", handler);
  });

  const addItem = (product) => setItems(current => {
    const found = current.find(i => i.product_id === product.id);
    if (found) return current.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...current, { product_id: product.id, name: product.name, price: Number(product.sale_price), image: product.image_url, quantity: 1 }];
  });
  const setQuantity = (id, quantity) => setItems(current => quantity <= 0 ? current.filter(i => i.product_id !== id) : current.map(i => i.product_id === id ? { ...i, quantity } : i));
  const clearCart = () => { setItems([]); localStorage.removeItem(CART_KEY); sessionStorage.removeItem(CHECKOUT_KEY); };
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const value = useMemo(() => ({ items, addItem, setQuantity, clearCart, count, total, checkoutKey: CHECKOUT_KEY }), [items, count, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
