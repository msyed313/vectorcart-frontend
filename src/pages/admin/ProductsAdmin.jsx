import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Upload, X, AlertCircle, Loader2,
  Star, GripVertical,
} from "lucide-react";
import { productsApi } from "../../api/productsApi";
import { categoriesApi } from "../../api/categoriesApi";
import SearchableSelect from "../../components/SearchableSelect";
import { flattenCategoryOptions } from "../../utils/categoryTree";
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

  // Gallery + details — only relevant when editing an existing product
  const [galleryImages, setGalleryImages] = useState([]);
  const [detailsList, setDetailsList] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);

  const loadProducts = () => productsApi.getPaged({ page: 1, pageSize: 100 }).then((res) => setProducts(res.items));
  useEffect(() => {
    loadProducts();
    categoriesApi.getAll().then(setCategories);
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setGalleryImages([]);
    setDetailsList([]);
    setError(null);
    setShowForm(true);
  };

  const openEdit = async (p) => {
    setEditingId(p.productId);
    setForm({
      productName: p.productName, description: p.description || "",
      price: p.price, stockQuantity: p.stockQuantity, categoryId: p.categoryId, isActive: p.isActive,
    });
    setImageFile(null);
    setError(null);
    setShowForm(true);

    // Load full detail (gallery images + bullet details) for this product
    const full = await productsApi.getFull(p.productId);
    setGalleryImages(full.images || []);
    setDetailsList(full.details?.length ? full.details : [""]);
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

  // ---- Gallery management ----
  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingId) return;
    setGalleryUploading(true);
    try {
      const image = await productsApi.addImage(editingId, file, galleryImages.length === 0);
      setGalleryImages((imgs) => [...imgs, image]);
    } catch (err) {
      setError(err.response?.data || "Could not upload image.");
    } finally {
      setGalleryUploading(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    await productsApi.deleteImage(editingId, imageId);
    setGalleryImages((imgs) => imgs.filter((i) => i.productImageId !== imageId));
  };

  const handleSetPrimary = async (imageId) => {
    await productsApi.setPrimaryImage(editingId, imageId);
    setGalleryImages((imgs) => imgs.map((i) => ({ ...i, isPrimary: i.productImageId === imageId })));
  };

  // ---- Details management ----
  const handleDetailChange = (index, value) => {
    setDetailsSaved(false);
    setDetailsList((list) => list.map((d, i) => (i === index ? value : d)));
  };

  const addDetailRow = () => {
    setDetailsSaved(false);
    setDetailsList((list) => [...list, ""]);
  };

  const removeDetailRow = (index) => {
    setDetailsSaved(false);
    setDetailsList((list) => list.filter((_, i) => i !== index));
  };

  const handleSaveDetails = async () => {
    setDetailsSaving(true);
    try {
      const cleaned = detailsList.map((d) => d.trim()).filter(Boolean);
      await productsApi.updateDetails(editingId, cleaned);
      setDetailsList(cleaned.length ? cleaned : [""]);
      setDetailsSaved(true);
    } catch (err) {
      setError(err.response?.data || "Could not save details.");
    } finally {
      setDetailsSaving(false);
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
        <div className="card mb-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
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
  <SearchableSelect
    options={flattenCategoryOptions(categories)}
    value={form.categoryId}
    onChange={(val) => setForm({ ...form, categoryId: val })}
    placeholder="Select a category…"
  />
</div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink mb-1.5">Main image</label>
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

          {/* Gallery + Details — only available once the product exists */}
          {editingId ? (
            <>
              <div className="vector-divider !my-0" />

              {/* Gallery images */}
              <div>
                <p className="font-display font-medium text-ink text-sm mb-3">Gallery images</p>
                <div className="flex flex-wrap gap-3 mb-3">
                  {galleryImages.map((img) => (
                    <div key={img.productImageId} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                      <img src={`${API_ORIGIN}${img.imageUrl}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.productImageId)}
                          title="Set as primary"
                          className={`p-1.5 rounded-full ${img.isPrimary ? "bg-amber-400 text-white" : "bg-white/90 text-slate-600 hover:bg-amber-400 hover:text-white"} transition-colors`}
                        >
                          <Star size={12} className={img.isPrimary ? "fill-current" : ""} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryImage(img.productImageId)}
                          className="p-1.5 rounded-full bg-white/90 text-slate-600 hover:bg-danger hover:text-white transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 text-[9px] font-semibold bg-amber-400 text-white px-1.5 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}

                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    {galleryUploading ? (
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                    ) : (
                      <Plus size={18} className="text-slate-400" />
                    )}
                    <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden"
                      onChange={handleGalleryUpload} disabled={galleryUploading} />
                  </label>
                </div>
                <p className="text-xs text-slate-400">Hover an image to set it as primary or remove it.</p>
              </div>

              <div className="vector-divider !my-0" />

              {/* Bullet-point details */}
              <div>
                <p className="font-display font-medium text-ink text-sm mb-3">Product details (bullet points)</p>
                <div className="space-y-2">
                  {detailsList.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical size={14} className="text-slate-300 shrink-0" />
                      <input
                        value={detail}
                        onChange={(e) => handleDetailChange(i, e.target.value)}
                        placeholder="e.g. 100% organic cotton"
                        className="input-field !py-2 text-sm"
                      />
                      <button type="button" onClick={() => removeDetailRow(i)} className="text-slate-300 hover:text-danger transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button type="button" onClick={addDetailRow} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add point
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={detailsSaving}
                    className="btn-primary text-sm !px-4 !py-2 flex items-center gap-2 ml-auto"
                  >
                    {detailsSaving && <Loader2 size={14} className="animate-spin" />}
                    {detailsSaving ? "Saving…" : "Save details"}
                  </button>
                </div>
                {detailsSaved && <p className="text-xs text-success mt-2">Details saved.</p>}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Save the product first — gallery images and detail bullet points can be added once it exists.
            </p>
          )}
        </div>
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