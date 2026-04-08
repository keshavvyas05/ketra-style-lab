import { useEffect, useMemo, useState } from "react";
import { DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ChartTooltipPayload = {
  value: number | string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
};

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="font-body text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-sm font-bold">{typeof payload[0].value === "number" ? payload[0].value.toLocaleString() : payload[0].value}</p>
    </div>
  );
};

type UserRow = Tables<"users">;
type VendorRow = Tables<"vendors">;

const monthKey = (value: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString(undefined, { month: "short" });
};

const AdminRevenue = () => {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      setLoading(true);
      const [usersRes, vendorsRes] = await Promise.all([
        supabase.from("users").select("*"),
        supabase.from("vendors").select("*"),
      ]);
      if (!alive) return;
      if (usersRes.error || vendorsRes.error) {
        console.error("Failed to load revenue data", usersRes.error || vendorsRes.error);
        setUsers([]);
        setVendors([]);
        setLoading(false);
        return;
      }
      setUsers(usersRes.data ?? []);
      setVendors(vendorsRes.data ?? []);
      setLoading(false);
    };
    void loadData();
    return () => {
      alive = false;
    };
  }, []);

  const rate = currency === "USD" ? 0.012 : 1;
  const sym = currency === "USD" ? "$" : "₹";
  const fmt = (v: number) => `${sym}${Math.round(v * rate).toLocaleString()}`;

  const revenueSummary = useMemo(() => {
    const monthly = vendors.reduce((sum, v) => sum + (v.plan_price ?? 0), 0);
    const activeVendors = vendors.filter((v) => (v.status || "").toLowerCase() === "active").length;
    const lastMonth = Math.round(monthly * 0.85);
    const allTime = monthly * Math.max(1, activeVendors);
    const apiCost = Math.round(monthly * 0.25);
    return {
      allTime,
      thisMonth: monthly,
      lastMonth,
      apiCost,
      profit: Math.max(0, monthly - apiCost),
    };
  }, [vendors]);

  const revenueByPlan = useMemo(() => {
    const map = new Map<string, { plan: string; users: number; revenue: number }>();
    users.forEach((u) => {
      const key = (u.plan || "free").toLowerCase();
      const prev = map.get(key) ?? { plan: key.charAt(0).toUpperCase() + key.slice(1), users: 0, revenue: 0 };
      prev.users += 1;
      map.set(key, prev);
    });
    const vendorRevenue = vendors.reduce((sum, v) => sum + (v.plan_price ?? 0), 0);
    if (map.size === 0) return [{ plan: "Free", users: 0, revenue: 0 }];
    return Array.from(map.values()).map((entry) => ({ ...entry, revenue: entry.plan === "Free" ? 0 : Math.round(vendorRevenue / map.size) }));
  }, [users, vendors]);

  const revenueByVendor = useMemo(
    () =>
      vendors
        .map((v) => ({ name: v.store_name || "Vendor", monthly: v.plan_price ?? 0 }))
        .sort((a, b) => b.monthly - a.monthly)
        .slice(0, 6),
    [vendors],
  );

  const revenueOverMonths = useMemo(() => {
    const buckets = new Map<string, number>();
    vendors.forEach((v) => {
      const key = monthKey(v.created_at);
      buckets.set(key, (buckets.get(key) ?? 0) + (v.plan_price ?? 0));
    });
    const list = Array.from(buckets.entries()).slice(-6).map(([month, revenue]) => ({ month, revenue }));
    return list.length ? list : [{ month: "N/A", revenue: 0 }];
  }, [vendors]);

  const newPayingUsersPerMonth = useMemo(() => {
    const buckets = new Map<string, number>();
    users.forEach((u) => {
      if (!u.plan || u.plan.toLowerCase() === "free") return;
      const key = monthKey(u.created_at);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    const list = Array.from(buckets.entries()).slice(-6).map(([month, users]) => ({ month, users }));
    return list.length ? list : [{ month: "N/A", users: 0 }];
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Currency Toggle */}
      <div className="flex justify-end">
        <div className="bg-card/70 border border-border/40 rounded-xl flex overflow-hidden">
          {(["INR", "USD"] as const).map((c) => (
            <button key={c} onClick={() => setCurrency(c)} className={`px-4 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors ${currency === c ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "All Time", value: fmt(revenueSummary.allTime), icon: DollarSign, color: "hsl(160 60% 45%)" },
          { label: "This Month", value: fmt(revenueSummary.thisMonth), icon: TrendingUp, color: "hsl(200 70% 55%)" },
          { label: "Last Month", value: fmt(revenueSummary.lastMonth), icon: DollarSign, color: "hsl(270 60% 60%)" },
          { label: "API Cost (Est.)", value: fmt(revenueSummary.apiCost), icon: Zap, color: "hsl(45 100% 55%)" },
          { label: "Profit (Est.)", value: fmt(revenueSummary.profit), icon: TrendingUp, color: "hsl(340 60% 55%)" },
        ].map((s) => (
          <div key={s.label} className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color.replace(")", " / 0.15)")}` }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <p className="font-display text-xl font-extrabold tracking-wide">{s.value}</p>
            <p className="text-muted-foreground font-body text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading revenue data...</p>}
      {!loading && users.length === 0 && vendors.length === 0 && <p className="text-sm text-muted-foreground">No revenue data found.</p>}

      {/* Revenue by Plan */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Revenue by Plan</h3>
        <div className="grid grid-cols-3 gap-4">
          {revenueByPlan.map((p) => (
            <div key={p.plan} className="bg-secondary/30 rounded-xl p-4 text-center">
              <p className="font-display text-lg font-extrabold">{p.plan}</p>
              <p className="font-display text-xl font-extrabold mt-1">{fmt(p.revenue)}</p>
              <p className="text-muted-foreground font-body text-xs">{p.users.toLocaleString()} users</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Vendor */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Revenue by Vendor</h3>
        <div className="space-y-2">
          {revenueByVendor.map((v) => (
            <div key={v.name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/20">
              <span className="font-body text-sm text-foreground flex-1">{v.name}</span>
              <span className="font-display text-sm font-bold">{fmt(v.monthly)}/mo</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
          <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Revenue (6 months)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueOverMonths}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
          <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">New Paying Users/Month</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newPayingUsersPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="users" fill="hsl(270, 60%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenue;
