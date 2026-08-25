import { useEffect, useState } from "react";
import { Plus, Trash2, FolderTree, AlertCircle } from "lucide-react";
import { categoriesApi } from "../../api/categoriesApi";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: "", parentCategoryId: "" });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => categoriesApi.getAll().then(setCategories);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await categoriesApi.create({
        categoryName: form.categoryName,
        parentCategoryId: form.parentCategoryId ? Number(form.parentCategoryId) : null,
      });
      setForm({ categoryName: "", parentCategoryId: "" });
      load();
    } catch (err) {
      setError(err.response?.data || "Could not create category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await categoriesApi.delete(id);
      load();
    } catch (err) {
      setError(err.response?.data || "Could not delete category.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl">Categories</h1>
      <p className="text-body mt-2 mb-8">Organize your catalog into categories and subcategories.</p>

      <form onSubmit={handleSubmit} className="card flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={form.categoryName}
          onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
          placeholder="Category name"
          required
          className="input-field flex-1"
        />
        <select
          value={form.parentCategoryId}
          onChange={(e) => setForm({ ...form, parentCategoryId: e.target.value })}
          className="input-field sm:w-48"
        >
          <option value="">No parent (top-level)</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
          ))}
        </select>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> Add
        </button>
      </form>

      {error && (
        <p className="flex items-center gap-2 text-sm text-danger mb-4"><AlertCircle size={15} />{error}</p>
      )}

      <div className="card !p-0 divide-y divide-border">
        {categories.length === 0 ? (
          <p className="text-sm text-body p-6 text-center">No categories yet.</p>
        ) : (
          categories.map((c) => (
            <div key={c.categoryId} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <FolderTree size={15} className="text-primary" />
                <span className="text-sm text-ink">
                  {c.parentCategoryId && (
                    <span className="text-slate-400">
                      {categories.find((p) => p.categoryId === c.parentCategoryId)?.categoryName} /{" "}
                    </span>
                  )}
                  {c.categoryName}
                </span>
              </div>
              <button onClick={() => handleDelete(c.categoryId)} className="text-slate-400 hover:text-danger transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}