import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { authApi } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

const STEPS = ["Email", "Verify code", "New password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0, 1, 2
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setStep(1);
    } catch {
      setError("Something went wrong. Try again.");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const res = await authApi.verifyOtp(email, otp);
      setResetToken(res.resetToken);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Invalid or expired code.");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authApi.resetPassword(resetToken, newPassword);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Try again.");
    } finally { setLoading(false); }
  };

  if (done) {
    return (
      <AuthLayout title="Password updated">
        <div className="flex flex-col items-center text-center py-4">
          <CheckCircle2 size={40} className="text-success mb-3" />
          <p className="text-body">Redirecting you to login…</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="Reset password" title={STEPS[step]} subtitle={
      step === 0 ? "Enter the email linked to your account." :
      step === 1 ? `We sent a 6-digit code to ${email}.` :
      "Choose a new password for your account."
    }>
      {/* Step progress dots */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-brand-gradient" : "bg-border"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.form key="step0" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            onSubmit={handleRequestOtp} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field !pl-10" placeholder="you@example.com" />
            </div>
            {error && <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending code…" : "Send code"}
            </button>
          </motion.form>
        )}

        {step === 1 && (
          <motion.form key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                className="input-field !pl-10 tracking-[0.3em] font-mono text-center" placeholder="000000" />
            </div>
            {error && <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Verifying…" : "Verify code"}
            </button>
            <button type="button" onClick={() => setStep(0)} className="text-sm text-body hover:text-primary w-full text-center">
              Use a different email
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="input-field !pl-10" placeholder="At least 8 characters" />
            </div>
            {error && <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle size={15} />{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Updating…" : "Update password"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-sm text-body text-center mt-6">
        Remembered it? <Link to="/login" className="text-primary font-medium hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}