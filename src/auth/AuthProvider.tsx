/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const SESSION_INIT_TIMEOUT_MS = 15_000;

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
  session: Session | null;
  vendor: Vendor;
  loading: boolean;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  vendorSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isUsableAuthSession(session: Session | null): boolean {
  if (session == null) return true;
  const id = session.user?.id;
  return typeof id === "string" && id.length >= 8;
}

async function clearLocalAuth(reason: string): Promise<void> {
  console.warn("Clearing local auth:", reason);
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    // still clear UI state in caller
  }
}

function AuthLoadingShell() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-6">
      <p className="font-display text-xl font-semibold tracking-[0.2em] uppercase">Ketra</p>
      <p className="text-sm text-muted-foreground">Restoring your session…</p>
      <div
        className="h-1 w-32 max-w-full rounded-full bg-muted overflow-hidden"
        aria-hidden
      >
        <div className="h-full w-1/3 rounded-full bg-accent animate-pulse" />
      </div>
    </div>
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [vendor, setVendor] = useState<Vendor>(null);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const ensureUserProfile = useCallback(async (appUser: AppUser) => {
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
  }, []);

  const loadVendorForUser = useCallback(async (appUser: AppUser) => {
    if (!appUser.email) {
      if (mountedRef.current) setVendor(null);
      return;
    }

    const { data, error } = await supabase
      .from("vendors")
      .select("id, email, store_name, status")
      .ilike("email", appUser.email.trim())
      .maybeSingle();

    if (!mountedRef.current) return;

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
  }, []);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    const safeSetSession = (next: Session | null) => {
      if (!mountedRef.current) return;
      setSession((prev) => {
        if (
          prev?.access_token === next?.access_token &&
          prev?.expires_at === next?.expires_at &&
          prev?.user?.id === next?.user?.id
        ) {
          return prev;
        }
        return next;
      });
    };

    const safeSetUser = (next: AppUser | null) => {
      if (!mountedRef.current) return;
      setUser((prev) => {
        if (prev?.id === next?.id && prev?.email === next?.email) return prev;
        return next;
      });
    };

    const applyAuthSession = async (raw: Session | null) => {
      if (!mountedRef.current) return;

      if (raw != null && !isUsableAuthSession(raw)) {
        await clearLocalAuth("session present but user invalid");
        if (!mountedRef.current) return;
        safeSetSession(null);
        safeSetUser(null);
        setVendor(null);
        return;
      }

      safeSetSession(raw);
      const authUser = raw?.user ?? null;

      if (!authUser) {
        safeSetUser(null);
        if (mountedRef.current) setVendor(null);
        return;
      }

      const appUser: AppUser = { id: authUser.id, email: authUser.email ?? null };
      safeSetUser(appUser);
      await Promise.all([ensureUserProfile(appUser), loadVendorForUser(appUser)]);
    };

    const bootstrap = async () => {
      try {
        const getSessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<"timeout">((resolve) =>
          setTimeout(() => resolve("timeout"), SESSION_INIT_TIMEOUT_MS),
        );

        const outcome = await Promise.race([
          getSessionPromise.then((r) => ({ kind: "result" as const, r })),
          timeoutPromise.then((r) => ({ kind: "timeout" as const, r })),
        ]);

        if (outcome.kind === "timeout") {
          await clearLocalAuth("getSession timed out");
          if (mountedRef.current) {
            safeSetSession(null);
            safeSetUser(null);
            setVendor(null);
          }
          return;
        }

        const { data, error } = outcome.r;
        if (error) throw error;

        let next = data.session ?? null;
        if (next != null && !isUsableAuthSession(next)) {
          await clearLocalAuth("corrupted session from storage");
          next = null;
        }
        await applyAuthSession(next);
      } catch (err) {
        console.error("Auth init error:", err);
        await clearLocalAuth("init failed");
        if (mountedRef.current) {
          safeSetSession(null);
          safeSetUser(null);
          setVendor(null);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    void bootstrap();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void (async () => {
        try {
          await applyAuthSession(nextSession);
        } catch (e) {
          console.error("Auth state handler error:", e);
          await clearLocalAuth("onAuthStateChange handler failed");
          if (mountedRef.current) {
            safeSetSession(null);
            safeSetUser(null);
            setVendor(null);
          }
        }
      })();
    });

    subscription = data.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, [ensureUserProfile, loadVendorForUser]);

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) throw error;
    const authUser = data.user;
    if (!authUser) return;
    await ensureUserProfile({ id: authUser.id, email: authUser.email ?? null });
  }, [ensureUserProfile]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const authUser = data.user;
    if (!authUser) return;
    await ensureUserProfile({ id: authUser.id, email: authUser.email ?? null });
  }, [ensureUserProfile]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  }, []);

  const vendorSignIn = useCallback(
    async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      const { data: vendorRow, error: vendorError } = await supabase
        .from("vendors")
        .select("id, email, store_name, status")
        .ilike("email", normalizedEmail)
        .maybeSingle();

      if (vendorError) throw vendorError;
      if (!vendorRow) {
        throw new Error("No vendor account found for this email.");
      }

      let authUser: { id: string; email?: string | null } | null = null;

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!signInError) {
        authUser = signInData.user;
      } else {
        const isInvalidCredentials = signInError.message.toLowerCase().includes("invalid login credentials");

        if (!isInvalidCredentials) {
          throw signInError;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });

        if (signUpError && !signUpError.message.toLowerCase().includes("already registered")) {
          throw signUpError;
        }

        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (retryError) {
          throw retryError;
        }

        authUser = retryData.user;
      }

      if (!authUser) {
        throw new Error("Unable to start vendor session. Please try again.");
      }

      await ensureUserProfile({ id: authUser.id, email: authUser.email ?? null });

      const vendorData: Vendor = {
        id: vendorRow.id,
        email: vendorRow.email,
        store_name: vendorRow.store_name,
        status: vendorRow.status,
      };

      if (mountedRef.current) setVendor(vendorData);
    },
    [ensureUserProfile],
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("SignOut error", e);
      await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    } finally {
      if (mountedRef.current) {
        setSession(null);
        setUser(null);
        setVendor(null);
      }
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      const target = path.startsWith("/vendor") ? "/vendor/login" : "/auth";
      navigate(target, { replace: true });
    }
  }, [navigate]);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      session,
      vendor,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      vendorSignIn,
      signOut,
    }),
    [
      user,
      session,
      vendor,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      vendorSignIn,
      signOut,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <AuthLoadingShell /> : children}
    </AuthContext.Provider>
  );
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

/** Single allowed admin (simple allowlist; no roles table). */
const ADMIN_EMAIL = "keshavvyas1404@gmail.com";

export const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  const email = user?.email?.trim().toLowerCase() ?? "";
  if (!user || email !== ADMIN_EMAIL) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
