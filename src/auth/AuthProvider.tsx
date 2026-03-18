import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type AppUser = {
  id: string;
  email: string | null;
};

type Vendor = {
  id: string;
  email: string | null;
  store_name: string | null;
  status: string | null;
} | null;

type AuthContextValue = {
  user: AppUser | null;
  vendor: Vendor;
  loading: boolean;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  vendorSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [vendor, setVendor] = useState<Vendor>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session first, then listen for changes
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user ?? null;

        if (!isMounted) return;

        if (authUser) {
          const appUser: AppUser = { id: authUser.id, email: authUser.email ?? null };
          setUser(appUser);
          await Promise.all([ensureUserProfile(appUser), loadVendorForUser(appUser)]);
        } else {
          setUser(null);
          setVendor(null);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for future auth changes (login/logout/token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      const authUser = session?.user ?? null;

      if (!authUser) {
        setUser(null);
        setVendor(null);
        localStorage.removeItem("sb-ckujdaafecugnysiscyh-auth-token");
        setLoading(false);
        return;
      }

      const appUser: AppUser = { id: authUser.id, email: authUser.email ?? null };
      setUser(appUser);
      await Promise.all([ensureUserProfile(appUser), loadVendorForUser(appUser)]);
      if (isMounted) setLoading(false);
    });

    // Safety fallback: never stay stuck loading
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (appUser: AppUser) => {
    if (!appUser.email) return;

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", appUser.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading user profile", error);
      return;
    }

    if (data) return;

    const { error: insertError } = await supabase.from("users").insert({
      id: appUser.id,
      email: appUser.email,
      full_name: null,
      plan: "free",
      tryon_count: 2,
    });

    if (insertError) {
      console.error("Error creating user profile", insertError);
    }
  };

  const loadVendorForUser = async (appUser: AppUser) => {
    if (!appUser.email) return;

    const { data, error } = await supabase
      .from("vendors")
      .select("id, email, store_name, status")
      .eq("email", appUser.email)
      .maybeSingle();

    if (error) {
      console.error("Error loading vendor profile", error);
      return;
    }

    setVendor(
      data
        ? {
            id: data.id,
            email: data.email,
            store_name: data.store_name,
            status: data.status,
          }
        : null,
    );
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) throw error;
    const authUser = data.user;
    if (!authUser) return;
    await ensureUserProfile({ id: authUser.id, email: authUser.email ?? null });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const authUser = data.user;
    if (!authUser) return;
    await ensureUserProfile({ id: authUser.id, email: authUser.email ?? null });
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  };

  const vendorSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const authUser = data.user;
    if (!authUser) return;
    await ensureUserProfile({ id: authUser.id, email: authUser.email ?? null });

    const { data: vendorRow, error: vendorError } = await supabase
      .from("vendors")
      .select("id, email, store_name, status")
      .eq("email", email)
      .maybeSingle();

    if (vendorError) throw vendorError;
    if (!vendorRow) {
      await supabase.auth.signOut();
      throw new Error("No vendor account found for this email.");
    }

    setVendor({
      id: vendorRow.id,
      email: vendorRow.email,
      store_name: vendorRow.store_name,
      status: vendorRow.status,
    });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("SignOut error", e);
    } finally {
      setUser(null);
      setVendor(null);
      localStorage.removeItem("sb-ckujdaafecugnysiscyh-auth-token");
      sessionStorage.clear();
      window.location.href = "/auth";
    }
  };

  const value: AuthContextValue = {
    user,
    vendor,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    vendorSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

type ProtectedRouteProps = { children: ReactNode };

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export const VendorProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { vendor, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  if (!vendor) return <Navigate to="/vendor/login" replace />;
  return <>{children}</>;
};