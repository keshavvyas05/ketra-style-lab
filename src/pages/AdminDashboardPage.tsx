import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Crown, Loader2, LogOut, Menu, RefreshCw, ShieldCheck, Store, Trophy, Users, XCircle } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Section = "overview" | "users" | "vendors" | "submissions" | "ootw";

type UserRow = Tables<"users">;
type VendorRow = Tables<"vendors">;
type SubmissionRow = Tables<"outfit_submissions"> & {
  users: Pick<Tables<"users">, "full_name" | "email"> | null;
};

type Stats = {
  totalUsers: number;
  totalVendors: number;
  totalTryOns: number;
};

const navItems: { key: Section; label: string; icon: typeof Users }[] = [
  { key: "overview", label: "Overview", icon: ShieldCheck },
  { key: "users", label: "Users", icon: Users },
  { key: "vendors", label: "Vendors", icon: Store },
  { key: "submissions", label: "Submissions", icon: Trophy },
  { key: "ootw", label: "OOTW Leaderboard", icon: Crown },
];

const sectionTitles: Record<Section, string> = {
  overview: "Platform Overview",
  users: "All Users",
  vendors: "Vendors & Approvals",
  submissions: "Outfit Submissions",
  ootw: "OOTW Leaderboard Manager",
};

const getWeekAndYear = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7,
  );

  return {
    weekNumber,
    year: now.getFullYear(),
  };
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const statusBadgeClass = (status?: string | null) => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "active" || normalized === "approved") {
    return "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]";
  }
  if (normalized === "pending") {
    return "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]";
  }
  return "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]";
};

const cardClass = "bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [active, setActive] = useState<Section>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [{ weekNumber, year }] = useState(() => getWeekAndYear());
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalVendors: 0, totalTryOns: 0 });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);

  const [loadingPage, setLoadingPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorActionId, setVendorActionId] = useState<string | null>(null);
  const [winnerActionId, setWinnerActionId] = useState<string | null>(null);

  const pendingVendors = useMemo(
    () => vendors.filter((vendor) => (vendor.status || "").toLowerCase() === "pending"),
    [vendors],
  );

  const weeklySubmissions = useMemo(
    () => submissions.filter((item) => item.week_number === weekNumber && item.year === year),
    [submissions, weekNumber, year],
  );

  const leaderboard = useMemo(() => {
    const list = [...weeklySubmissions];
    list.sort((a, b) => {
      const totalA = a.total_score ?? 0;
      const totalB = b.total_score ?? 0;
      if (totalB !== totalA) return totalB - totalA;
      return (b.community_votes ?? 0) - (a.community_votes ?? 0);
    });
    return list;
  }, [weeklySubmissions]);

  const loadDashboardData = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    setError(null);

    try {
      const [usersCountRes, vendorsCountRes, tryOnsCountRes, usersRes, vendorsRes, submissionsRes] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("vendors").select("id", { count: "exact", head: true }),
        supabase.from("tryon_sessions").select("id", { count: "exact", head: true }),
        supabase
          .from("users")
          .select("id, full_name, email, plan, instagram_id, is_active, tryon_count, total_tryons_used, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("vendors")
          .select("id, store_name, owner_name, email, status, country, monthly_pool, pool_used, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("outfit_submissions")
          .select(
            "id, user_id, instagram_id, photo_url, caption, submission_type, style_score, trend_score, creativity_score, impression_score, total_score, community_votes, is_winner, week_number, year, created_at, users(full_name, email)",
          )
          .order("created_at", { ascending: false }),
      ]);

      const firstError =
        usersCountRes.error ||
        vendorsCountRes.error ||
        tryOnsCountRes.error ||
        usersRes.error ||
        vendorsRes.error ||
        submissionsRes.error;

      if (firstError) {
        throw firstError;
      }

      setStats({
        totalUsers: usersCountRes.count ?? 0,
        totalVendors: vendorsCountRes.count ?? 0,
        totalTryOns: tryOnsCountRes.count ?? 0,
      });

      setUsers((usersRes.data || []) as UserRow[]);
      setVendors((vendorsRes.data || []) as VendorRow[]);
      setSubmissions((submissionsRes.data || []) as SubmissionRow[]);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load admin dashboard data."));
    } finally {
      setLoadingPage(false);
      if (showSpinner) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData(false);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const updateVendorStatus = async (vendorId: string, status: "active" | "rejected") => {
    setVendorActionId(vendorId);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("vendors")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", vendorId);

      if (updateError) throw updateError;

      setVendors((prev) => prev.map((vendor) => (vendor.id === vendorId ? { ...vendor, status } : vendor)));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update vendor status."));
    } finally {
      setVendorActionId(null);
    }
  };

  const setWeeklyWinner = async (submission: SubmissionRow) => {
    if (!submission.week_number || !submission.year) {
      setError("This submission has no week/year metadata.");
      return;
    }

    setWinnerActionId(submission.id);
    setError(null);

    try {
      const { error: clearError } = await supabase
        .from("outfit_submissions")
        .update({ is_winner: false })
        .eq("week_number", submission.week_number)
        .eq("year", submission.year);

      if (clearError) throw clearError;

      const { error: winnerError } = await supabase
        .from("outfit_submissions")
        .update({ is_winner: true })
        .eq("id", submission.id);

      if (winnerError) throw winnerError;

      await supabase.from("hall_of_fame").upsert(
        {
          submission_id: submission.id,
          user_id: submission.user_id,
          full_name: submission.users?.full_name || null,
          instagram_id: submission.instagram_id,
          photo_url: submission.photo_url,
          final_score: submission.total_score,
          week_number: submission.week_number,
          year: submission.year,
        },
        { onConflict: "submission_id" },
      );

      setSubmissions((prev) =>
        prev.map((entry) => {
          if (entry.week_number === submission.week_number && entry.year === submission.year) {
            return { ...entry, is_winner: entry.id === submission.id };
          }
          return entry;
        }),
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to set weekly winner."));
    } finally {
      setWinnerActionId(null);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 pb-4 border-b border-border/30">
        <p className="font-display text-xl font-extrabold tracking-[0.15em] gradient-text">KETRA</p>
        <p className="font-body text-[10px] text-muted-foreground tracking-[0.2em] uppercase mt-1">Admin Console</p>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActive(key);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm tracking-wide transition-colors ${
              active === key
                ? "bg-accent/15 text-accent font-bold"
                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
            }`}
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border/30 space-y-2">
        <button
          onClick={() => loadDashboardData(true)}
          disabled={refreshing}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-display text-sm tracking-wide text-muted-foreground hover:bg-secondary/50 transition-colors disabled:opacity-60"
        >
          {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Refresh
        </button>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-display text-sm tracking-wide text-muted-foreground hover:bg-[hsl(0_60%_55%_/_0.1)] hover:text-[hsl(0_60%_55%)] transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${cardClass} p-5`}>
          <p className="text-xs tracking-[0.12em] uppercase text-muted-foreground font-display">Total Users</p>
          <p className="text-3xl font-display font-extrabold mt-2">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} p-5`}>
          <p className="text-xs tracking-[0.12em] uppercase text-muted-foreground font-display">Total Vendors</p>
          <p className="text-3xl font-display font-extrabold mt-2">{stats.totalVendors.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} p-5`}>
          <p className="text-xs tracking-[0.12em] uppercase text-muted-foreground font-display">Total Try-ons</p>
          <p className="text-3xl font-display font-extrabold mt-2">{stats.totalTryOns.toLocaleString()}</p>
        </div>
      </div>

      <div className={`${cardClass} p-5`}>
        <p className="font-display text-sm font-bold tracking-wide">Quick Snapshot</p>
        <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="bg-background/40 border border-border/40 rounded-xl p-4">
            <p className="text-muted-foreground">Pending vendor approvals</p>
            <p className="text-2xl font-display font-extrabold mt-1">{pendingVendors.length}</p>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-xl p-4">
            <p className="text-muted-foreground">Submissions this week</p>
            <p className="text-2xl font-display font-extrabold mt-1">{weeklySubmissions.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className={`${cardClass} p-4 md:p-5 overflow-auto`}>
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border/40">
            <th className="py-3 px-2">Name</th>
            <th className="py-3 px-2">Email</th>
            <th className="py-3 px-2">Plan</th>
            <th className="py-3 px-2">Instagram</th>
            <th className="py-3 px-2">Try-ons Used</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item.id} className="border-b border-border/20 hover:bg-secondary/20">
              <td className="py-3 px-2">{item.full_name || "—"}</td>
              <td className="py-3 px-2">{item.email || "—"}</td>
              <td className="py-3 px-2">{item.plan || "free"}</td>
              <td className="py-3 px-2">{item.instagram_id || "—"}</td>
              <td className="py-3 px-2">{item.total_tryons_used ?? 0}</td>
              <td className="py-3 px-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-display ${item.is_active ? "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]" : "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]"}`}>
                  {item.is_active ? "active" : "inactive"}
                </span>
              </td>
              <td className="py-3 px-2">{formatDate(item.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-4">
      <div className={`${cardClass} p-4 md:p-5 overflow-auto`}>
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border/40">
              <th className="py-3 px-2">Store</th>
              <th className="py-3 px-2">Owner</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Country</th>
              <th className="py-3 px-2">Pool</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => {
              const pending = (vendor.status || "").toLowerCase() === "pending";
              const pool = `${vendor.pool_used ?? 0}/${vendor.monthly_pool ?? 0}`;

              return (
                <tr key={vendor.id} className="border-b border-border/20 hover:bg-secondary/20">
                  <td className="py-3 px-2">{vendor.store_name || "—"}</td>
                  <td className="py-3 px-2">{vendor.owner_name || "—"}</td>
                  <td className="py-3 px-2">{vendor.email || "—"}</td>
                  <td className="py-3 px-2">{vendor.country || "—"}</td>
                  <td className="py-3 px-2">{pool}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-display ${statusBadgeClass(vendor.status)}`}>
                      {vendor.status || "unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {pending ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateVendorStatus(vendor.id, "active")}
                          disabled={vendorActionId === vendor.id}
                          className="px-3 py-1.5 rounded-lg bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)] text-xs font-display uppercase tracking-[0.08em] hover:opacity-90 disabled:opacity-60"
                        >
                          {vendorActionId === vendor.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => updateVendorStatus(vendor.id, "rejected")}
                          disabled={vendorActionId === vendor.id}
                          className="px-3 py-1.5 rounded-lg bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)] text-xs font-display uppercase tracking-[0.08em] hover:opacity-90 disabled:opacity-60"
                        >
                          {vendorActionId === vendor.id ? "..." : "Reject"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">No action</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className={`${cardClass} p-4 md:p-5 overflow-auto`}>
      <table className="w-full min-w-[1100px] text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border/40">
            <th className="py-3 px-2">User</th>
            <th className="py-3 px-2">Instagram</th>
            <th className="py-3 px-2">Type</th>
            <th className="py-3 px-2">Votes</th>
            <th className="py-3 px-2">Total Score</th>
            <th className="py-3 px-2">Week / Year</th>
            <th className="py-3 px-2">Winner</th>
            <th className="py-3 px-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((item) => (
            <tr key={item.id} className="border-b border-border/20 hover:bg-secondary/20">
              <td className="py-3 px-2">{item.users?.full_name || item.users?.email || "—"}</td>
              <td className="py-3 px-2">{item.instagram_id || "—"}</td>
              <td className="py-3 px-2">{item.submission_type || "—"}</td>
              <td className="py-3 px-2">{item.community_votes ?? 0}</td>
              <td className="py-3 px-2">{item.total_score ?? 0}</td>
              <td className="py-3 px-2">{item.week_number ?? "—"} / {item.year ?? "—"}</td>
              <td className="py-3 px-2">
                {item.is_winner ? (
                  <span className="inline-flex items-center gap-1 text-[hsl(45_100%_55%)]"><CheckCircle2 size={14} /> Yes</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><XCircle size={14} /> No</span>
                )}
              </td>
              <td className="py-3 px-2">{formatDate(item.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOOTW = () => (
    <div className="space-y-4">
      <div className={`${cardClass} p-5`}>
        <p className="text-sm text-muted-foreground">
          Managing week <span className="font-display text-foreground font-bold">{weekNumber}</span> · {year}
        </p>
      </div>

      <div className="grid gap-3">
        {leaderboard.length === 0 && (
          <div className={`${cardClass} p-5 text-sm text-muted-foreground`}>
            No submissions found for this week.
          </div>
        )}

        {leaderboard.map((item, index) => (
          <div key={item.id} className={`${cardClass} p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-5`}>
            <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center font-display font-extrabold">
              #{index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-base truncate">{item.users?.full_name || item.instagram_id || "Ketra User"}</p>
              <p className="text-xs text-muted-foreground truncate">{item.instagram_id || "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Score: {item.total_score ?? 0} · Votes: {item.community_votes ?? 0}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {item.is_winner ? (
                <span className="px-3 py-1.5 rounded-lg bg-[hsl(45_100%_55%_/_0.2)] text-[hsl(45_100%_55%)] text-xs font-display tracking-[0.1em] uppercase">
                  Current Winner
                </span>
              ) : (
                <button
                  onClick={() => setWeeklyWinner(item)}
                  disabled={winnerActionId === item.id}
                  className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-display tracking-[0.1em] uppercase hover:opacity-90 disabled:opacity-60"
                >
                  {winnerActionId === item.id ? "Saving..." : "Pick Winner"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (active === "overview") return renderOverview();
    if (active === "users") return renderUsers();
    if (active === "vendors") return renderVendors();
    if (active === "submissions") return renderSubmissions();
    return renderOOTW();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-[250px] border-r border-border/30 bg-card/50 backdrop-blur-md flex-col shrink-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} className="absolute left-0 top-0 bottom-0 w-[260px] bg-card border-r border-border/30 flex flex-col">
            <SidebarContent />
          </motion.aside>
        </motion.div>
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 px-4 md:px-6 py-4 border-b border-border/30 bg-background/80 backdrop-blur-md flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground">
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg md:text-xl font-extrabold tracking-wide">{sectionTitles[active]}</h1>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4">
          {error && (
            <div className="bg-[hsl(0_60%_55%_/_0.1)] border border-[hsl(0_60%_55%_/_0.35)] rounded-xl p-3 text-sm text-[hsl(0_60%_60%)]">
              {error}
            </div>
          )}

          {loadingPage ? (
            <div className={`${cardClass} p-8 flex items-center justify-center gap-3`}>
              <Loader2 size={20} className="animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Loading admin dashboard...</p>
            </div>
          ) : (
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
