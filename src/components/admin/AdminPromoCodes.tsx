import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type PromoCode = Tables<"promo_codes">;

const AdminPromoCodes = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", type: "free_tryons", value: "", maxUses: 100, expiry: "", active: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadCodes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("promo_codes").select("*");
      if (!alive) return;
      if (error) {
        console.error("Failed to load promo codes", error);
        setCodes([]);
      } else {
        setCodes(data ?? []);
      }
      setLoading(false);
    };
    void loadCodes();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => codes.filter((c) => {
    if (filter === "active") return Boolean(c.is_active);
    if (filter === "expired") return !c.is_active;
    return true;
  }), [codes, filter]);

  const totalRedemptions = codes.reduce((a, c) => a + (c.used_count ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5 text-center">
          <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Total Codes</p>
          <p className="font-display text-2xl font-extrabold">{codes.length}</p>
        </div>
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5 text-center">
          <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Total Redemptions</p>
          <p className="font-display text-2xl font-extrabold">{totalRedemptions}</p>
        </div>
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5 text-center">
          <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Active Codes</p>
          <p className="font-display text-2xl font-extrabold">{codes.filter((c) => c.is_active).length}</p>
        </div>
      </div>

      {showCreate && (
        <div className="bg-card/70 backdrop-blur-sm border border-accent/30 rounded-2xl p-6">
          <h3 className="font-display text-sm font-extrabold tracking-wide mb-4">Create New Code</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <input value={newCode.code} onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })} placeholder="Code name" className="bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            <select value={newCode.type} onChange={(e) => setNewCode({ ...newCode, type: e.target.value })} className="bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none">
              <option value="free_tryons">Free Try-ons</option>
              <option value="discount">Discount</option>
            </select>
            <input value={newCode.value} onChange={(e) => setNewCode({ ...newCode, value: e.target.value })} placeholder="Value" className="bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            <input type="number" value={newCode.maxUses} onChange={(e) => setNewCode({ ...newCode, maxUses: parseInt(e.target.value) || 0 })} placeholder="Max uses" className="bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none" />
            <input type="date" value={newCode.expiry} onChange={(e) => setNewCode({ ...newCode, expiry: e.target.value })} className="bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none" />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const { data, error } = await supabase
                    .from("promo_codes")
                    .insert({
                      code: newCode.code,
                      type: newCode.type,
                      value: Number(newCode.value) || 0,
                      max_uses: newCode.maxUses,
                      expiry_date: newCode.expiry || null,
                      is_active: newCode.active,
                      used_count: 0,
                    })
                    .select("*")
                    .single();
                  if (!error && data) setCodes((prev) => [data, ...prev]);
                  if (error) console.error("Failed to create promo code", error);
                  setShowCreate(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase"
              >
                Create
              </button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl border border-border/50 text-muted-foreground font-display text-xs tracking-[0.1em] uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-card/70 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none">
          <option value="all">All Codes</option>
          <option value="active">Active Only</option>
          <option value="expired">Expired Only</option>
        </select>
        <div className="flex-1" />
        <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase flex items-center gap-1.5">
          <Plus size={12} /> New Code
        </button>
      </div>

      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                {["Code", "Type", "Value", "Usage", "Expiry", "Status", "Created"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 font-display text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3"><span className="px-3 py-1 rounded-lg bg-accent/15 font-display text-sm font-bold tracking-[0.1em] text-accent">{c.code || "CODE"}</span></td>
                  <td className="py-3 px-3 font-body text-sm text-muted-foreground">{c.type || "—"}</td>
                  <td className="py-3 px-3 font-display text-sm font-bold">{c.value ?? 0}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs text-muted-foreground">{c.used_count ?? 0}/{c.max_uses ?? 0}</span>
                      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${((c.used_count ?? 0) / Math.max(1, c.max_uses ?? 1)) * 100}%` }} /></div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-body text-xs text-muted-foreground">{c.expiry_date || "—"}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={async () => {
                        const next = !c.is_active;
                        const { error } = await supabase.from("promo_codes").update({ is_active: next }).eq("id", c.id);
                        if (!error) setCodes((prev) => prev.map((p) => (p.id === c.id ? { ...p, is_active: next } : p)));
                      }}
                      className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold cursor-pointer ${c.is_active ? "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]" : "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]"}`}
                    >
                      {c.is_active ? "Active" : "Expired"}
                    </button>
                  </td>
                  <td className="py-3 px-3 font-body text-xs text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-4 text-sm text-muted-foreground">Loading promo codes...</div>}
          {!loading && filtered.length === 0 && <div className="p-4 text-sm text-muted-foreground">No promo codes found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPromoCodes;
