import { createContext, useContext, useEffect, useState } from "react";
import { companyApi } from "../api/companyApi";

const CompanyContext = createContext(null);

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api").replace("/api", "");

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const data = await companyApi.get();
      setCompany(data);
      setError(null);
    } catch (err) {
      setError("Could not load company settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  // Resolves the relative logoUrl ("/uploads/logos/...") returned by the API
  // into a full URL pointing at the backend's static file host.
  const logoSrc = company?.logoUrl ? `${API_ORIGIN}${company.logoUrl}` : null;

  return (
    <CompanyContext.Provider value={{ company, logoSrc, loading, error, refetch: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within a CompanyProvider");
  return ctx;
}
