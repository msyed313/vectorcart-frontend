import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { chatApi } from "../api/chatApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef(null);
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

  useEffect(() => {
    if (!isAuthenticated || !open || messages.length > 0) return;
    setLoadingHistory(true);
    chatApi.getHistory().then(setMessages).finally(() => setLoadingHistory(false));
  }, [isAuthenticated, open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  // Early return now comes AFTER every hook has been declared — this is the fix.
  if (!isAuthenticated) return null;

  const handleSend = async (e) => {
  e.preventDefault();
  const text = input.trim();
  if (!text || sending) return;

  setInput("");
  setMessages((prev) => [...prev, { senderType: "User", messageText: text, createdAt: new Date().toISOString() }]);
  setSending(true);

  try {
    const res = await chatApi.sendMessage(text);
    setMessages((prev) => [...prev, {
      senderType: "AI",
      messageText: res.reply,
      products: res.products || null, // carry structured product data alongside the text
      createdAt: new Date().toISOString(),
    }]);
  } catch {
    setMessages((prev) => [...prev, {
      senderType: "AI",
      messageText: "Sorry, something went wrong. Try again in a moment.",
      createdAt: new Date().toISOString(),
    }]);
  } finally {
    setSending(false);
  }
};

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full bg-brand-gradient
                   shadow-brand-lg flex items-center justify-center text-white"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[80] w-[380px] max-w-[calc(100vw-3rem)] h-[520px]
                       bg-white rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-brand-gradient px-5 py-4 flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-display font-semibold text-sm">VectorCart Assistant</p>
                <p className="text-white/70 text-xs">Ask about orders or products</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loadingHistory ? (
                <div className="flex justify-center pt-8">
                  <Loader2 size={18} className="animate-spin text-slate-300" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center pt-8 px-4">
                  <Sparkles size={22} className="text-accent mx-auto mb-2" />
                  <p className="text-sm text-body">
                    Hi! Ask me things like "where's my order #12?" or "do you have anything under $50?"
                  </p>
                </div>
              ) : (

// ...inside the messages.map():
messages.map((m, i) => (
  <div key={i} className={`flex flex-col ${m.senderType === "User" ? "items-end" : "items-start"}`}>
    <div
      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        m.senderType === "User"
          ? "bg-brand-gradient text-white rounded-br-md"
          : "bg-surface-muted text-ink rounded-bl-md"
      }`}
    >
      {m.messageText}
    </div>

    {/* Product suggestion cards — rendered as real UI, not text */}
    {m.products && m.products.length > 0 && (
      <div className="mt-2 space-y-2 w-full max-w-[85%]">
        {m.products.map((p) => (
          <Link
            key={p.productId}
            to={`/products/${p.productId}`}
            className="flex items-center gap-3 bg-white border border-border rounded-xl p-2.5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-surface-muted overflow-hidden shrink-0 flex items-center justify-center">
              {p.imageUrl ? (
                <img src={`${API_ORIGIN}${p.imageUrl}`} className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={16} className="text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink truncate">{p.productName}</p>
              <p className="text-xs text-primary font-semibold">${p.price.toFixed(2)}</p>
            </div>
            {!p.inStock && (
              <span className="text-[9px] font-semibold text-danger bg-danger/10 px-1.5 py-0.5 rounded-full shrink-0">
                Out of stock
              </span>
            )}
          </Link>
        ))}
      </div>
    )}
  </div>
))
              )}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-surface-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="border-t border-border p-3 flex items-center gap-2 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm
                           focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center
                           disabled:opacity-40 transition-opacity shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}