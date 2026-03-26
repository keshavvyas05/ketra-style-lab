import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Store, Camera, DollarSign, CreditCard, Gift, Bell, Trophy,
  TrendingUp, TrendingDown, ChevronRight, AlertTriangle, Zap, Activity
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  adminStats, recentSignups, recentVendorRegs, recentPayments,
  urgentAlerts, userGrowthData, dailyTryOnsData
} from "@/data/adminMockData";

const StatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = {
    active: "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]",
    pending: "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]",
    inactive: "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]",
    success: "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]",
    failed: "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]",
  };
  return <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${s[status] || s.active}`}>{status}</span>;
};

const PlanBadge = ({ plan }: { plan: string }) => {
  const c: Record<string, string> = {
    Free: "bg-secondary text-muted-foreground",
    Basic: "bg-[hsl(200_70%_50%_/_0.15)] text-[hsl(200_70%_50%)]",
    Pro: "bg-[hsl(340_60%_55%_/_0.15)] text-[hsl(340_60%_55%)]",
    Premium: "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]",
  };
  return <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${c[plan] || c.Free}`}>{plan}</span>;
};

const StatCard = ({ label, value, growth, icon: Icon, color }: { label: string; value: string; growth?: number; icon: typeof Users; color: string }) => (
  <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color.replace(")", " / 0.15)")}` }}>
        <Icon size={20} style={{ color }} />
      </div>
      {growth !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-body ${growth >= 0 ? "text-[hsl(160_60%_45%)]" : "text-[hsl(0_60%_55%)]"}`}>
          {growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(growth)}%
        </div>
      )}
    </div>
    <p className="font-display text-2xl font-extrabold tracking-wide">{value}</p>
    <p className="text-muted-foreground font-body text-xs mt-0.5">{label}</p>
  </div>
);

type ChartTooltipPayload = {
  value: number;
};

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
};

const ChartTooltipContent = ({ active, payload, label }: ChartTooltipContentProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="font-body text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-sm font-bold">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

const AdminHome = () => (
  <div className="space-y-6">
    {/* Urgent Alerts */}
    {urgentAlerts.length > 0 && (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="space-y-2">
          {urgentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                alert.type === "critical"
                  ? "bg-[hsl(0_60%_55%_/_0.08)] border-[hsl(0_60%_55%_/_0.3)]"
                  : "bg-[hsl(45_100%_55%_/_0.06)] border-[hsl(45_100%_55%_/_0.3)]"
              }`}
            >
              <AlertTriangle size={16} className={alert.type === "critical" ? "text-[hsl(0_60%_55%)]" : "text-[hsl(45_100%_55%)]"} />
              <span className="font-body text-sm text-foreground flex-1">{alert.message}</span>
              <span className={`font-display text-[10px] tracking-[0.1em] uppercase font-bold ${
                alert.type === "critical" ? "text-[hsl(0_60%_55%)]" : "text-[hsl(45_100%_55%)]"
              }`}>{alert.type}</span>
            </div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard label="Total Users" value={adminStats.totalUsers.toLocaleString()} growth={adminStats.usersGrowth} icon={Users} color="hsl(200 70% 55%)" />
      <StatCard label="Total Vendors" value={`${adminStats.totalVendors.active + adminStats.totalVendors.pending + adminStats.totalVendors.inactive}`} icon={Store} color="hsl(270 60% 60%)" />
      <StatCard label="Try-ons Today" value={adminStats.totalTryOnsToday.toLocaleString()} icon={Camera} color="hsl(340 60% 55%)" />
      <StatCard label="Revenue (Month)" value={`₹${adminStats.revenueThisMonth.toLocaleString()}`} growth={adminStats.revenueGrowth} icon={DollarSign} color="hsl(160 60% 45%)" />
      <StatCard label="Try-ons Remaining" value={adminStats.platformTryOnsRemaining.toLocaleString()} icon={Zap} color="hsl(45 100% 55%)" />
      <StatCard label="Active Promos" value={`${adminStats.activePromoCodes}`} icon={Gift} color="hsl(200 70% 55%)" />
    </div>

    {/* 3 Recent Lists */}
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Recent Signups */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Recent Signups</h3>
        <div className="space-y-3">
          {recentSignups.map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="font-display text-xs font-bold">{u.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">{u.name}</p>
                <p className="font-body text-[11px] text-muted-foreground truncate">{u.email}</p>
              </div>
              <PlanBadge plan={u.plan} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Vendor Registrations */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Recent Vendors</h3>
        <div className="space-y-3">
          {recentVendorRegs.map((v) => (
            <div key={v.id} className="flex items-center gap-3">
              <span className="text-lg">{v.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">{v.name}</p>
                <p className="font-body text-[11px] text-muted-foreground">{v.country}</p>
              </div>
              <StatusBadge status={v.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Recent Payments</h3>
        <div className="space-y-3">
          {recentPayments.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <DollarSign size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">{p.user}</p>
                <p className="font-body text-[11px] text-muted-foreground">₹{p.amount} · {p.plan}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Charts */}
    <div className="grid lg:grid-cols-2 gap-4">
      {/* User Growth */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">User Growth (30 days)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="users" stroke="hsl(340, 60%, 55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Try-ons */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Daily Try-ons (7 days)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTryOnsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="tryOns" fill="hsl(200, 70%, 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

export default AdminHome;
