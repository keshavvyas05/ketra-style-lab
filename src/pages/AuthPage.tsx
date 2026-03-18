import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user, loading: authLoading } = useAuth();
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.removeItem("sb-ckujdaafecugnysiscyh-auth-token");
    }
  }, [user, authLoading]);

  // Listen for auth state changes and redirect immediately
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await signUpWithEmail(formData.name, formData.email, formData.password);
        setJustSignedUp(true);
      }
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setLoading(false);
      const message = err?.message ?? "Google sign-in failed. Please try again.";
      setError(message);
    }
  };

  // After successful signup, ensure a profile row exists in public.users
  useEffect(() => {
    if (!justSignedUp || !user) return;

    const createProfile = async () => {
      try {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          plan: "free",
          tryon_count: 2,
          total_tryons_used: 0,
          is_active: true,
        });
      } catch (err) {
        console.error("Failed to create user profile", err);
      } finally {
        setJustSignedUp(false);
      }
    };

    createProfile();
  }, [justSignedUp, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground" style={{ background: "hsl(260 20% 6%)" }}>
        <div className="text-center">
          <Loader2 size={24} className="animate-spin mx-auto mb-4" style={{ color: "hsl(270 50% 60%)" }} />
          <p className="text-sm" style={{ color: "hsl(270 15% 65%)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "hsl(260 20% 6%)" }}>
      {/* Geometric purple triangle accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large rotated triangle/diamond shape */}
        <div
          className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
          style={{
            top: "-15%",
            right: "-10%",
            background: "linear-gradient(135deg, hsl(270 80% 50% / 0.35), hsl(280 70% 30% / 0.1))",
            transform: "rotate(45deg)",
            borderRadius: "60px",
          }}
        />
        {/* Secondary smaller shape */}
        <div
          className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
          style={{
            bottom: "-10%",
            left: "-5%",
            background: "linear-gradient(135deg, hsl(270 60% 40% / 0.15), hsl(280 50% 25% / 0.05))",
            transform: "rotate(45deg)",
            borderRadius: "40px",
          }}
        />
        {/* Glow effects */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-[150px]" style={{ background: "hsl(270 70% 50% / 0.12)" }} />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full blur-[120px]" style={{ background: "hsl(280 60% 45% / 0.08)" }} />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main container - two panel slider */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[900px] relative z-10 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          border: "1px solid hsl(270 30% 25% / 0.5)",
          boxShadow: "0 25px 80px hsl(270 60% 15% / 0.4), 0 0 60px hsl(270 50% 40% / 0.1)",
        }}
      >
        <div className="relative" style={{ minHeight: "560px" }}>
          {/* Sliding decorative panel */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center relative p-10 md:absolute md:inset-y-0 md:w-1/2"
            style={{ background: "linear-gradient(160deg, hsl(270 50% 15%), hsl(260 40% 8%))", zIndex: 2 }}
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Purple geometric shape inside panel */}
            <motion.div
              className="absolute w-[280px] h-[280px]"
              style={{
                background: "linear-gradient(135deg, hsl(270 80% 55% / 0.6), hsl(280 70% 35% / 0.2))",
                borderRadius: "40px",
                boxShadow: "0 0 80px hsl(270 70% 50% / 0.3), inset 0 0 60px hsl(270 80% 60% / 0.1)",
              }}
              animate={{ rotate: isLogin ? 45 : -45 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Inner glow */}
            <div className="absolute w-40 h-40 rounded-full blur-[60px]" style={{ background: "hsl(270 80% 60% / 0.25)" }} />

            {/* Text overlay */}
            <div className="relative z-10 text-center mt-[280px]">
              <h2 className="font-display text-4xl font-extrabold tracking-[0.2em] text-white/90 mb-3">KETRA</h2>
              <AnimatePresence mode="wait">
                <motion.p
                  key={isLogin ? "login-cta" : "signup-cta"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="font-body text-sm text-white/40 tracking-wider"
                >
                  {isLogin ? "Welcome back" : "Join the future of fashion"}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Form Panel */}
          <div
            className="relative md:absolute md:inset-y-0 md:w-1/2 p-8 md:p-10 flex flex-col justify-center"
            style={{ background: "hsl(260 15% 10% / 0.95)", backdropFilter: "blur(20px)", zIndex: 1, right: isLogin ? "0" : undefined, left: isLogin ? undefined : "0" }}
          >
          {/* Mobile logo */}
          <Link to="/" className="block text-center mb-8 md:hidden">
            <h1 className="font-display text-4xl font-extrabold tracking-[0.15em]" style={{ color: "hsl(0 0% 90%)" }}>KETRA</h1>
          </Link>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-title" : "signup-title"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="font-display text-3xl font-extrabold tracking-[0.12em]" style={{ color: "hsl(0 0% 92%)" }}>
                {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
              </h2>
              <p className="font-body text-sm mt-1" style={{ color: "hsl(270 20% 55%)" }}>
                {isLogin ? "Log in to continue your journey" : "Join the future of fashion"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "hsl(260 15% 15%)",
                border: "1px solid hsl(270 25% 25%)",
                color: "hsl(0 0% 80%)",
              }}
            >
              <GoogleIcon />
              Google
            </button>
            <button
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "hsl(260 15% 15%)",
                border: "1px solid hsl(270 25% 25%)",
                color: "hsl(0 0% 80%)",
              }}
            >
              <AppleIcon />
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: "hsl(270 20% 20%)" }} />
            <span className="font-body text-xs tracking-widest uppercase" style={{ color: "hsl(270 15% 40%)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "hsl(270 20% 20%)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(270 30% 45%)" }} />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl font-body text-sm focus:outline-none transition-all duration-300"
                      style={{
                        background: "hsl(260 15% 13%)",
                        border: "1px solid hsl(270 20% 22%)",
                        color: "hsl(0 0% 88%)",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "hsl(270 60% 50%)"}
                      onBlur={(e) => e.target.style.borderColor = "hsl(270 20% 22%)"}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(270 30% 45%)" }} />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl font-body text-sm focus:outline-none transition-all duration-300"
                style={{
                  background: "hsl(260 15% 13%)",
                  border: "1px solid hsl(270 20% 22%)",
                  color: "hsl(0 0% 88%)",
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(270 60% 50%)"}
                onBlur={(e) => e.target.style.borderColor = "hsl(270 20% 22%)"}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(270 30% 45%)" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-11 py-3.5 rounded-xl font-body text-sm focus:outline-none transition-all duration-300"
                style={{
                  background: "hsl(260 15% 13%)",
                  border: "1px solid hsl(270 20% 22%)",
                  color: "hsl(0 0% 88%)",
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(270 60% 50%)"}
                onBlur={(e) => e.target.style.borderColor = "hsl(270 20% 22%)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "hsl(270 25% 40%)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="font-body text-xs hover:underline" style={{ color: "hsl(270 50% 60%)" }}>
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(270 70% 50% / 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-display text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, hsl(270 70% 50%), hsl(280 60% 40%))",
                color: "white",
                boxShadow: "0 4px 20px hsl(270 70% 45% / 0.3)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isLogin ? "Logging in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Log In" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400 font-body">
              {error}
            </p>
          )}

          <p className="text-center font-body text-xs mt-6" style={{ color: "hsl(270 15% 45%)" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="hover:underline font-medium"
              style={{ color: "hsl(270 50% 60%)" }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;