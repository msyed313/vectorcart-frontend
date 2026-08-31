import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Sparkles, Loader2 } from "lucide-react";
import { searchApi } from "../api/searchApi";
import ProductCard from "../components/ProductCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null); // null = no search run yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchApi.search(query);
      setResults(data);
    } catch (err) {
      setError(err.response?.data || "Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="blob w-[26rem] h-[26rem] bg-accent top-[-8rem] left-1/2 -translate-x-1/2" />

      <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1.5 rounded-full mb-5"
        >
          <Sparkles size={12} /> AI-powered search
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl tracking-tight mb-8"
        >
          Describe what you're <span className="text-gradient">looking for</span>
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="relative"
        >
          <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. comfortable pants for hiking under $150…"
            className="w-full pl-14 pr-32 py-4 rounded-2xl border border-border bg-white text-ink
                       focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary
                       transition-all duration-200 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-5 flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
          </button>
        </motion.form>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {error && <p className="text-center text-sm text-danger mb-6">{error}</p>}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" exit={{ opacity: 0 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border">
                  <div className="aspect-square bg-slate-100 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                    <div className="h-5 w-1/3 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!loading && results !== null && (
            results.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-body">No matches found — try describing it differently.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {results.map((p, i) => (
                  <motion.div key={p.productId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}