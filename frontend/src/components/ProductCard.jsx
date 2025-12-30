import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ProductCard = ({ product, index = 0 }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-JM", {
      style: "currency",
      currency: "JMD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = Math.round(
    ((product.regular_price - product.sale_price) / product.regular_price) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="product-card glass-card rounded-lg overflow-hidden group"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-royal-900">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gold-400 text-black px-3 py-1 text-sm font-bold">
            SAVE {discount}%
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
          {product.category}
        </p>
        <h3 className="font-heading font-semibold text-white text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-gold-400 font-bold text-xl">
            {formatPrice(product.sale_price)}
          </span>
          {product.regular_price > product.sale_price && (
            <span className="text-slate-500 line-through text-sm">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 btn-secondary py-2 text-center text-sm"
            data-testid={`view-product-${product.id}`}
          >
            View Details
          </Link>
          <button
            className="snipcart-add-item flex-1 btn-primary py-2 text-sm disabled:opacity-50"
            data-item-id={product.id}
            data-item-price={product.sale_price}
            data-item-url={`/products/${product.id}`}
            data-item-description={product.description}
            data-item-image={product.image_url}
            data-item-name={product.name}
            disabled={!product.in_stock}
            data-testid={`add-to-cart-${product.id}`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};
