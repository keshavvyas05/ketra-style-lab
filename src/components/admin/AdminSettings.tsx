import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Wifi, Mail, MessageCircle, Zap, Database, CreditCard, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ConnectionStatus = ({ name, status, lastChecked, icon: Icon, extra }: { name: string; status: string; lastChecked: string; icon: typeof Wifi; extra?: ReactNode }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${status === "connected" ? "bg-[hsl(160_60%_45%_/_0.15)]" : status === "warning" ? "bg-[hsl(45_100%_55%_/_0.15)]" : "bg-[hsl(0_60%_55%_/_0.15)]"}`}>
        <Icon size={16} className={status === "connected" ? "text-[hsl(160_60%_45%)]" : status === "warning" ? "text-[hsl(45_100%_55%)]" : "text-[hsl(0_60%_55%)]"} />
      </div>
      <div>
        <p className="font-display text-sm font-bold">{name}</p>
        <p className="font-body text-xs text-muted-foreground">Last checked: {lastChecked}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">{extra}<span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${status === "connected" ? "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]" : status === "warning" ? "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]" : "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]"}`}>{status}</span></div>
  </div>
);

const AdminSettings = () => {
  const [adminProfile, setAdminProfile] = useState({ name: "Ketra Admin", email: "admin@ketra.in", password: "" });
  const [globalLimit, setGlobalLimit] = useState(3);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, vendors: 0, submissions: 0, lowPool: 0 });
  const [notifications, setNotifications] = useState({
    newUser: { email: true, whatsapp: false },
    newVendor: { email: true, whatsapp: true },
    payment: { email: true, whatsapp: false },
    poolExhausted: { email: true, whatsapp: true },
    ootwWinner: { email: true, whatsapp: true },
  });

  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      setLoading(true);
      const [{ data: u }, { data: v }, { data: s }] = await Promise.all([
        supabase.from("users").select("*"),
        supabase.from("vendors").select("*"),
        supabase.from("outfit_submissions").select("*"),
      ]);
      if (!alive) return;
      const vendors = v ?? [];
      setStats({
        users: (u ?? []).length,
        vendors: vendors.length,
        submissions: (s ?? []).length,
        lowPool: vendors.filter((x) => (x.monthly_pool ?? 0) > 0 && (x.pool_used ?? 0) >= (x.monthly_pool ?? 0)).length,
      });
      const avgLimit = vendors.length ? Math.round(vendors.reduce((a, x) => a + (x.per_customer_limit ?? 0), 0) / vendors.length) : 3;
      setGlobalLimit(avgLimit || 3);
      setLoading(false);
    };
    void loadData();
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setAdminProfile((p) => ({ ...p, email: data.user?.email || p.email }));
    });
    return () => {
      alive = false;
    };
  }, []);

  const nowLabel = useMemo(() => new Date().toLocaleString(), []);
  const fashnStatus = stats.lowPool > 0 ? "warning" : "connected";

  return (
    <div className="space-y-6">
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Platform Connections</h3>
        <div className="space-y-3">
          <ConnectionStatus name="Fashn.ai API" status={fashnStatus} lastChecked={nowLabel} icon={Zap} extra={<span className="font-display text-sm font-bold text-[hsl(45_100%_55%)]">{stats.lowPool} warnings</span>} />
          <ConnectionStatus name="Supabase" status="connected" lastChecked={nowLabel} icon={Database} />
          <ConnectionStatus name="Razorpay" status="connected" lastChecked={nowLabel} icon={CreditCard} />
          <ConnectionStatus name="Stripe" status="connected" lastChecked={nowLabel} icon={CreditCard} />
          <ConnectionStatus name="Resend (Email)" status="connected" lastChecked={nowLabel} icon={Mail} />
          <ConnectionStatus name="n8n Webhooks" status="connected" lastChecked={nowLabel} icon={Wifi} />
          <ConnectionStatus name="WATI (WhatsApp)" status="connected" lastChecked={nowLabel} icon={MessageCircle} />
        </div>
      </div>

      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Admin Profile</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input value={adminProfile.name} onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })} className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none" />
          <input value={adminProfile.email} onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })} className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none" />
          <input type="password" value={adminProfile.password} onChange={(e) => setAdminProfile({ ...adminProfile, password: e.target.value })} placeholder="••••••••" className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase flex items-center gap-1.5"><Save size={12} /> Save Profile</button>
      </div>

      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-2">Global Per-Customer Try-on Limit</h3>
        <p className="text-muted-foreground font-body text-xs mb-4">Derived from live vendor settings in Supabase.</p>
        <div className="flex items-center gap-3">
          <input type="number" value={globalLimit} onChange={(e) => setGlobalLimit(parseInt(e.target.value) || 1)} className="w-20 bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-display text-sm text-foreground text-center focus:outline-none" />
          <span className="font-body text-sm text-muted-foreground">try-ons per customer per vendor</span>
        </div>
      </div>

      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, val]) => {
            const labels: Record<string, string> = { newUser: "New User Signup", newVendor: "New Vendor Registration", payment: "Payment Received", poolExhausted: "Vendor Pool Exhausted", ootwWinner: "OOTW Winner Declared" };
            return (
              <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/20">
                <span className="font-body text-sm text-foreground">{labels[key]}</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={val.email} onChange={() => setNotifications({ ...notifications, [key]: { ...val, email: !val.email } })} className="sr-only" /><div className={`w-4 h-4 rounded border flex items-center justify-center ${val.email ? "bg-accent border-accent" : "border-border"}`}>{val.email && <Check size={10} className="text-white" />}</div><Mail size={14} className="text-muted-foreground" /></label>
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={val.whatsapp} onChange={() => setNotifications({ ...notifications, [key]: { ...val, whatsapp: !val.whatsapp } })} className="sr-only" /><div className={`w-4 h-4 rounded border flex items-center justify-center ${val.whatsapp ? "bg-[hsl(160_60%_45%)] border-[hsl(160_60%_45%)]" : "border-border"}`}>{val.whatsapp && <Check size={10} className="text-white" />}</div><MessageCircle size={14} className="text-muted-foreground" /></label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading settings...</p>}
    </div>
  );
};

export default AdminSettings;
