import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API } from "../App";
import { ProductCard } from "../components/ProductCard";

const categories = [
  { value: "", label: "All Products" },
  { value: "inverters", label: "Inverters" },
  { value: "batteries", label: "Batteries" },
  { value: "panels", label: "Solar Panels" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = activeCategory 
          ? `${API}/products?category=${activeCategory}`
          : `${API}/products`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen pt-20" data-testid="products-page">
      {/* Header */}
      <section className="py-16 md:py-24 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
              Shop
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mt-4 mb-6">
              Solar Products
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Quality solar equipment at competitive prices. Inverters, batteries, 
              and panels from trusted brands like Deye, BSL, and SunPower.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12" data-testid="category-filter">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-6 py-3 font-medium transition-all ${
                  activeCategory === category.value
                    ? "bg-gold-400 text-black"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
                data-testid={`filter-${category.value || 'all'}`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-royal-800 rounded mb-4" />
                  <div className="h-4 bg-royal-800 rounded w-1/4 mb-2" />
                  <div className="h-6 bg-royal-800 rounded w-3/4 mb-4" />
                  <div className="h-8 bg-royal-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-16 glass p-8 rounded-xl text-center">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Not sure which products are right for your setup? Contact us for a free 
              consultation and we'll help you design the perfect solar system.
            </p>
            <a
              href="/quote"
              className="inline-block btn-primary px-8 py-4"
              data-testid="products-quote-btn"
            >
              Request Free Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
