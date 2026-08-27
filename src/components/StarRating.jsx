import { Star } from "lucide-react";

export default function StarRating({ value, onChange, size = 18, readOnly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
        >
          <Star
            size={size}
            className={star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
          />
        </button>
      ))}
    </div>
  );
}