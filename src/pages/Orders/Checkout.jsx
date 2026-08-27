import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { ordersApi } from "../../api/ordersApi";

export default function Checkout() {
  const { cart, refetch } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setPlacing(true);
    try {
      const order = await ordersApi.checkout(address);
      await refetch();
      navigate(`/orders/${order.orderId}`);
    } catch (err) {
      setError(err.response?.data || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-body">Your cart is empty — add something first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
      <motion.form
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={handlePlaceOrder}
        className="md:col-span-3 space-y-5"
      >
        <h1 className="text-2xl mb-2">Checkout</h1>

        <div className="card">
          <label className="block text-sm font-medium text-ink mb-1.5">Shipping address</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <textarea
              required rows={3} value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address, city, postal code…"
              className="input-field !pl-10 resize-none"
            />
          </div>
        </div>

        {error && <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{error}</p>}

        <button type="submit" disabled={placing} className="btn-primary w-full flex items-center justify-center gap-2">
          {placing && <Loader2 size={16} className="animate-spin" />}
          {placing ? "Placing order…" : `Place order — $${cart.subtotal.toFixed(2)}`}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Payment is handled after order confirmation — you won't be charged yet.
        </p>
      </motion.form>

      <div className="md:col-span-2">
        <div className="card">
          <p className="font-display font-medium text-ink mb-4">Order summary</p>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between text-sm">
                <span className="text-body">{item.productName} × {item.quantity}</span>
                <span className="text-ink font-medium">${item.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="vector-divider !my-4" />
          <div className="flex justify-between font-display font-semibold text-ink">
            <span>Total</span>
            <span>Rs {cart.subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}