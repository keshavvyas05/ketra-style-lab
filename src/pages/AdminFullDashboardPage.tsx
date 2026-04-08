import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Bell,
  CreditCard,
  Gift,
  Home,
  Settings,
  Store,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import AdminHome from "@/components/admin/AdminHome";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminVendors from "@/components/admin/AdminVendors";
import AdminRevenue from "@/components/admin/AdminRevenue";
import AdminOOTW from "@/components/admin/AdminOOTW";
import AdminPlansEditor from "@/components/admin/AdminPlansEditor";
import AdminPromoCodes from "@/components/admin/AdminPromoCodes";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminTryOnMonitor from "@/components/admin/AdminTryOnMonitor";
import AdminSettings from "@/components/admin/AdminSettings";

type TabKey =
  | "home"
  | "users"
  | "vendors"
  | "revenue"
  | "ootw"
  | "plans"
  | "promos"
  | "notifications"
  | "tryons"
  | "settings";

type TabDef = {
  key: TabKey;
  label: string;
  icon: typeof Home;
};

const tabs: TabDef[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "users", label: "Users", icon: Users },
  { key: "vendors", label: "Vendors", icon: Store },
  { key: "revenue", label: "Revenue", icon: Wallet },
  { key: "ootw", label: "OOTW", icon: Trophy },
  { key: "plans", label: "Plans", icon: CreditCard },
  { key: "promos", label: "Promo Codes", icon: Gift },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "tryons", label: "Try-On Monitor", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings },
];

const AdminFullDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const content = useMemo(() => {
    switch (activeTab) {
      case "home":
        return <AdminHome />;
      case "users":
        return <AdminUsers />;
      case "vendors":
        return <AdminVendors />;
      case "revenue":
        return <AdminRevenue />;
      case "ootw":
        return <AdminOOTW />;
      case "plans":
        return <AdminPlansEditor />;
      case "promos":
        return <AdminPromoCodes />;
      case "notifications":
        return <AdminNotifications />;
      case "tryons":
        return <AdminTryOnMonitor />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminHome />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.15em] uppercase">Ketra Admin</p>
            <p className="text-xs text-muted-foreground">Full Dashboard</p>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Back to site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs md:text-sm transition-colors ${
                activeTab === key
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {content}
      </div>
    </div>
  );
};

export default AdminFullDashboardPage;
