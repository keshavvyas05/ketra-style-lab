import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, Bell, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const typeBadgeColors: Record<string, string> = {
  welcome: "bg-[hsl(200_70%_55%_/_0.15)] text-[hsl(200_70%_55%)]",
  approval: "bg-[hsl(270_60%_60%_/_0.15)] text-[hsl(270_60%_60%)]",
  winner: "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]",
  warning: "bg-[hsl(340_60%_55%_/_0.15)] text-[hsl(340_60%_55%)]",
  alert: "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]",
  payment: "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]",
  "pool-warning": "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]",
};

type NotificationRow = Tables<"notifications">;

const AdminNotifications = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [logs, setLogs] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("notifications").select("*");
      if (!alive) return;
      if (error) {
        console.error("Failed to load notifications", error);
        setLogs([]);
      } else {
        setLogs(data ?? []);
      }
      setLoading(false);
    };
    void loadLogs();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => logs.filter((n) => {
    const matchType = filterType === "all" || n.type === filterType;
    const matchChannel = filterChannel === "all" || n.channel === filterChannel;
    return matchType && matchChannel;
  }), [logs, filterType, filterChannel]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-card/70 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none">
          <option value="all">All Types</option>
          <option value="welcome">Welcome</option>
          <option value="approval">Approval</option>
          <option value="winner">Winner</option>
          <option value="warning">Warning</option>
          <option value="payment">Payment</option>
          <option value="alert">Alert</option>
        </select>
        <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)} className="bg-card/70 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none">
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                {["Recipient", "To", "Type", "Channel", "Status", "Time", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-3 font-display text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3 font-display text-sm font-bold">{n.recipient_id || "Unknown"}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-secondary font-display text-[9px] tracking-[0.1em] uppercase">{n.recipient_type || "user"}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-display text-[9px] tracking-[0.1em] uppercase font-bold ${typeBadgeColors[n.type || ""] || "bg-secondary text-muted-foreground"}`}>
                      {n.type || "notice"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                      {n.channel === "email" ? <Mail size={12} /> : <MessageCircle size={12} />}
                      {n.channel || "email"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${n.status === "sent" ? "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]" : "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]"}`}>
                      {n.status || "queued"}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-body text-xs text-muted-foreground">{n.created_at ? new Date(n.created_at).toLocaleString() : "—"}</td>
                  <td className="py-3 px-3">
                    {n.status === "failed" && (
                      <button className="p-1.5 rounded-lg bg-accent/15 hover:bg-accent/25 transition-colors" title="Resend">
                        <RotateCcw size={12} className="text-accent" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-4 text-sm text-muted-foreground">Loading notifications...</div>}
          {!loading && filtered.length === 0 && <div className="p-4 text-sm text-muted-foreground">No notifications found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
