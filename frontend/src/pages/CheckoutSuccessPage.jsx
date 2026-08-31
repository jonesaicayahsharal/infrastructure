import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { useCart } from "../context/CartContext";

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    if (!sessionId) { setStatus("missing"); return; }
    let cancelled = false;
    const check = async () => {
      try { const {data}=await axios.get(`${API}/payments/checkout-status/${sessionId}`); if (!cancelled) { setStatus(data.payment_status); if (data.payment_status === "paid") clearCart(); } } catch { if (!cancelled) setStatus("pending"); }
    };
    check(); const timer=setInterval(check,2500); return () => { cancelled=true; clearInterval(timer); };
  }, [sessionId]);
  return <div className="min-h-screen pt-32 px-6 text-center"><div className="max-w-xl mx-auto glass-card border border-royal-700 p-8"><h1 className="text-3xl text-white font-bold mb-4">{status === "paid" ? "Payment Received" : "Confirming Payment"}</h1><p className="text-royal-300 mb-6">{status === "paid" ? "Your order is recorded and payment has been confirmed." : "We are confirming the payment with Stripe. This normally takes only a moment."}</p><Link to="/products" className="btn-gold inline-block px-8 py-3">Return to Products</Link></div></div>;
}
