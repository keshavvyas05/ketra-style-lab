import { useState } from "react";
import { Search, Download, ChevronRight, Plus, X } from "lucide-react";
import { allUsers } from "@/data/adminMockData";

const PlanBadge = ({ plan }: { plan: string }) => {
  const c: Record<string, string> = {
    Free: "bg-secondary text-muted-foreground",
    Basic: "bg-[hsl(200_70%_50%_/_0.15)] text-[hsl(200_70%_50%)]",
    Pro: "bg-[hsl(340_60%_55%_/_0.15)] text-[hsl(340_60%_55%)]",
    Premium: "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]",
  };
  return <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${c[plan] || c.Free}`}>{plan}</span>;
};

const StatusDot = ({ status }: { status: string }) => (
  <span className={`w-2 h-2 rounded-full inline-block ${status === "active" ? "bg-[hsl(160_60%_45%)]" : "bg-[hsl(0_60%_55%)]"}`} />
);

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || u.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const selected = selectedUser ? allUsers.find((u) => u.id === selectedUser) : null;

  return (
    <div className="space-y-4">
      {/* Detail Panel */}
      {selected && (
        <div className="bg-card/70 backdrop-blur-sm border border-accent/30 rounded-2xl p-6 relative">
          <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <span className="font-display text-xl font-bold">{selected.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold">{selected.name}</h3>
              <p className="font-body text-sm text-muted-foreground">{selected.email} · {selected.instagram}</p>
            </div>
            <PlanBadge plan={selected.plan} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Try-ons Used</p>
              <p className="font-display text-xl font-extrabold">{selected.tryOnsUsed}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Remaining</p>
              <p className="font-display text-xl font-extrabold">{selected.tryOnsRemaining === 999 ? "∞" : selected.tryOnsRemaining}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Member Since</p>
              <p className="font-display text-sm font-extrabold">{selected.memberSince}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Status</p>
              <p className="font-display text-sm font-extrabold flex items-center justify-center gap-1.5"><StatusDot status={selected.status} /> {selected.status}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Plus size={12} /> Add Try-ons
            </button>
            <button className="px-4 py-2 rounded-xl bg-destructive/15 text-destructive font-display text-xs tracking-[0.1em] uppercase hover:bg-destructive/25 transition-colors">
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-card/70 border border-border/40 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full" />
        </div>
        <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="bg-card/70 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none">
          <option value="all">All Plans</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Premium">Premium</option>
        </select>
        <button className="px-4 py-2.5 rounded-xl bg-secondary border border-border/40 font-display text-xs tracking-[0.1em] uppercase text-foreground hover:bg-secondary/80 flex items-center gap-1.5">
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                {["User", "Email", "Plan", "Remaining", "Used", "Instagram", "Since", "Status", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-3 font-display text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedUser(u.id)}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <span className="font-display text-[10px] font-bold">{u.name.charAt(0)}</span>
                      </div>
                      <span className="font-display text-sm font-bold">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-body text-sm text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-3"><PlanBadge plan={u.plan} /></td>
                  <td className="py-3 px-3 font-display text-sm font-bold">{u.tryOnsRemaining === 999 ? "∞" : u.tryOnsRemaining}</td>
                  <td className="py-3 px-3 font-display text-sm text-muted-foreground">{u.tryOnsUsed}</td>
                  <td className="py-3 px-3 font-body text-xs text-muted-foreground">{u.instagram}</td>
                  <td className="py-3 px-3 font-body text-xs text-muted-foreground">{u.memberSince}</td>
                  <td className="py-3 px-3"><StatusDot status={u.status} /></td>
                  <td className="py-3 px-3"><ChevronRight size={14} className="text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
