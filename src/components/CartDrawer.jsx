import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ImageOff } from "lucide-react";
import { useCart } from "../context/CartContext";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

export default function CartDrawer() {
  const { cart, drawerOpen, setDrawerOpen, updateItem, removeItem } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-display font-semibold text-lg text-ink">Your cart</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-ink">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={32} className="text-slate-300 mb-3" />
                  <p className="text-body">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-surface-muted overflow-hidden shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={`${API_ORIGIN}${item.imageUrl}`} className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={18} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.productName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">${item.unitPrice.toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateItem(item.cartItemId, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded-md border border-border flex items-center justify-center hover:bg-primary/5"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm text-ink w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.cartItemId, Math.min(item.availableStock, item.quantity + 1))}
                            disabled={item.quantity >= item.availableStock}
                            className="w-6 h-6 rounded-md border border-border flex items-center justify-center hover:bg-primary/5 disabled:opacity-40"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="ml-auto text-slate-300 hover:text-danger transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-ink shrink-0">${item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body">Subtotal</span>
                  <span className="font-display font-semibold text-lg text-ink">${cart.subtotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={() => setDrawerOpen(false)} className="btn-primary w-full text-center block">
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}