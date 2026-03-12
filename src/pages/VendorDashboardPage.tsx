import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Code, Palette, CreditCard, BarChart3,
  HelpCircle, LogOut, Menu, X, ChevronRight
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Package, label: "Catalog", id: "catalog" },
  { icon: Code, label: "Embed Widget", id: "widget" },
  { icon: Palette, label: "Branding", id: "branding" },
  { icon: CreditCard, label: "Billing", id: "billing" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: HelpCircle, label: "Support", id: "support" },
];

const statCards = [
  { label: "Try-Ons This Month", value: "1,247", change: "+12%" },
  { label: "Customers Served", value: "892", change: "+8%" },
  { label: "Most Popular Product", value: "Silk Blazer", change: "" },
  { label: "Pool Remaining", value: "3,753", change: "" },
];

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <p className="font-body text-sm font-medium text-foreground">Fab Fashion Co.</p>
              <p className="font-body text-xs text-muted-foreground">fabstore.ketra.fashion</p>
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
            onClick={() => navigate("/")}
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
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-xl glass hover:neon-border transition-all duration-300"
                  >
                    <p className="text-muted-foreground font-body text-xs uppercase tracking-wider">{stat.label}</p>
                    <p className="font-display text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                    {stat.change && <span className="text-green-400 font-body text-xs mt-1 block">{stat.change}</span>}
                  </motion.div>
                ))}
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

          {activeTab !== "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                {(() => {
                  const item = navItems.find(n => n.id === activeTab);
                  const Icon = item?.icon || LayoutDashboard;
                  return <Icon size={28} className="text-muted-foreground" />;
                })()}
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-2 capitalize">{activeTab}</h3>
              <p className="text-muted-foreground font-body text-sm">This section is coming soon. We're building it just for you.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardPage;
