import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { productsApi } from "../api/productsApi";
import { categoriesApi } from "../api/categoriesApi";
import ProductCard from "../components/ProductCard";
import SearchableSelect from "../components/SearchableSelect";
import { flattenCategoryOptions } from "../utils/categoryTree";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({ search: "", categoryId: "", sortBy: "" });

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getPaged({ page, pageSize: 12, ...filters })
      .then((res) => {
        setProducts(res.items);
        setTotalPages(res.totalPages);
        setTotalCount(res.totalCount);
      })
      .finally(() => setLoading(false));
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="relative overflow-hidden">
      <div className="blob w-[26rem] h-[26rem] bg-primary top-[-10rem] left-[-10rem]" />
      <div className="blob w-80 h-80 bg-accent top-32 right-[-6rem]" style={{ animationDelay: "4s" }} />

      {/* Hero */}
      <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-5 text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1.5 rounded-full mb-5"
        >
          <Sparkles size={12} /> {totalCount} products and counting
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl tracking-tight"
        >
          Find something you'll <span className="text-gradient">love</span>
        </motion.h1>
      </div>

      {/* Filter bar — glass panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="sticky top-[73px] z-30 mb-5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-2xl border border-border/60 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search products…"
                className="input-field !pl-10 !py-2.5 !bg-white/70"
              />
            </div>

            <div className="w-full sm:w-52">
              <SearchableSelect
                options={flattenCategoryOptions(categories)}
                value={filters.categoryId}
                onChange={(val) => handleFilterChange("categoryId", val)}
                placeholder="All categories"
                isClearable
              />
            </div>

            <div className="w-full sm:w-48">
              <SearchableSelect
                options={[
                  { value: "", label: "Newest" },
                  { value: "priceAsc", label: "Price: Low to High" },
                  { value: "priceDesc", label: "Price: High to Low" },
                ]}
                value={filters.sortBy}
                onChange={(val) => handleFilterChange("sortBy", val)}
                placeholder="Sort by"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border">
                <div className="aspect-square bg-slate-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                  <div className="h-5 w-1/3 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SlidersHorizontal size={28} className="text-slate-300 mb-3" />
            <p className="text-body">No products match these filters.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.productId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-border transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-body px-2">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-border transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}