import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";

const VendorLoginPage = () => {
  const navigate = useNavigate();
  const { vendorSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await vendorSignIn(email, password);
      navigate("/vendor/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-4xl font-extrabold tracking-[0.15em] text-foreground">KETRA</h1>
          </Link>
        </div>

        {/* Card */}
        <div className="p-8 md:p-10 rounded-2xl glass">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wide text-foreground">Welcome Back, Vendor</h2>
            <p className="text-muted-foreground font-body text-sm mt-2">Manage your store's virtual try-on experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-foreground font-body text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="vendor@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-foreground font-body text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <button type="button" className="text-accent font-body text-xs hover:underline">Forgot password?</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-body font-semibold text-sm tracking-wider uppercase text-accent-foreground bg-accent hover:bg-accent/90 disabled:opacity-70 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400 font-body">
              {error}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground font-body text-xs">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-muted-foreground font-body text-sm">
            Not a vendor yet?{" "}
            <Link to="/vendor" className="text-accent font-medium hover:underline">Register Your Store</Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground font-body text-xs transition-colors">
            ← Back to Ketra
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorLoginPage;
