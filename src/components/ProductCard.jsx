import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

export default function ProductCard({ product }) {
  const imageSrc = product.imageUrl ? `${API_ORIGIN}${product.imageUrl}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card !p-0 overflow-hidden group cursor-pointer"
    >
      <div className="aspect-square bg-surface-muted flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ImageOff size={28} className="text-slate-300" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-400 mb-1">{product.categoryName}</p>
        <h3 className="font-display font-medium text-ink truncate">{product.productName}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-semibold text-primary">${product.price.toFixed(2)}</span>
          {!product.inStock && (
            <span className="text-[10px] font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}