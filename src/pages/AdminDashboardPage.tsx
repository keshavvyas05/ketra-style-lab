import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Store, Camera, DollarSign, CreditCard, Gift, Bell, Trophy, Settings, LogOut, Menu, X, ChevronLeft
} from "lucide-react";

import AdminHome from "@/components/admin/AdminHome";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminVendors from "@/components/admin/AdminVendors";
import AdminTryOnMonitor from "@/components/admin/AdminTryOnMonitor";
import AdminRevenue from "@/components/admin/AdminRevenue";
import AdminOOTW from "@/components/admin/AdminOOTW";
import AdminPromoCodes from "@/components/admin/AdminPromoCodes";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminPlansEditor from "@/components/admin/AdminPlansEditor";
import AdminSettings from "@/components/admin/AdminSettings";

type Section = "home" | "users" | "vendors" | "tryon" | "revenue" | "ootw" | "promos" | "notifications" | "plans" | "settings";

const navItems: { key: Section; label: string; icon: typeof Users }[] = [
  { key: "home", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "vendors", label: "Vendors", icon: Store },
  { key: "tryon", label: "Try-on Monitor", icon: Camera },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "ootw", label: "OOTW Manager", icon: Trophy },
  { key: "promos", label: "Promo Codes", icon: Gift },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "plans", label: "Plans Editor", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

const sectionTitles: Record<Section, string> = {
  home: "Dashboard Home",
  users: "Users Management",
  vendors: "Vendors Management",
  tryon: "Try-on Monitor",
  revenue: "Revenue & Analytics",
  ootw: "Outfit of the Week",
  promos: "Promo Codes",
  notifications: "Notifications Log",
  plans: "Plans Editor",
  settings: "Settings",
};

const AdminDashboardPage = () => {
  const [active, setActive] = useState<Section>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "home": return <AdminHome />;
      case "users": return <AdminUsers />;
      case "vendors": return <AdminVendors />;
      case "tryon": return <AdminTryOnMonitor />;
      case "revenue": return <AdminRevenue />;
      case "ootw": return <AdminOOTW />;
      case "promos": return <AdminPromoCodes />;
      case "notifications": return <AdminNotifications />;
      case "plans": return <AdminPlansEditor />;
      case "settings": return <AdminSettings />;
      default: return <AdminHome />;
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-extrabold tracking-[0.15em] gradient-text">KETRA</span>
          {sidebarOpen && <span className="font-body text-[10px] text-muted-foreground tracking-widest uppercase">Admin</span>}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-1 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ChevronLeft size={16} className={`transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActive(key); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm tracking-wide transition-all duration-200 ${
              active === key
                ? "bg-accent/15 text-accent font-bold"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <Icon size={18} className="shrink-0" />
            {(sidebarOpen || mobileOpen) && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/30">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm tracking-wide text-muted-foreground hover:bg-[hsl(0_60%_55%_/_0.1)] hover:text-[hsl(0_60%_55%)] transition-colors">
          <LogOut size={18} className="shrink-0" />
          {(sidebarOpen || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 shrink-0 ${sidebarOpen ? "w-[240px]" : "w-[68px]"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} className="absolute left-0 top-0 bottom-0 w-[260px] bg-card border-r border-border/30 flex flex-col z-10">
            <SidebarContent />
          </motion.aside>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4 border-b border-border/30 bg-background/80 backdrop-blur-md">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground">
            <Menu size={20} />
          </button>
          <h1 className="font-display text-xl font-extrabold tracking-wide">{sectionTitles[active]}</h1>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
