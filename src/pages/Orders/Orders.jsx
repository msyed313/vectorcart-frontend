import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { ordersApi } from "../../api/ordersApi";
import { useSearchParams } from "react-router-dom";
import { CreditCard, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { paymentsApi } from "../../api/paymentsApi";
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default function Orders() {
  const { id } = useParams(); // if present, show single-order detail
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
const [searchParams] = useSearchParams();
const paymentResult = searchParams.get("payment"); // "success" | "cancelled" | null
const [payingNow, setPayingNow] = useState(false);
const [payError, setPayError] = useState(null);

const handlePayNow = async () => {
  setPayError(null);
  setPayingNow(true);
  try {
    const { sessionUrl } = await paymentsApi.createCheckoutSession(order.orderId);
    window.location.href = sessionUrl; // redirect to Stripe's hosted checkout page
  } catch (err) {
    setPayError(err.response?.data || "Could not start payment.");
    setPayingNow(false);
  }
};
  useEffect(() => {
    setLoading(true);
    if (id) {
      ordersApi.getById(id).then(setOrder).finally(() => setLoading(false));
    } else {
      ordersApi.getAll().then(setOrders).finally(() => setLoading(false));
    }
  }, [id]);
// Add this useEffect, right after your existing order-loading useEffect
useEffect(() => {
  if (paymentResult !== "success" || !id) return;

  // Poll a few times over ~6 seconds in case the webhook hasn't landed yet
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    const updated = await ordersApi.getById(id);
    setOrder(updated);
    if (updated.paymentStatus === "Paid" || attempts >= 5) {
      clearInterval(interval);
    }
  }, 1500);

  return () => clearInterval(interval);
}, [paymentResult, id]);
  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="h-8 w-40 bg-slate-100 rounded animate-pulse mb-6" />
      <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
    </div>;
  }

  // Single order detail view
  if (id) {
    if (!order) return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-body">Order not found.</div>;

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-primary mb-6">
          <ChevronLeft size={15} /> All orders
        </Link>

        <div className="flex flex-col items-center justify-between mb-1">
            <div>
                       {paymentResult === "success" && (
  <div className="flex items-center gap-2.5 bg-success/10 text-success text-sm font-medium px-4 py-3 rounded-xl mb-6">
    <CheckCircle2 size={18} />
    Payment successful! It may take a few seconds to reflect below — refresh if the status still shows Unpaid.
  </div>
)}

{paymentResult === "cancelled" && (
  <div className="flex items-center gap-2.5 bg-warning/10 text-warning text-sm font-medium px-4 py-3 rounded-xl mb-6">
    <XCircle size={18} />
    Payment was cancelled — you can try again below whenever you're ready.
  </div>
)}
            </div>
            <div className="flex items-center gap-2.5">
                <h1 className="text-2xl">Order #{order.orderId}</h1>
   
          <StatusBadge status={order.status} />

            </div>
          
        </div>
        <p className="text-sm text-slate-400 mb-8">
          Placed {new Date(order.orderDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="card mb-6">
          <p className="font-display font-medium text-ink mb-4">Items</p>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-body">{item.productName} × {item.quantity}</span>
                <span className="text-ink font-medium">Rs {item.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="vector-divider !my-4" />
          <div className="flex justify-between font-display font-semibold text-ink">
            <span>Total</span>
            <span>Rs {order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="card">
  <p className="font-display font-medium text-ink mb-2">Shipping address</p>
  <p className="text-sm text-body">{order.shippingAddress}</p>
  <p className="text-sm text-body mt-3">
    Payment status: <span className="font-medium text-ink">{order.paymentStatus}</span>
  </p>

  {order.paymentStatus !== "Paid" && (
    <>
      {payError && <p className="text-sm text-danger mt-3">{payError}</p>}
      <button
        onClick={handlePayNow}
        disabled={payingNow}
        className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
      >
        {payingNow ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
        {payingNow ? "Redirecting to Stripe…" : "Pay now"}
      </button>
    </>
  )}
</div>
      </div>
    );
  }

  // Order list view
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-8">Your orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={28} className="text-slate-300 mb-3" />
          <p className="text-body">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o.orderId}
              to={`/orders/${o.orderId}`}
              className="card flex items-center justify-between hover:shadow-lg hover:shadow-primary/5 transition-shadow"
            >
              <div>
                <p className="font-display font-medium text-ink">Order #{o.orderId}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(o.orderDate).toLocaleDateString()} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={o.status} />
                <span className="font-display font-semibold text-ink">Rs {o.totalAmount.toFixed(2)}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}