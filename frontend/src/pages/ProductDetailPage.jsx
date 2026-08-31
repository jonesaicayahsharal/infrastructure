import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, ShoppingCart } from "lucide-react";
import axios from "axios";
import { API } from "../App";
import { getCatalogProduct } from "../data/productCatalog";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(getCatalogProduct(id) || null);
  const [loading, setLoading] = useState(!getCatalogProduct(id));

  useEffect(() => {
    const fallback = getCatalogProduct(id);
    axios.get(`${API}/products/${id}`)
      .then(r => setProduct(r.data || fallback))
      .catch(e => { console.error("Error fetching product; using restored catalog:", e); setProduct(fallback || null); })
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price) => new Intl.NumberFormat("en-JM", { style: "currency", currency: "JMD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  const addToCart = () => window.dispatchEvent(new CustomEvent("jonesaica:add-to-cart", { detail: product }));

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500" /></div>;
  if (!product) return <div className="min-h-screen pt-20 flex flex-col items-center justify-center"><h1 className="text-2xl text-white mb-4">Product not found</h1><Link to="/products" className="text-gold-400 hover:underline">Back to Products</Link></div>;

  const discount = Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
  const unavailable = !product.in_stock && !product.backorder;

  return <div className="min-h-screen pt-20" data-testid="product-detail-page"><div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <Link to="/products" className="inline-flex items-center gap-2 text-royal-400 hover:text-gold-400 mb-8 transition-colors"><ArrowLeft size={20}/>Back to Products</Link>
    <div className="grid lg:grid-cols-2 gap-12">
      <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="relative"><div className="aspect-square overflow-hidden bg-royal-900 border border-royal-700"><img src={product.image_url} alt={product.name} className="w-full h-full object-cover"/></div>{discount>0&&<div className="absolute top-4 left-4 bg-gold-500 text-royal-950 px-4 py-2 text-lg font-bold">SAVE {discount}%</div>}</motion.div>
      <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}><span className="text-gold-400 text-sm font-bold uppercase tracking-widest">{product.category}</span><h1 className="font-heading font-bold text-3xl md:text-4xl text-white mt-2 mb-6">{product.name}</h1><div className="flex items-baseline gap-4 mb-6"><span className="text-gold-400 font-bold text-4xl">{formatPrice(product.sale_price)}</span>{product.regular_price>product.sale_price&&<span className="text-royal-500 line-through text-xl">{formatPrice(product.regular_price)}</span>}</div><p className="text-royal-300 text-lg mb-8 leading-relaxed">{product.description}</p>
        {product.specs&&<div className="mb-8"><h3 className="font-heading font-semibold text-white text-lg mb-4">Specifications</h3><div className="grid grid-cols-2 gap-4">{Object.entries(product.specs).map(([key,value])=><div key={key} className="flex items-center gap-2"><CheckCircle className="text-gold-500 flex-shrink-0" size={16}/><span className="text-royal-400 capitalize">{key.replace(/_/g," ")}: <span className="text-white">{value}</span></span></div>)}</div></div>}
        {product.features&&<div className="mb-8"><h3 className="font-heading font-semibold text-white text-lg mb-4">Features</h3><ul className="space-y-2">{product.features.map((feature,index)=><li key={index} className="flex items-center gap-2 text-royal-300"><CheckCircle className="text-gold-500 flex-shrink-0" size={16}/>{feature}</li>)}</ul></div>}
        <div className="mb-8">{product.backorder?<span className="inline-flex items-center gap-2 text-purple-400"><CheckCircle size={20}/>Available on Backorder</span>:product.in_stock?<span className="inline-flex items-center gap-2 text-green-400"><CheckCircle size={20}/>In Stock</span>:<span className="text-red-400 font-bold">SOLD OUT</span>}</div>
        <div className="flex flex-col sm:flex-row gap-4"><button onClick={addToCart} className="flex-1 btn-gold py-4 flex items-center justify-center gap-3 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed" disabled={unavailable}><ShoppingCart size={24}/>{unavailable?"Sold Out":product.backorder?"Pre-Order":"Add to Cart"}</button><Link to="/quote" className="flex-1 btn-outline py-4 text-center text-lg rounded-none">Request Quote</Link></div>
      </motion.div>
    </div>
  </div></div>;
}
