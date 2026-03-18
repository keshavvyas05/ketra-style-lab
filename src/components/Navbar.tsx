import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ClipboardList, CreditCard, LogOut, Info } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Virtual Try-On", path: "/virtual-tryon" },
  { name: "AI Stylist", path: "/ai-stylist" },
  { name: "OOTW", path: "/ootw" },
];

const profileMenuItems = [
  { icon: User, label: "Profile", path: "/dashboard" },
  { icon: ClipboardList, label: "Survey", path: "/style-survey" },
  { icon: CreditCard, label: "Subscription", path: "/plans" },
  { icon: Info, label: "About", path: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { signOut, user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === "/";
  const isFeaturePage = ["/virtual-tryon", "/ai-stylist", "/ootw"].includes(location.pathname);
  const transparentNav = isHome || isFeaturePage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close profile menu on route change
  useEffect(() => {
    setProfileOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const navBg = !transparentNav || scrolled ? "glass" : "bg-transparent";
  const textBase = transparentNav && !scrolled ? "text-[hsl(0_0%_75%)]" : "text-muted-foreground";
  const textActive = transparentNav && !scrolled ? "text-white font-semibold" : "text-foreground font-semibold";
  const textHover = transparentNav && !scrolled ? "hover:text-white" : "hover:text-foreground";
  const logoColor = transparentNav && !scrolled ? "text-white" : "text-foreground";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className={`font-display text-2xl font-bold tracking-wider transition-colors duration-300 ${logoColor}`}>
          KETRA
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs font-body tracking-[0.15em] uppercase transition-colors duration-300 ${
                location.pathname === link.path
                  ? textActive
                  : `${textBase} ${textHover}`
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Sign Up CTA */}
          {!loading && !user && <Link
            to="/auth"
            className={`inline-block px-4 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs font-body font-semibold tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${
              transparentNav && !scrolled
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-accent/40 text-accent hover:bg-accent/10"
            }`}
          >
            Sign Up
          </Link>}
          {/* Hamburger menu (3 lines) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg transition-all duration-300 ${
                profileOpen
                  ? "bg-accent/15"
                  : "hover:bg-secondary/50"
              }`}
            >
              <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${
                profileOpen ? "rotate-45 translate-y-[7px] bg-accent" : logoColor === "text-white" ? "bg-white" : "bg-foreground"
              }`} />
              <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${
                profileOpen ? "opacity-0" : logoColor === "text-white" ? "bg-white" : "bg-foreground"
              }`} />
              <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${
                profileOpen ? "-rotate-45 -translate-y-[7px] bg-accent" : logoColor === "text-white" ? "bg-white" : "bg-foreground"
              }`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_hsl(0_0%_0%/0.4)]"
                >
                  <div className="py-2">
                    {profileMenuItems.map(({ icon: Icon, label, path }) => (
                      <Link
                        key={label}
                        to={path}
                        className="flex items-center gap-3 px-4 py-3 font-body text-sm text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Icon size={16} className="text-muted-foreground" />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-border/40 my-1" />
                    <button
                      className="flex items-center gap-3 px-4 py-3 w-full font-body text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={async () => {
                        setProfileOpen(false);
                        await signOut();
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
