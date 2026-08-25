import { useState } from "react";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { useCompany } from "../context/CompanyContext";

function getInitials(name) {
  if (!name) return "VC";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Footer() {
  const { company, logoSrc, loading } = useCompany();
  const [imgFailed, setImgFailed] = useState(false);
  const showRealLogo = !loading && logoSrc && !imgFailed;
  const companyName = company?.companyName || "VectorCart";

  if (loading) {
    return <footer className="border-t border-border py-10 mt-24" />;
  }

  return (
    <footer className="relative border-t border-border bg-white mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            {showRealLogo ? (
              <img
                src={logoSrc}
                alt={companyName}
                onError={() => setImgFailed(true)}
                className="h-9 w-auto max-w-[150px] object-contain"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-display font-semibold text-xs">
                {getInitials(companyName)}
              </div>
            )}
            <span className="font-display font-semibold text-ink">{companyName}</span>
          </div>
          <p className="text-sm text-body max-w-xs leading-relaxed">
            {company?.footerText || "AI-powered commerce, built for finding exactly what you mean."}
          </p>
        </div>

        <div className="text-sm text-body space-y-3">
          <p className="font-display font-medium text-ink mb-3">Contact</p>
          {company?.address && (
            <p className="flex items-start gap-2">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              {company.address}{company?.city ? `, ${company.city}` : ""}
            </p>
          )}
          {company?.phone && (
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-primary shrink-0" />
              {company.phone}
            </p>
          )}
          {company?.email && (
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              {company.email}
            </p>
          )}
        </div>

        <div className="text-sm text-body space-y-3">
          <p className="font-display font-medium text-ink mb-3">Follow</p>
          <div className="flex gap-3">
            {company?.facebookUrl && (
              <a href={company.facebookUrl} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200">
                <Facebook size={16} />
              </a>
            )}
            {company?.instagramUrl && (
              <a href={company.instagramUrl} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200">
                <Instagram size={16} />
              </a>
            )}
            {company?.linkedInUrl && (
              <a href={company.linkedInUrl} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200">
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="vector-divider max-w-7xl mx-auto px-6 !my-0" />

      <p className="text-center text-xs text-slate-400 py-6">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </p>
    </footer>
  );
}
