import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles, LogOut, User } from "lucide-react";
import { useCompany } from "../context/CompanyContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
function getInitials(name) {
  if (!name) return "VC";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Navbar() {
  const { company, logoSrc, loading } = useCompany();
  const { user, isAuthenticated, logout } = useAuth();
  const [imgFailed, setImgFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
const { itemCount, setDrawerOpen } = useCart();
  const showRealLogo = !loading && logoSrc && !imgFailed;
  const companyName = company?.companyName || "VectorCart";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Search", href: "/search", badge: true },
  ...(user?.role !== "Admin" ? [{ label: "Orders", href: "/orders" }] : []),
  ...(user?.role === "Admin" ? [
    { label: "Products", href: "/admin/products" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Settings", href: "/admin/company" },
  ] : []),
];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          {loading ? (
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          ) : showRealLogo ? (
            <img src={logoSrc} alt={companyName} onError={() => setImgFailed(true)}
              className="h-12 w-auto max-w-[180px] object-contain" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-semibold text-sm shadow-brand transition-transform duration-300 group-hover:scale-105">
              {getInitials(companyName)}
            </div>
          )}
          {!showRealLogo && (
            <span className="font-display font-semibold text-lg text-ink tracking-tight">
              {loading ? "" : companyName}
            </span>
          )}
        </Link>

        <div className="hidden md:flex items-center gap-1 font-body text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href}
              className="relative px-4 py-2 rounded-lg text-body hover:text-ink hover:bg-primary/5 transition-all duration-200 group">
              <span className="flex items-center gap-1.5">
                {link.label}
                {link.badge && (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold tracking-wide bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">
                    <Sparkles size={10} /> AI
                  </span>
                )}
              </span>
              <span className="absolute left-4 right-4 -bottom-0.5 h-0.5 bg-brand-gradient rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
         <button
  onClick={() => setDrawerOpen(true)}
  className="relative btn-primary text-sm !px-4 !py-2.5 flex items-center gap-2"
>
  <ShoppingCart size={16} /> Cart
  {itemCount > 0 && (
    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-ink text-[10px] font-bold flex items-center justify-center">
      {itemCount}
    </span>
  )}
</button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display font-semibold text-sm shadow-brand"
              >
                {getInitials(user.fullName)}
              </button>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-2"
                >
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-ink truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-secondary text-sm !px-4 !py-2.5 flex items-center gap-2">
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}