import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCompany } from "../context/CompanyContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { company } = useCompany();

  return (
    <div className="relative overflow-hidden">
      <div className="blob w-[28rem] h-[28rem] bg-primary top-[-8rem] left-[-8rem]" />
      <div className="blob w-96 h-96 bg-secondary top-20 right-[-6rem]" style={{ animationDelay: "3s" }} />
      <div className="blob w-80 h-80 bg-accent bottom-[-6rem] left-1/3" style={{ animationDelay: "6s" }} />

      <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1.5 rounded-full mb-6"
        >
          <Sparkles size={12} /> AI-powered commerce
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl tracking-tight leading-tight"
        >
          Shop by what you <span className="text-gradient">mean</span>,<br />not just what you type
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-body text-lg mt-6 max-w-xl mx-auto leading-relaxed"
        >
          {company?.companyName || "VectorCart"} understands natural-language search,
          answers real questions about your orders, and finds products that actually
          match what you're looking for.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get started <ArrowRight size={16} />
            </Link>
          )}
          <Link to="/search" className="btn-secondary">Try AI search</Link>
        </motion.div>
      </div>
    </div>
  );
}