import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { dashboardApi } from "../../api/dashboardApi";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, delay, accent = "text-primary" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-brand`}>
          <Icon size={18} />
        </div>
      </div>
      <p className={`text-2xl font-display font-semibold ${accent}`}>{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const chartData = stats.revenueByDay.map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    revenue: p.revenue,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl mb-1">Dashboard</h1>
      <p className="text-body mb-8">A quick look at how the store is doing.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={DollarSign} label="Total revenue" value={`$${stats.totalRevenue.toFixed(2)}`} delay={0} />
        <StatCard icon={ShoppingBag} label="Total orders" value={stats.totalOrders} delay={0.05} />
        <StatCard icon={Package} label="Active products" value={stats.totalProducts} delay={0.1} />
        <StatCard icon={Users} label="Customers" value={stats.totalCustomers} delay={0.15} />
      </div>

      {/* Alerts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {stats.pendingOrders > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card !py-4 flex items-center gap-3 border-amber-200 bg-amber-50/50">
            <Clock size={18} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{stats.pendingOrders}</span> order{stats.pendingOrders !== 1 ? "s" : ""} awaiting processing
            </p>
            <Link to="/admin/orders" className="ml-auto text-amber-700 hover:text-amber-900"><ChevronRight size={16} /></Link>
          </motion.div>
        )}
        {stats.lowStockCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card !py-4 flex items-center gap-3 border-red-200 bg-red-50/50">
            <AlertTriangle size={18} className="text-danger shrink-0" />
            <p className="text-sm text-red-800">
              <span className="font-semibold">{stats.lowStockCount}</span> product{stats.lowStockCount !== 1 ? "s" : ""} low on stock
            </p>
            <Link to="/admin/products" className="ml-auto text-red-700 hover:text-red-900"><ChevronRight size={16} /></Link>
          </motion.div>
        )}
      </div>

      {/* Revenue chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mb-8">
        <p className="font-display font-medium text-ink mb-4">Revenue — last 14 days</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip
              formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 13 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent orders */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-medium text-ink">Recent orders</p>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="card !p-0 divide-y divide-border">
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-body p-6 text-center">No orders yet.</p>
          ) : (
            stats.recentOrders.map((o) => (
              <div key={o.orderId} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">Order #{o.orderId} · {o.customerName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(o.orderDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] || "bg-slate-100 text-slate-600"}`}>
                  {o.status}
                </span>
                <span className="font-display font-semibold text-ink w-16 text-right shrink-0">${o.totalAmount.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}