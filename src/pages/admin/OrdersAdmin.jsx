import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { ordersApi } from "../../api/ordersApi";
import SearchableSelect from "../../components/SearchableSelect";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => ordersApi.getAllAdmin().then(setOrders).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: updated.status } : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="h-8 w-40 bg-slate-100 rounded animate-pulse mb-6" />
      <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
    </div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl mb-8">All orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={28} className="text-slate-300 mb-3" />
          <p className="text-body">No orders yet.</p>
        </div>
      ) : (
        <div className="card !p-0 divide-y divide-border">
          {orders.map((o) => (
            <div key={o.orderId} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">
                  Order #{o.orderId} · <span className="text-body font-normal">{o.customerName}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(o.orderDate).toLocaleDateString()} · {o.items.length} item{o.items.length !== 1 ? "s" : ""} ·{" "}
                  <span className={o.paymentStatus === "Paid" ? "text-success" : "text-warning"}>
                    {o.paymentStatus}
                  </span>
                </p>
              </div>
              <span className="font-display font-semibold text-ink shrink-0">${o.totalAmount.toFixed(2)}</span>
              <div className={`w-36 shrink-0 ${updatingId === o.orderId ? "opacity-50 pointer-events-none" : ""}`}>
                <SearchableSelect
                  options={STATUS_OPTIONS}
                  value={o.status}
                  onChange={(val) => handleStatusChange(o.orderId, val)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}