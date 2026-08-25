import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload, X, AlertCircle, Loader2 } from "lucide-react";
import { productsApi } from "../../api/productsApi";
import { categoriesApi } from "../../api/categoriesApi";

const EMPTY_FORM = { productName: "", description: "", price: "", stockQuantity: "", categoryId: "", isActive: true };
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => productsApi.getPaged({ page: 1, pageSize: 100 }).then((res) => setProducts(res.items));
  useEffect(() => {
    loadProducts();
    categoriesApi.getAll().then(setCategories);
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.productId);
    setForm({
      productName: p.productName, description: p.description || "",
      price: p.price, stockQuantity: p.stockQuantity, categoryId: p.categoryId, isActive: p.isActive,
    });
    setImageFile(null);
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        productName: form.productName,
        description: form.description,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        categoryId: Number(form.categoryId),
        ...(editingId ? { isActive: form.isActive } : {}),
      };

      const savedId = editingId
        ? (await productsApi.update(editingId, payload), editingId)
        : (await productsApi.create(payload)).productId;

      if (imageFile) await productsApi.uploadImage(savedId, imageFile);

      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsApi.delete(id);
      loadProducts();
    } catch (err) {
      setError(err.response?.data || "Could not delete product.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="text-body mt-1">Manage your catalog.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display font-medium text-ink">{editingId ? "Edit product" : "New product"}</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-ink">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink mb-1.5">Product name</label>
              <input required value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Price</label>
              <input type="number" step="0.01" required value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Stock quantity</label>
              <input type="number" required value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink mb-1.5">Category</label>
              <select required value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field">
                <option value="">Select a category…</option>
                {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
              <textarea rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink mb-1.5">Image</label>
              <label className="flex items-center gap-2 input-field cursor-pointer text-slate-400 w-fit">
                <Upload size={15} />
                {imageFile ? imageFile.name : "Choose image"}
                <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            {editingId && (
              <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active (visible in shop)
              </label>
            )}
          </div>

          {error && <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{error}</p>}

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving…" : "Save product"}
          </button>
        </form>
      )}

      <div className="card !p-0 divide-y divide-border">
        {products.length === 0 ? (
          <p className="text-sm text-body p-6 text-center">No products yet.</p>
        ) : (
          products.map((p) => (
            <div key={p.productId} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-12 h-12 rounded-lg bg-surface-muted overflow-hidden shrink-0">
                {p.imageUrl && <img src={`${API_ORIGIN}${p.imageUrl}`} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{p.productName}</p>
                <p className="text-xs text-slate-400">{p.categoryName} · ${p.price.toFixed(2)} · {p.stockQuantity} in stock</p>
              </div>
              {!p.isActive && <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Inactive</span>}
              <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-primary transition-colors"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(p.productId)} className="text-slate-400 hover:text-danger transition-colors"><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}