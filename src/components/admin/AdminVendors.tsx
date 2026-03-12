import { useState } from "react";
import { Search, Check, X, ChevronRight, Edit2 } from "lucide-react";
import { allVendors } from "@/data/adminMockData";

const StatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = {
    active: "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]",
    pending: "bg-[hsl(45_100%_55%_/_0.15)] text-[hsl(45_100%_45%)]",
    inactive: "bg-[hsl(0_60%_55%_/_0.15)] text-[hsl(0_60%_55%)]",
  };
  return <span className={`px-2.5 py-0.5 rounded-full font-display text-[10px] tracking-[0.1em] uppercase font-bold ${s[status] || s.active}`}>{status}</span>;
};

type Vendor = { id: number; name: string; country: string; flag: string; subdomain: string; poolSize: number; poolUsed: number; poolRemaining: number; perCustomerLimit: number; planPrice: number; currency: string; status: "active" | "pending" | "inactive"; registered: string; revenue: number };

const AdminVendors = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [vendorList, setVendorList] = useState<Vendor[]>(allVendors as Vendor[]);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

  const filtered = vendorList.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const selected = selectedVendor ? vendorList.find((v) => v.id === selectedVendor) : null;

  const updateStatus = (id: number, status: "active" | "pending" | "inactive") => {
    setVendorList((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  };

  return (
    <div className="space-y-4">
      {/* Detail Panel */}
      {selected && (
        <div className="bg-card/70 backdrop-blur-sm border border-accent/30 rounded-2xl p-6 relative">
          <button onClick={() => setSelectedVendor(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">{selected.flag}</span>
            <div>
              <h3 className="font-display text-lg font-extrabold">{selected.name}</h3>
              <p className="font-body text-sm text-muted-foreground">{selected.subdomain} · {selected.country}</p>
            </div>
            <StatusBadge status={selected.status} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Pool Size</p>
              <p className="font-display text-xl font-extrabold">{selected.poolSize}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Pool Used</p>
              <p className="font-display text-xl font-extrabold">{selected.poolUsed}</p>
              <div className="w-full h-1.5 rounded-full bg-secondary mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(selected.poolUsed / selected.poolSize) * 100}%` }} />
              </div>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Per Customer</p>
              <p className="font-display text-xl font-extrabold">{selected.perCustomerLimit}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Revenue</p>
              <p className="font-display text-xl font-extrabold">₹{selected.revenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {selected.status === "pending" && (
              <button onClick={() => updateStatus(selected.id, "active")} className="px-4 py-2 rounded-xl bg-[hsl(160_60%_45%)] text-white font-display text-xs tracking-[0.1em] uppercase flex items-center gap-1.5"><Check size={12} /> Approve</button>
            )}
            {selected.status !== "inactive" && (
              <button onClick={() => updateStatus(selected.id, "inactive")} className="px-4 py-2 rounded-xl bg-destructive/15 text-destructive font-display text-xs tracking-[0.1em] uppercase hover:bg-destructive/25 transition-colors">Deactivate</button>
            )}
            {selected.status === "inactive" && (
              <button onClick={() => updateStatus(selected.id, "active")} className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase">Reactivate</button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-card/70 border border-border/40 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors..." className="bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-card/70 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                {["Vendor", "Country", "Subdomain", "Pool", "Used", "Per Cust.", "Price", "Status", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-3 font-display text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedVendor(v.id)}>
                  <td className="py-3 px-3 font-display text-sm font-bold">{v.name}</td>
                  <td className="py-3 px-3 font-body text-sm">{v.flag} {v.country}</td>
                  <td className="py-3 px-3 font-body text-xs text-accent">{v.subdomain}</td>
                  <td className="py-3 px-3">
                    <div className="w-16">
                      <div className="flex justify-between mb-0.5">
                        <span className="font-display text-[10px]">{v.poolUsed}/{v.poolSize}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${v.poolRemaining === 0 ? "bg-[hsl(0_60%_55%)]" : "bg-accent"}`} style={{ width: `${(v.poolUsed / v.poolSize) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-display text-sm">{v.poolRemaining}</td>
                  <td className="py-3 px-3 font-display text-sm">{v.perCustomerLimit}</td>
                  <td className="py-3 px-3 font-body text-sm">₹{v.planPrice.toLocaleString()}</td>
                  <td className="py-3 px-3"><StatusBadge status={v.status} /></td>
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

export default AdminVendors;
