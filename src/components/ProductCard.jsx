import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageOff, ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const imageSrc = product.imageUrl ? `${API_ORIGIN}${product.imageUrl}` : null;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || adding) return;
    setAdding(true);
    try {
      await addItem(product.productId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product.productId}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="group relative bg-surface rounded-2xl border border-border overflow-hidden cursor-pointer
                   hover:border-primary/30 hover:shadow-brand-lg transition-all duration-300"
      >
        <div className="relative aspect-square bg-surface-muted overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.productName}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff size={26} className="text-slate-300" />
            </div>
          )}

          {/* Gradient scrim so badges/buttons stay legible over any image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category chip */}
          <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-wide uppercase text-white bg-ink/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {product.categoryName}
          </span>

          {!product.inStock && (
            <span className="absolute top-3 right-3 text-[10px] font-semibold text-white bg-danger px-2.5 py-1 rounded-full">
              Out of stock
            </span>
          )}

          {/* Quick add-to-cart — slides up on hover */}
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-primary shadow-brand
                         flex items-center justify-center translate-y-14 group-hover:translate-y-0
                         opacity-0 group-hover:opacity-100 transition-all duration-300
                         hover:bg-brand-gradient hover:text-white active:scale-90"
            >
              {adding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : added ? (
                <Check size={16} />
              ) : (
                <ShoppingCart size={16} />
              )}
            </button>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display font-medium text-ink truncate group-hover:text-primary transition-colors">
            {product.productName}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-semibold text-lg text-ink">
              ${product.price.toFixed(2)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}