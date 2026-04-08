import { useEffect, useMemo, useState } from "react";
import { Camera, Users, Activity, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Camera; color: string }) => (
  <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color.replace(")", " / 0.15)")}` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <p className="font-display text-2xl font-extrabold tracking-wide">{value}</p>
    <p className="text-muted-foreground font-body text-xs mt-0.5">{label}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = {
    success: "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]",
    failed: "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]",
  };
  return <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${s[status]}`}>{status}</span>;
};

type TryonSession = Tables<"tryon_sessions">;
type VendorRow = Tables<"vendors">;
type UserRow = Tables<"users">;

const AdminTryOnMonitor = () => {
  const [sessions, setSessions] = useState<TryonSession[]>([]);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      setLoading(true);
      const [sessionsRes, vendorsRes, usersRes] = await Promise.all([
        supabase.from("tryon_sessions").select("*"),
        supabase.from("vendors").select("*"),
        supabase.from("users").select("*"),
      ]);
      if (!alive) return;
      if (sessionsRes.error || vendorsRes.error || usersRes.error) {
        console.error("Failed to load try-on monitor data", sessionsRes.error || vendorsRes.error || usersRes.error);
        setSessions([]);
        setVendors([]);
        setUsers([]);
      } else {
        setSessions(sessionsRes.data ?? []);
        setVendors(vendorsRes.data ?? []);
        setUsers(usersRes.data ?? []);
      }
      setLoading(false);
    };
    void loadData();
    return () => {
      alive = false;
    };
  }, []);

  const today = new Date().toDateString();
  const tryOnsToday = sessions.filter((s) => s.created_at && new Date(s.created_at).toDateString() === today).length;
  const thisMonth = sessions.filter((s) => s.created_at && new Date(s.created_at).getMonth() === new Date().getMonth()).length;
  const totalEver = sessions.length;
  const avgPerUser = users.length ? (totalEver / users.length).toFixed(1) : "0";

  const tryOnSessions = useMemo(
    () =>
      sessions.slice(0, 10).map((s) => ({
        id: s.id,
        user: s.user_id || "Guest",
        source: s.source || "Ketra Direct",
        timestamp: s.created_at ? new Date(s.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
        status: (s.status || "success").toLowerCase() === "failed" ? "failed" : "success",
      })),
    [sessions],
  );

  const tryOnSourceSplit = useMemo(() => {
    const sourceMap = new Map<string, number>();
    sessions.forEach((s) => {
      const key = s.source || "Ketra Direct";
      sourceMap.set(key, (sourceMap.get(key) ?? 0) + 1);
    });
    const total = Math.max(1, sessions.length);
    const colors = ["hsl(340, 60%, 55%)", "hsl(200, 70%, 55%)", "hsl(270, 60%, 60%)"];
    const data = Array.from(sourceMap.entries()).map(([name, count], idx) => ({
      name,
      value: Math.round((count / total) * 100),
      fill: colors[idx % colors.length],
    }));
    return data.length ? data : [{ name: "No Data", value: 100, fill: "hsl(0,0%,40%)" }];
  }, [sessions]);

  const activeVendorsToday = useMemo(() => {
    const vendorMap = new Map<string, number>();
    sessions.forEach((s) => {
      if (!s.vendor_id) return;
      vendorMap.set(s.vendor_id, (vendorMap.get(s.vendor_id) ?? 0) + 1);
    });
    const nameMap = new Map(vendors.map((v) => [v.id, v.store_name || "Vendor"]));
    const list = Array.from(vendorMap.entries())
      .map(([vendorId, tryOns]) => ({ name: nameMap.get(vendorId) || "Vendor", tryOns }))
      .sort((a, b) => b.tryOns - a.tryOns)
      .slice(0, 5);
    return list;
  }, [sessions, vendors]);

  return (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Try-ons Today" value={tryOnsToday.toLocaleString()} icon={Camera} color="hsl(340 60% 55%)" />
      <StatCard label="This Month" value={thisMonth.toLocaleString()} icon={Activity} color="hsl(200 70% 55%)" />
      <StatCard label="Total Ever" value={totalEver.toLocaleString()} icon={TrendingUp} color="hsl(270 60% 60%)" />
      <StatCard label="Avg per User" value={avgPerUser} icon={Users} color="hsl(160 60% 45%)" />
    </div>
    {loading && <p className="text-sm text-muted-foreground">Loading try-on monitor...</p>}
    {!loading && sessions.length === 0 && <p className="text-sm text-muted-foreground">No try-on data found.</p>}

    <div className="grid lg:grid-cols-2 gap-4">
      {/* Recent Sessions */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[hsl(160_60%_45%)] animate-pulse" />
          <h3 className="font-display text-sm font-extrabold tracking-wide">Live Sessions</h3>
        </div>
        <div className="space-y-2">
          {tryOnSessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <span className="font-body text-sm text-foreground flex-1 truncate">{s.user}</span>
              <span className="font-body text-xs text-muted-foreground">{s.source}</span>
              <span className="font-body text-[10px] text-muted-foreground">{s.timestamp}</span>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Source Split + Active Vendors */}
      <div className="space-y-4">
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
          <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Source Split</h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tryOnSourceSplit} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {tryOnSourceSplit.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {tryOnSourceSplit.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: s.fill }} />
                  <span className="font-body text-sm text-foreground">{s.name}</span>
                  <span className="font-display text-sm font-bold">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
          <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Most Active Vendors Today</h3>
          <div className="space-y-2">
            {activeVendorsToday.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3">
                <span className="font-display text-xs text-muted-foreground w-5">#{i + 1}</span>
                <span className="font-body text-sm text-foreground flex-1">{v.name}</span>
                <span className="font-display text-sm font-bold">{v.tryOns}</span>
                <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(v.tryOns / (activeVendorsToday[0]?.tryOns || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminTryOnMonitor;
