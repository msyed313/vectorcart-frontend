import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, ChevronLeft, User, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { productsApi } from "../api/productsApi";
import { reviewsApi } from "../api/reviewsApi";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

export default function ProductDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const load = () => productsApi.getFull(id).then(setProduct).finally(() => setLoading(false));
  useEffect(() => { setLoading(true); load(); }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError(null);
    if (reviewForm.rating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      await reviewsApi.create(id, reviewForm);
      setReviewForm({ rating: 0, comment: "" });
      load();
    } catch (err) {
      setReviewError(err.response?.data || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    await reviewsApi.delete(id, reviewId);
    load();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-1/3 bg-slate-100 rounded animate-pulse" />
          <div className="h-24 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-body">Product not found.</div>;
  }

  const images = product.images.length > 0
    ? product.images
    : product.imageUrl ? [{ imageUrl: product.imageUrl, isPrimary: true }] : [];

  const userHasReviewed = user && product.reviews.some((r) => r.userId === user.userId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-primary transition-colors mb-8">
        <ChevronLeft size={15} /> Back to shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div>
          <div className="aspect-square rounded-2xl bg-surface-muted overflow-hidden mb-4">
            {images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  src={`${API_ORIGIN}${images[activeImage].imageUrl}`}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff size={32} className="text-slate-300" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={`${API_ORIGIN}${img.imageUrl}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-primary font-medium">{product.categoryName}</p>
          <h1 className="text-3xl mt-1">{product.productName}</h1>

          <div className="flex items-center gap-2 mt-3">
            <StarRating value={product.averageRating} readOnly size={16} />
            <span className="text-sm text-body">
              {product.averageRating > 0 ? product.averageRating.toFixed(1) : "No ratings yet"}
              {product.reviewCount > 0 && ` · ${product.reviewCount} review${product.reviewCount !== 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-display font-semibold text-ink">${product.price.toFixed(2)}</span>
            {product.inStock ? (
              <span className="text-sm text-success font-medium">In stock</span>
            ) : (
              <span className="text-sm text-danger font-medium">Out of stock</span>
            )}
          </div>

          {product.description && (
            <p className="text-body leading-relaxed mt-5">{product.description}</p>
          )}

          {product.details.length > 0 && (
            <div className="mt-6">
              <p className="font-display font-medium text-ink mb-3">Details</p>
              <ul className="space-y-2">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button disabled={!product.inStock} className="btn-primary w-full mt-8">
            {product.inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="vector-divider mt-16" />

      <div className="max-w-2xl">
        <h2 className="text-2xl mb-6">Reviews</h2>

        {isAuthenticated && !userHasReviewed && (
          <form onSubmit={handleSubmitReview} className="card mb-8 space-y-3">
            <p className="font-display font-medium text-ink text-sm">Leave a review</p>
            <StarRating value={reviewForm.rating} onChange={(v) => setReviewForm({ ...reviewForm, rating: v })} />
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              rows={3}
              placeholder="Share your thoughts about this product…"
              className="input-field resize-none"
            />
            {reviewError && (
              <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{reviewError}</p>
            )}
            <button type="submit" disabled={submitting} className="btn-primary text-sm flex items-center gap-2">
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-body mb-8">
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link> to leave a review.
          </p>
        )}

        <div className="space-y-6">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-body">No reviews yet — be the first.</p>
          ) : (
            product.reviews.map((r) => (
              <div key={r.reviewId} className="flex gap-3 pb-6 border-b border-border last:border-0">
                <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white shrink-0">
                  <User size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{r.userName}</p>
                    {(user?.userId === r.userId || user?.role === "Admin") && (
                      <button onClick={() => handleDeleteReview(r.reviewId)} className="text-slate-300 hover:text-danger transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <StarRating value={r.rating} readOnly size={13} />
                  {r.comment && <p className="text-sm text-body mt-1.5">{r.comment}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}