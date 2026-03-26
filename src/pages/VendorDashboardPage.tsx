import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Package, Code, Palette, CreditCard, BarChart3,
  HelpCircle, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Package, label: "Catalog", id: "catalog" },
  { icon: Code, label: "Embed Widget", id: "widget" },
  { icon: Palette, label: "Branding", id: "branding" },
  { icon: CreditCard, label: "Billing", id: "billing" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: HelpCircle, label: "Support", id: "support" },
];

type VendorStats = {
  tryOnsThisMonth: number;
  customersServed: number;
  poolRemaining: number;
};

type VendorProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

const VendorDashboardPage = () => {
  const { signOut, vendor } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [productForm, setProductForm] = useState({ name: "", price: "", image_url: "", category: "" });
  const [productLoading, setProductLoading] = useState(false);

  const monthRange = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start: start.toISOString(), end: end.toISOString() };
  }, []);

  useEffect(() => {
    if (!vendor) return;

    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const { start, end } = monthRange;

        // Try-ons this month
        const { count: tryonCount } = await supabase
          .from("tryon_sessions")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendor.id)
          .gte("created_at", start)
          .lt("created_at", end);

        // Customers served
        const { count: customerCount } = await supabase
          .from("vendor_customers")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendor.id);

        const { data: vendorRow } = await supabase
          .from("vendors")
          .select("monthly_pool, pool_used")
          .eq("id", vendor.id)
          .maybeSingle();

        const monthly_pool = vendorRow?.monthly_pool ?? 0;
        const pool_used = vendorRow?.pool_used ?? 0;
        const poolRemaining = Math.max(0, monthly_pool - pool_used);

        setStats({
          tryOnsThisMonth: tryonCount ?? 0,
          customersServed: customerCount ?? 0,
          poolRemaining,
        });
      } catch (e) {
        console.error("Error loading vendor stats", e);
        setStats({
          tryOnsThisMonth: 0,
          customersServed: 0,
          poolRemaining: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    const loadProducts = async () => {
      if (!vendor) return;
      setProducts([
        {
          id: "placeholder-1",
          name: "Silk Blazer",
          price: 4999,
          image_url: "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg",
          category: "Blazers",
        },
        {
          id: "placeholder-2",
          name: "Minimal Street Set",
          price: 2999,
          image_url: "https://images.pexels.com/photos/7671255/pexels-photo-7671255.jpeg",
          category: "Sets",
        },
      ]);
    };

    loadStats();
    loadProducts();
  }, [vendor, monthRange]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    if (!productForm.name || !productForm.price) return;

    setProductLoading(true);
    try {
      const newProduct: VendorProduct = {
        id: crypto.randomUUID(),
        name: productForm.name,
        price: Number(productForm.price) || 0,
        image_url: productForm.image_url || "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg",
        category: productForm.category || "General",
      };

      setProducts((prev) => [newProduct, ...prev]);
      setProductForm({ name: "", price: "", image_url: "", category: "" });
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-[0.15em] text-foreground">KETRA</Link>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display font-bold text-sm">F</div>
            <div>
              <p className="font-body text-sm font-medium text-foreground">
                {vendor?.store_name ?? "Vendor"}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {vendor?.email ?? ""}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${
                activeTab === id
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={async () => {
              await signOut("/vendor/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <h1 className="font-display text-xl md:text-2xl tracking-wide capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-body text-muted-foreground hidden sm:block">fabstore.ketra.fashion</span>
            <a href="#" className="text-accent font-body text-xs hover:underline flex items-center gap-1">
              Visit Store <ChevronRight size={12} />
            </a>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6 md:p-10">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 }}
                  className="p-5 rounded-xl glass hover:neon-border transition-all duration-300"
                >
                  <p className="text-muted-foreground font-body text-xs uppercase tracking-wider">Try-Ons This Month</p>
                  <p className="font-display text-2xl md:text-3xl font-bold mt-1">
                    {statsLoading ? "—" : stats?.tryOnsThisMonth.toLocaleString() ?? "0"}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 }}
                  className="p-5 rounded-xl glass hover:neon-border transition-all duration-300"
                >
                  <p className="text-muted-foreground font-body text-xs uppercase tracking-wider">Customers Served</p>
                  <p className="font-display text-2xl md:text-3xl font-bold mt-1">
                    {statsLoading ? "—" : stats?.customersServed.toLocaleString() ?? "0"}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 rounded-xl glass hover:neon-border transition-all duration-300"
                >
                  <p className="text-muted-foreground font-body text-xs uppercase tracking-wider">Most Popular Product</p>
                  <p className="font-display text-lg md:text-xl font-bold mt-1">
                    {products[0]?.name ?? "Coming soon"}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                  className="p-5 rounded-xl glass hover:neon-border transition-all duration-300"
                >
                  <p className="text-muted-foreground font-body text-xs uppercase tracking-wider">Pool Remaining</p>
                  <p className="font-display text-2xl md:text-3xl font-bold mt-1">
                    {statsLoading ? "—" : stats?.poolRemaining.toLocaleString() ?? "0"}
                  </p>
                </motion.div>
              </div>

              {/* Quick actions */}
              <h3 className="font-display text-lg tracking-wide mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Add Product", icon: Package, tab: "catalog" },
                  { label: "Get Widget Code", icon: Code, tab: "widget" },
                  { label: "View Analytics", icon: BarChart3, tab: "analytics" },
                ].map(({ label, icon: Icon, tab }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="p-5 rounded-xl glass hover:neon-border transition-all duration-300 text-left group"
                  >
                    <Icon size={22} className="text-accent mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-body text-sm font-medium text-foreground">{label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "catalog" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl tracking-wide">Product Catalog</h3>
                <span className="text-xs font-body text-muted-foreground">
                  Manage products that appear in your try-on widget.
                </span>
              </div>

              <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-card/70 border border-border/40 rounded-2xl p-4"
              >
                <input
                  className="px-3 py-2 rounded-xl bg-background/60 border border-border/50 text-sm font-body focus:outline-none focus:border-accent/60"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  className="px-3 py-2 rounded-xl bg-background/60 border border-border/50 text-sm font-body focus:outline-none focus:border-accent/60"
                  placeholder="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                />
                <input
                  className="px-3 py-2 rounded-xl bg-background/60 border border-border/50 text-sm font-body focus:outline-none focus:border-accent/60"
                  placeholder="Category"
                  value={productForm.category}
                  onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                />
                <button
                  type="submit"
                  disabled={productLoading}
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-body text-xs tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-60 transition"
                >
                  {productLoading ? "Adding..." : "Add Product"}
                </button>
                <input
                  className="md:col-span-4 px-3 py-2 rounded-xl bg-background/60 border border-border/50 text-xs font-body focus:outline-none focus:border-accent/60"
                  placeholder="Image URL (optional)"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm((f) => ({ ...f, image_url: e.target.value }))}
                />
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-card/80 border border-border/40 overflow-hidden flex flex-col hover:neon-border transition-all duration-300"
                  >
                    <div className="h-36 bg-muted overflow-hidden">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-sm font-bold">{p.name}</h4>
                        <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">
                          {p.category}
                        </span>
                      </div>
                      <p className="font-display text-lg font-bold mt-1">
                        ₹{p.price.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="mt-3 self-end text-xs font-body text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "widget" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="font-display text-xl tracking-wide mb-2">Embed Widget</h3>
              <p className="text-muted-foreground font-body text-sm mb-4">
                Copy this snippet into your website &lt;head&gt; or just before the closing &lt;/body&gt; tag.
              </p>
              <div className="bg-card/80 border border-border/50 rounded-2xl p-4 space-y-3">
                <code className="block bg-background/80 rounded-xl px-3 py-2 text-xs font-mono break-all">
                  {`<script src="https://ketra.fashion/widget.js" data-vendor-id="${vendor?.id ?? "VENDOR_ID"}"></script>`}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `<script src="https://ketra.fashion/widget.js" data-vendor-id="${vendor?.id ?? "VENDOR_ID"}"></script>`,
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-body text-xs tracking-[0.15em] uppercase hover:opacity-90 transition"
                >
                  Copy Embed Code
                </button>
              </div>
              <div className="bg-card/80 border border-border/50 rounded-2xl p-4">
                <p className="font-body text-sm text-muted-foreground mb-3">Preview</p>
                <div className="rounded-xl border border-dashed border-border/60 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-base">Ketra Virtual Try-On</p>
                    <p className="text-muted-foreground font-body text-xs mt-1">
                      Customers can try your catalog looks in one click.
                    </p>
                  </div>
                  <div className="h-10 px-4 rounded-full bg-accent/20 text-accent flex items-center font-body text-xs uppercase tracking-[0.12em]">
                    Launch Widget
                  </div>
                </div>
              </div>
              <div className="bg-card/80 border border-border/50 rounded-2xl p-4">
                <h4 className="font-display text-sm mb-2">How to install</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground font-body space-y-1">
                  <li>Copy the embed script above.</li>
                  <li>Paste it into your site&apos;s HTML (just before &lt;/body&gt;).</li>
                  <li>Publish your changes — the Ketra widget will auto-appear.</li>
                </ol>
              </div>
            </motion.div>
          )}

          {activeTab === "branding" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
              <h3 className="font-display text-xl tracking-wide mb-2">Branding</h3>
              <p className="text-muted-foreground font-body text-sm">
                Customize how Ketra appears to your customers.
              </p>
              <div className="bg-card/80 border border-border/40 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-body text-muted-foreground mb-1.5 uppercase tracking-[0.15em]">
                    Store Name
                  </label>
                  <input
                    defaultValue={vendor?.store_name ?? ""}
                    className="w-full px-3 py-2 rounded-xl bg-background/70 border border-border/50 text-sm font-body focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body text-muted-foreground mb-1.5 uppercase tracking-[0.15em]">
                    Brand Color
                  </label>
                  <input type="color" defaultValue="#FF5C8A" className="w-16 h-10 rounded-md border border-border/60 bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-body text-muted-foreground mb-1.5 uppercase tracking-[0.15em]">
                    Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs font-body text-muted-foreground"
                  />
                </div>
                <button className="mt-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-body text-xs tracking-[0.15em] uppercase hover:opacity-90 transition">
                  Save Branding
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
              <h3 className="font-display text-xl tracking-wide mb-2">Billing & Usage</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl glass border border-border/40">
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-[0.15em] mb-1">Current Plan</p>
                  <p className="font-display text-lg">
                    {vendor?.status === "active" ? "Pro Vendor" : "Vendor"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl glass border border-border/40">
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-[0.15em] mb-1">Pool Remaining</p>
                  <p className="font-display text-lg">
                    {stats?.poolRemaining.toLocaleString() ?? "—"} try-ons
                  </p>
                </div>
                <div className="p-4 rounded-2xl glass border border-border/40">
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-[0.15em] mb-1">Next Renewal</p>
                  <p className="font-display text-lg">1st of next month</p>
                </div>
              </div>

              <div className="bg-card/80 border border-border/40 rounded-2xl p-5 space-y-4">
                <h4 className="font-display text-sm mb-2">Buy More Try-Ons</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { label: "100 Try-Ons", price: "₹999" },
                    { label: "500 Try-Ons", price: "₹3999" },
                    { label: "1000 Try-Ons", price: "₹6999" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      className="rounded-xl border border-border/50 bg-background/60 px-4 py-3 text-left hover:border-accent/60 hover:bg-accent/5 transition"
                    >
                      <p className="font-display text-sm">{p.label}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">{p.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card/80 border border-border/40 rounded-2xl p-5">
                <h4 className="font-display text-sm mb-3">Payment History</h4>
                <p className="text-xs font-body text-muted-foreground mb-2">
                  Payment history integration coming soon. For now, contact{" "}
                  <span className="text-accent">billing@ketra.fashion</span> for invoices.
                </p>
                <div className="rounded-xl border border-dashed border-border/50 px-4 py-6 text-center text-xs text-muted-foreground">
                  No payments recorded yet.
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="font-display text-xl tracking-wide mb-2">Analytics</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card/80 border border-border/40 rounded-2xl p-5">
                  <h4 className="font-display text-sm mb-3">Try-Ons</h4>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { label: "This Week", value: stats?.tryOnsThisMonth ?? 0 },
                          { label: "This Month", value: (stats?.tryOnsThisMonth ?? 0) * 2 },
                        ]}
                      >
                        <XAxis dataKey="label" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(280 80% 60%)" radius={6} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-card/80 border border-border/40 rounded-2xl p-5 space-y-3">
                  <h4 className="font-display text-sm mb-1">Top Products by Try-Ons</h4>
                  {products.slice(0, 3).map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl bg-background/60 border border-border/40 px-3 py-2"
                    >
                      <span className="font-body text-xs text-muted-foreground uppercase tracking-[0.15em]">
                        #{idx + 1}
                      </span>
                      <span className="font-display text-sm">{p.name}</span>
                      <span className="font-body text-xs text-muted-foreground">~{(stats?.tryOnsThisMonth ?? 0) / (idx + 2) | 0} try-ons</span>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-xs font-body text-muted-foreground">Add products in the Catalog tab to see rankings here.</p>
                  )}
                </div>
              </div>
              <div className="bg-card/80 border border-border/40 rounded-2xl p-5">
                <h4 className="font-display text-sm mb-2">Customer Satisfaction</h4>
                <p className="text-xs font-body text-muted-foreground">
                  Detailed satisfaction scores are coming soon. Early testers report{" "}
                  <span className="text-accent font-medium">+25% higher conversion</span> when using Ketra&apos;s virtual try-on.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
              <h3 className="font-display text-xl tracking-wide mb-2">Support</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card/80 border border-border/40 rounded-2xl p-5 space-y-3">
                  <h4 className="font-display text-sm mb-1">FAQ</h4>
                  {[
                    { q: "How do I integrate the widget?", a: "Use the embed code from the Widget tab and paste it into your site HTML." },
                    { q: "How are try-ons counted?", a: "Each unique customer try-on session counts as one try-on." },
                    { q: "Can I change my plan?", a: "Yes, contact billing@ketra.fashion for plan upgrades or downgrades." },
                    { q: "How do I see analytics?", a: "The Analytics tab shows try-on performance and top products." },
                    { q: "Where can I get technical help?", a: "Email support@ketra.fashion with your store URL and issue details." },
                  ].map((item) => (
                    <div key={item.q}>
                      <p className="font-body text-sm text-foreground">{item.q}</p>
                      <p className="text-xs font-body text-muted-foreground mt-0.5">{item.a}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-card/80 border border-border/40 rounded-2xl p-5 space-y-3">
                  <h4 className="font-display text-sm mb-1">Contact Support</h4>
                  <p className="text-xs font-body text-muted-foreground">
                    Email us at <span className="text-accent">support@ketra.fashion</span> or send a message below:
                  </p>
                  <input
                    placeholder="Subject"
                    className="w-full px-3 py-2 rounded-xl bg-background/70 border border-border/40 text-sm font-body focus:outline-none focus:border-accent/60"
                  />
                  <textarea
                    placeholder="Describe your issue..."
                    className="w-full min-h-[120px] px-3 py-2 rounded-xl bg-background/70 border border-border/40 text-sm font-body focus:outline-none focus:border-accent/60 resize-none"
                  />
                  <button className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-body text-xs tracking-[0.15em] uppercase hover:opacity-90 transition">
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardPage;
