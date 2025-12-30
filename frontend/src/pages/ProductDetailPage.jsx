import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, ShoppingCart } from "lucide-react";
import axios from "axios";
import { API } from "../App";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-JM", {
      style: "currency",
      currency: "JMD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <h1 className="text-2xl text-white mb-4">Product not found</h1>
        <Link to="/products" className="text-gold-400 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = Math.round(
    ((product.regular_price - product.sale_price) / product.regular_price) * 100
  );

  return (
    <div className="min-h-screen pt-20" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          data-testid="back-to-products"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-royal-900">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-gold-400 text-black px-4 py-2 text-lg font-bold">
                SAVE {discount}%
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mt-2 mb-6">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-gold-400 font-bold text-4xl">
                {formatPrice(product.sale_price)}
              </span>
              {product.regular_price > product.sale_price && (
                <span className="text-slate-500 line-through text-xl">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            {product.specs && (
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-white text-lg mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <CheckCircle className="text-gold-400 flex-shrink-0" size={16} />
                      <span className="text-slate-400 capitalize">
                        {key.replace(/_/g, " ")}: <span className="text-white">{value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              {product.in_stock ? (
                <span className="inline-flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  In Stock
                </span>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="snipcart-add-item flex-1 btn-primary py-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                data-item-id={product.id}
                data-item-price={product.sale_price}
                data-item-url={`/products/${product.id}`}
                data-item-description={product.description}
                data-item-image={product.image_url}
                data-item-name={product.name}
                disabled={!product.in_stock}
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>
              <Link
                to="/quote"
                className="flex-1 btn-secondary py-4 text-center text-lg"
                data-testid="request-quote-btn"
              >
                Request Quote
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 glass rounded-lg">
              <h4 className="font-heading font-semibold text-white mb-4">
                Why Buy From Jonesaica?
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="text-gold-400" size={16} />
                  Competitive prices - we beat local competition
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="text-gold-400" size={16} />
                  Professional installation available
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="text-gold-400" size={16} />
                  Island-wide delivery & service
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="text-gold-400" size={16} />
                  Expert support & warranty
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
