import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Mail, Phone, Globe, MapPin, Palette,
  MessageSquareText, Upload, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { companyApi } from "../api/companyApi";
import { useCompany } from "../context/CompanyContext";

const CONTACT_FIELDS = [
  { name: "email", label: "Email", icon: Mail, placeholder: "hello@vectorcart.dev" },
  { name: "phone", label: "Phone", icon: Phone, placeholder: "+92 300 0000000" },
  { name: "website", label: "Website", icon: Globe, placeholder: "https://vectorcart.dev" },
];

const ADDRESS_FIELDS = [
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "country", label: "Country" },
  { name: "postalCode", label: "Postal code" },
];

const SOCIAL_FIELDS = [
  { name: "facebookUrl", label: "Facebook URL" },
  { name: "instagramUrl", label: "Instagram URL" },
  { name: "linkedInUrl", label: "LinkedIn URL" },
];

function Section({ icon: Icon, title, description, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      className="card"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shrink-0 shadow-brand">
          <Icon size={18} />
        </div>
        <div>
          <p className="font-display font-semibold text-ink">{title}</p>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function CompanySettings() {
  const { company, logoSrc, refetch } = useCompany();
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (company) setForm(company);
  }, [company]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyLogoFile = (file) => {
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    applyLogoFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (logoFile) await companyApi.uploadLogo(logoFile);
      await companyApi.update(form);
      await refetch();
      setStatus({ type: "success", message: "Company details updated." });
      setLogoFile(null);
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Check the form and try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="blob w-96 h-96 bg-primary top-[-6rem] left-[-6rem]" />
      <div className="blob w-80 h-80 bg-secondary top-40 right-[-4rem]" style={{ animationDelay: "3s" }} />
      <div className="blob w-72 h-72 bg-accent bottom-0 left-1/3" style={{ animationDelay: "6s" }} />

      <div className="relative max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full">
            Admin
          </span>
          <h1 className="text-4xl mt-4 tracking-tight">
            Company <span className="text-gradient">settings</span>
          </h1>
          <p className="text-body mt-3 max-w-lg leading-relaxed">
            Update your brand here — the logo, name, and contact info shown across
            the storefront, footer, and invoices all pull from this page automatically.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
          {/* Logo upload */}
          <Section icon={Building2} title="Logo & brand name" delay={0}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
               className={`relative w-48 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 shrink-0
  ${dragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-surface-muted hover:border-primary/50"}`}
>
{logoPreview ? (
  <img src={logoPreview} alt="New logo preview" className="w-full h-full object-contain p-4" />
) : logoSrc ? (
  <img src={logoSrc} alt="Current logo" className="w-full h-full object-contain p-4" />
) : (
                  <>
                    <Upload size={20} className="text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-400 text-center px-2">Drop logo here</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.webp"
                  onChange={(e) => applyLogoFile(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Company name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName || ""}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <p className="text-xs text-slate-400">PNG, JPG, SVG or WebP — max 2MB. Click or drag to replace.</p>
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section icon={Phone} title="Contact details" delay={0.05}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CONTACT_FIELDS.map(({ name, label, icon: Icon, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name={name}
                      value={form[name] || ""}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="input-field !pl-10"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Address */}
          <Section icon={MapPin} title="Address" delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ADDRESS_FIELDS.map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Brand colors */}
          <Section icon={Palette} title="Brand colors" description="Used across buttons, links, and accents" delay={0.15}>
            <div className="grid grid-cols-2 gap-5">
              {[
                { name: "primaryColorHex", label: "Primary", fallback: "#6366F1" },
                { name: "secondaryColorHex", label: "Secondary", fallback: "#8B5CF6" },
              ].map(({ name, label, fallback }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-ink mb-1.5">{label} color</label>
                  <div className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-border hover:border-slate-300 transition-colors">
                    <input
                      type="color"
                      name={name}
                      value={form[name] || fallback}
                      onChange={handleChange}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      name={name}
                      value={form[name] || ""}
                      onChange={handleChange}
                      placeholder={fallback}
                      className="flex-1 text-sm text-ink font-mono bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Social */}
          <Section icon={Globe} title="Social links" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {SOCIAL_FIELDS.map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Footer text */}
          <Section icon={MessageSquareText} title="Footer message" delay={0.25}>
            <textarea
              name="footerText"
              value={form.footerText || ""}
              onChange={handleChange}
              rows={3}
              placeholder="A short line shown in your site footer…"
              className="input-field resize-none"
            />
          </Section>

          {/* Status + submit */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <motion.div
              initial={false}
              animate={{ opacity: status ? 1 : 0, y: status ? 0 : 6 }}
              className={`flex items-center gap-2 text-sm font-medium ${
                status?.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {status?.type === "success" ? <CheckCircle2 size={16} /> : status ? <AlertCircle size={16} /> : null}
              {status?.message}
            </motion.div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 ml-auto">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
