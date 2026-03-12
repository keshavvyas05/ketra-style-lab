import { Camera, Users, Activity, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminStats, tryOnSessions, tryOnSourceSplit, activeVendorsToday } from "@/data/adminMockData";

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

const AdminTryOnMonitor = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Try-ons Today" value={adminStats.totalTryOnsToday.toLocaleString()} icon={Camera} color="hsl(340 60% 55%)" />
      <StatCard label="This Month" value={adminStats.totalTryOnsMonth.toLocaleString()} icon={Activity} color="hsl(200 70% 55%)" />
      <StatCard label="Total Ever" value={adminStats.totalTryOnsEver.toLocaleString()} icon={TrendingUp} color="hsl(270 60% 60%)" />
      <StatCard label="Avg per User" value={adminStats.avgTryOnsPerUser.toString()} icon={Users} color="hsl(160 60% 45%)" />
    </div>

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
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(v.tryOns / activeVendorsToday[0].tryOns) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminTryOnMonitor;
