import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, setQuantity, total, checkoutKey } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: "", customer_email: "", customer_phone: "", shipping_parish: "", shipping_district: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const money = n => new Intl.NumberFormat("en-JM", { style: "currency", currency: "JMD", maximumFractionDigits: 0 }).format(n);

  const checkout = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/payments/create-checkout`, { ...form, items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })), origin_url: window.location.origin });
      if (!data.client_secret || !data.publishable_key) throw new Error("Stripe checkout keys are not configured on the server.");
      sessionStorage.setItem(checkoutKey, JSON.stringify({ clientSecret: data.client_secret, publishableKey: data.publishable_key, sessionId: data.session_id, orderId: data.order_id }));
      navigate(`/checkout?session_id=${encodeURIComponent(data.session_id)}`);
    } catch (err) { setError(err.response?.data?.detail || err.message || "Unable to start checkout"); }
    finally { setLoading(false); }
  };

  if (!items.length) return <div className="min-h-screen pt-32 px-6 text-center"><h1 className="text-3xl text-white font-bold mb-4">Your cart is empty</h1><Link to="/products" className="btn-gold inline-block px-8 py-3">Shop Products</Link></div>;

  return <div className="min-h-screen pt-28 pb-16"><div className="max-w-6xl mx-auto px-6"><h1 className="text-4xl font-bold text-white mb-8">Your Cart</h1><div className="grid lg:grid-cols-2 gap-10">
    <div className="space-y-4">{items.map(item => <div key={item.product_id} className="glass-card border border-royal-700 p-4 flex gap-4"><img src={item.image} alt="" className="w-24 h-24 object-cover"/><div className="flex-1"><h2 className="text-white font-semibold">{item.name}</h2><p className="text-gold-400">{money(item.price)}</p><div className="flex items-center gap-3 mt-3"><button className="btn-outline px-3" onClick={() => setQuantity(item.product_id,item.quantity-1)}>-</button><span className="text-white">{item.quantity}</span><button className="btn-outline px-3" onClick={() => setQuantity(item.product_id,item.quantity+1)}>+</button></div></div></div>)}</div>
    <form onSubmit={checkout} className="glass-card border border-royal-700 p-6 space-y-4"><h2 className="text-2xl text-white font-bold">Checkout Details</h2>{[ ["customer_name","Name","text"],["customer_email","Email","email"],["customer_phone","Phone","tel"],["shipping_parish","Parish","text"],["shipping_district","District / Address","text"] ].map(([key,label,type]) => <label key={key} className="block text-royal-300">{label}<input required={key === "customer_name" || key === "customer_email"} type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="mt-1 w-full bg-royal-950 border border-royal-700 text-white p-3"/></label>)}<div className="border-t border-royal-700 pt-4 flex justify-between text-xl"><span className="text-white">Total</span><strong className="text-gold-400">{money(total)}</strong></div>{error && <p className="text-red-400">{error}</p>}<button disabled={loading} className="btn-gold w-full py-4 font-bold disabled:opacity-50">{loading ? "Starting secure checkout..." : "Continue to Secure Payment"}</button><p className="text-xs text-royal-400">Prices are re-checked from the product database before Stripe payment begins. Card details go directly to Stripe and are not stored in MongoDB.</p></form>
  </div></div></div>;
}
