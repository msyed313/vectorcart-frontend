import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "Admin" ? "/admin/company" : "/");
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Get started" title="Create your account" subtitle="Join VectorCart in under a minute.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="fullName" required value={form.fullName} onChange={handleChange}
              className="input-field !pl-10" placeholder="Jane Doe" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="input-field !pl-10" placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="phone" value={form.phone} onChange={handleChange}
              className="input-field !pl-10" placeholder="+92 300 0000000" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange}
              className="input-field !pl-10" placeholder="At least 8 characters" />
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-body text-center mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}