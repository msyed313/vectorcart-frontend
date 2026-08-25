import { motion } from "framer-motion";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center overflow-hidden px-6 py-16">
      <div className="blob w-96 h-96 bg-primary top-[-6rem] left-[-6rem]" />
      <div className="blob w-80 h-80 bg-secondary bottom-[-4rem] right-[-4rem]" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md card"
      >
        {eyebrow && (
          <span className="inline-flex text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full mb-4">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl mb-1.5">{title}</h1>
        {subtitle && <p className="text-sm text-body mb-6">{subtitle}</p>}
        {children}
      </motion.div>
    </div>
  );
}