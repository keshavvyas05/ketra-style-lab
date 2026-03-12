import { useState } from "react";
import { Check, X, AlertTriangle, Wifi, Mail, MessageCircle, Zap, Database, CreditCard, Save } from "lucide-react";
import { platformSettings } from "@/data/adminMockData";

const ConnectionStatus = ({ name, status, lastChecked, icon: Icon, extra }: { name: string; status: string; lastChecked: string; icon: typeof Wifi; extra?: React.ReactNode }) => (
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
    <div className="flex items-center gap-3">
      {extra}
      <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${
        status === "connected" ? "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]"
        : status === "warning" ? "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]"
        : "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]"
      }`}>
        {status}
      </span>
    </div>
  </div>
);

const AdminSettings = () => {
  const [adminProfile, setAdminProfile] = useState({ name: "Ketra Admin", email: "admin@ketra.in", password: "" });
  const [globalLimit, setGlobalLimit] = useState(platformSettings.globalPerCustomerLimit);
  const [notifications, setNotifications] = useState({
    newUser: { email: true, whatsapp: false },
    newVendor: { email: true, whatsapp: true },
    payment: { email: true, whatsapp: false },
    poolExhausted: { email: true, whatsapp: true },
    ootwWinner: { email: true, whatsapp: true },
  });

  return (
    <div className="space-y-6">
      {/* Platform Connections */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Platform Connections</h3>
        <div className="space-y-3">
          <ConnectionStatus
            name="Fashn.ai API"
            status={platformSettings.fashnAI.status}
            lastChecked={platformSettings.fashnAI.lastChecked}
            icon={Zap}
            extra={<span className="font-display text-sm font-bold text-[hsl(45_100%_55%)]">₹{platformSettings.fashnAI.balance.toLocaleString()}</span>}
          />
          <ConnectionStatus name="Supabase" status={platformSettings.supabase.status} lastChecked={platformSettings.supabase.lastChecked} icon={Database} />
          <ConnectionStatus name="Razorpay" status={platformSettings.razorpay.status} lastChecked={platformSettings.razorpay.lastChecked} icon={CreditCard} />
          <ConnectionStatus name="Stripe" status={platformSettings.stripe.status} lastChecked={platformSettings.stripe.lastChecked} icon={CreditCard} />
          <ConnectionStatus name="Resend (Email)" status={platformSettings.resend.status} lastChecked={platformSettings.resend.lastChecked} icon={Mail} />
          <ConnectionStatus name="n8n Webhooks" status={platformSettings.n8n.status} lastChecked={platformSettings.n8n.lastChecked} icon={Wifi} />
          <ConnectionStatus name="WATI (WhatsApp)" status={platformSettings.wati.status} lastChecked={platformSettings.wati.lastChecked} icon={MessageCircle} />
        </div>
      </div>

      {/* Admin Profile */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Admin Profile</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="font-body text-[10px] text-muted-foreground block mb-1">Name</label>
            <input value={adminProfile.name} onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })} className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none" />
          </div>
          <div>
            <label className="font-body text-[10px] text-muted-foreground block mb-1">Email</label>
            <input value={adminProfile.email} onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })} className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none" />
          </div>
          <div>
            <label className="font-body text-[10px] text-muted-foreground block mb-1">New Password</label>
            <input type="password" value={adminProfile.password} onChange={(e) => setAdminProfile({ ...adminProfile, password: e.target.value })} placeholder="••••••••" className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase flex items-center gap-1.5">
          <Save size={12} /> Save Profile
        </button>
      </div>

      {/* Global Vendor Limit */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-2">Global Per-Customer Try-on Limit</h3>
        <p className="text-muted-foreground font-body text-xs mb-4">Applies to all vendor subdomains unless overridden per vendor.</p>
        <div className="flex items-center gap-3">
          <input type="number" value={globalLimit} onChange={(e) => setGlobalLimit(parseInt(e.target.value) || 1)} className="w-20 bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-display text-sm text-foreground text-center focus:outline-none" />
          <span className="font-body text-sm text-muted-foreground">try-ons per customer per vendor</span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, val]) => {
            const labels: Record<string, string> = { newUser: "New User Signup", newVendor: "New Vendor Registration", payment: "Payment Received", poolExhausted: "Vendor Pool Exhausted", ootwWinner: "OOTW Winner Declared" };
            return (
              <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/20">
                <span className="font-body text-sm text-foreground">{labels[key]}</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={val.email} onChange={() => setNotifications({ ...notifications, [key]: { ...val, email: !val.email } })} className="sr-only" />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${val.email ? "bg-accent border-accent" : "border-border"}`}>
                      {val.email && <Check size={10} className="text-white" />}
                    </div>
                    <Mail size={14} className="text-muted-foreground" />
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={val.whatsapp} onChange={() => setNotifications({ ...notifications, [key]: { ...val, whatsapp: !val.whatsapp } })} className="sr-only" />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${val.whatsapp ? "bg-[hsl(160_60%_45%)] border-[hsl(160_60%_45%)]" : "border-border"}`}>
                      {val.whatsapp && <Check size={10} className="text-white" />}
                    </div>
                    <MessageCircle size={14} className="text-muted-foreground" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
