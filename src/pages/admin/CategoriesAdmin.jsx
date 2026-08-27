import { useEffect, useState } from "react";
import { Plus, Trash2, FolderTree, AlertCircle, CornerDownRight } from "lucide-react";
import { categoriesApi } from "../../api/categoriesApi";
import SearchableSelect from "../../components/SearchableSelect";
import { buildCategoryTree, flattenCategoryOptions } from "../../utils/categoryTree";

function CategoryNode({ node, depth, onDelete }) {
  return (
    <>
      <div
        className="flex items-center justify-between py-3.5 pr-5 border-b border-border last:border-0"
        style={{ paddingLeft: `${20 + depth * 28}px` }}
      >
        <div className="flex items-center gap-2.5">
          {depth > 0 && <CornerDownRight size={14} className="text-slate-300 shrink-0" />}
          <FolderTree size={15} className="text-primary shrink-0" />
          <span className="text-sm text-ink">{node.categoryName}</span>
        </div>
        <button onClick={() => onDelete(node.categoryId)} className="text-slate-400 hover:text-danger transition-colors shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      {node.children.map((child) => (
        <CategoryNode key={child.categoryId} node={child} depth={depth + 1} onDelete={onDelete} />
      ))}
    </>
  );
}

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

  const tree = buildCategoryTree(categories);
  const parentOptions = flattenCategoryOptions(categories);

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
        <div className="sm:w-56">
          <SearchableSelect
            options={parentOptions}
            value={form.parentCategoryId}
            onChange={(val) => setForm({ ...form, parentCategoryId: val })}
            placeholder="No parent (top-level)"
            isClearable
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> Add
        </button>
      </form>

      {error && (
        <p className="flex items-center gap-2 text-sm text-danger mb-4"><AlertCircle size={15} />{error}</p>
      )}

      <div className="card !p-0">
        {categories.length === 0 ? (
          <p className="text-sm text-body p-6 text-center">No categories yet.</p>
        ) : (
          tree.map((root) => <CategoryNode key={root.categoryId} node={root} depth={0} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  );
}