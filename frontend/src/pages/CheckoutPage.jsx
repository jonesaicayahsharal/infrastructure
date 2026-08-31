import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const mountRef = useRef(null);
  const { checkoutKey } = useCart();
  const [error, setError] = useState("");

  useEffect(() => {
    let checkout;
    const start = async () => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(checkoutKey) || "null");
        if (!saved?.clientSecret || !saved?.publishableKey) throw new Error("Checkout session is missing. Return to your cart and try again.");
        if (!window.Stripe) await new Promise((resolve, reject) => { const s=document.createElement("script"); s.src="https://js.stripe.com/v3/"; s.onload=resolve; s.onerror=reject; document.head.appendChild(s); });
        const stripe = window.Stripe(saved.publishableKey);
        checkout = await stripe.initEmbeddedCheckout({ clientSecret: saved.clientSecret });
        checkout.mount(mountRef.current);
      } catch (e) { setError(e.message || "Unable to load secure payment form"); }
    };
    start();
    return () => { if (checkout) checkout.destroy(); };
  }, [checkoutKey]);

  return <div className="min-h-screen pt-28 pb-16"><div className="max-w-4xl mx-auto px-6"><h1 className="text-4xl text-white font-bold mb-2">Secure Checkout</h1><p className="text-royal-400 mb-6">Complete payment without leaving Jonesaica Infrastructure Solutions.</p>{error ? <div className="glass-card border border-red-500/50 p-6"><p className="text-red-400 mb-4">{error}</p><Link to="/cart" className="btn-outline px-6 py-3 inline-block">Return to Cart</Link></div> : <div ref={mountRef} />}</div></div>;
}
