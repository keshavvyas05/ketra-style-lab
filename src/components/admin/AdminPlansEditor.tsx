import { useEffect, useMemo, useState } from "react";
import { Edit2, Save, X, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type UserRow = Tables<"users">;
type VendorRow = Tables<"vendors">;

type PlanItem = { id: string; name: string; price: number; tryOns: number };
type VendorPlanItem = { id: string; name: string; price: number; pool: number };

const AdminPlansEditor = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [vPlans, setVPlans] = useState<VendorPlanItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [festivalMode, setFestivalMode] = useState(false);
  const [bonusTryOns, setBonusTryOns] = useState(5);
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
        console.error("Failed to load plans data", usersRes.error || vendorsRes.error);
        setUsers([]);
        setVendors([]);
      } else {
        const nextUsers = usersRes.data ?? [];
        const nextVendors = vendorsRes.data ?? [];
        setUsers(nextUsers);
        setVendors(nextVendors);

        const planMap = new Map<string, { count: number; tryOns: number }>();
        nextUsers.forEach((u) => {
          const key = (u.plan || "free").toLowerCase();
          const prev = planMap.get(key) ?? { count: 0, tryOns: 0 };
          prev.count += 1;
          prev.tryOns = Math.max(prev.tryOns, u.tryon_count ?? 0);
          planMap.set(key, prev);
        });
        setPlans(Array.from(planMap.entries()).map(([key, v]) => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          price: key === "free" ? 0 : v.count * 100,
          tryOns: v.tryOns || (key === "free" ? 2 : 30),
        })));

        const vendorPlanMap = new Map<string, VendorPlanItem>();
        nextVendors.forEach((v) => {
          const k = `${v.plan_price ?? 0}-${v.monthly_pool ?? 0}`;
          if (!vendorPlanMap.has(k)) {
            vendorPlanMap.set(k, {
              id: k,
              name: `Plan ${vendorPlanMap.size + 1}`,
              price: v.plan_price ?? 0,
              pool: v.monthly_pool ?? 0,
            });
          }
        });
        setVPlans(Array.from(vendorPlanMap.values()));
      }
      setLoading(false);
    };
    void loadData();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-5 border ${festivalMode ? "bg-[hsl(45_100%_55%_/_0.06)] border-[hsl(45_100%_55%_/_0.3)]" : "bg-card/70 border-border/40"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className={festivalMode ? "text-[hsl(45_100%_55%)]" : "text-muted-foreground"} />
            <div>
              <h3 className="font-display text-sm font-extrabold tracking-wide">Festival Mode</h3>
              <p className="text-muted-foreground font-body text-xs">Temporarily add bonus try-ons to all plans</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {festivalMode && (
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-muted-foreground">Bonus:</span>
                <input type="number" value={bonusTryOns} onChange={(e) => setBonusTryOns(parseInt(e.target.value) || 0)} className="w-16 bg-secondary/40 border border-border/40 rounded-lg px-2 py-1 font-display text-sm text-foreground text-center focus:outline-none" />
              </div>
            )}
            <button onClick={() => setFestivalMode(!festivalMode)} className={`relative w-12 h-6 rounded-full transition-colors ${festivalMode ? "bg-[hsl(45_100%_55%)]" : "bg-secondary"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${festivalMode ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Individual Plans</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display text-lg font-extrabold">{plan.name}</h4>
                <button onClick={() => setEditing(editing === plan.id ? null : plan.id)} className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  {editing === plan.id ? <X size={12} className="text-muted-foreground" /> : <Edit2 size={12} className="text-muted-foreground" />}
                </button>
              </div>
              {editing === plan.id ? (
                <div className="space-y-3">
                  <input type="number" value={plan.price} onChange={(e) => setPlans((p) => p.map((x) => x.id === plan.id ? { ...x, price: parseInt(e.target.value) || 0 } : x))} className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2 font-body text-sm text-foreground focus:outline-none" />
                  <input type="number" value={plan.tryOns} onChange={(e) => setPlans((p) => p.map((x) => x.id === plan.id ? { ...x, tryOns: parseInt(e.target.value) || 0 } : x))} className="w-full bg-secondary/40 border border-border/40 rounded-xl px-3 py-2 font-body text-sm text-foreground focus:outline-none" />
                  <button onClick={() => setEditing(null)} className="w-full py-2 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase flex items-center justify-center gap-1"><Save size={12} /> Save</button>
                </div>
              ) : (
                <div>
                  <p className="font-display text-3xl font-extrabold">{plan.price === 0 ? "Free" : `₹${plan.price}`}</p>
                  <p className="text-muted-foreground font-body text-sm mt-1">{plan.tryOns} try-ons{festivalMode ? ` (+${bonusTryOns})` : ""}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground font-body text-xs mt-3 flex items-center gap-1.5"><AlertTriangle size={12} /> Data is derived from current Supabase users/vendors.</p>
      </div>

      <div>
        <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Vendor Plans</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {vPlans.map((plan) => (
            <div key={plan.id} className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
              <h4 className="font-display text-lg font-extrabold mb-2">{plan.name}</h4>
              <p className="font-display text-2xl font-extrabold">₹{plan.price.toLocaleString()}</p>
              <p className="text-muted-foreground font-body text-sm mt-1">{plan.pool} pool try-ons</p>
            </div>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading plans...</p>}
      {!loading && plans.length === 0 && vPlans.length === 0 && <p className="text-sm text-muted-foreground">No plans data found.</p>}
    </div>
  );
};

export default AdminPlansEditor;
