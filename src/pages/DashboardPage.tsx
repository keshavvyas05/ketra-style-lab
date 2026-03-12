import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Camera as CameraIcon, MessageCircle, Shirt, Trophy, ArrowUpRight, Gift, Crown, Zap, Sparkles, ChevronRight, X, ImagePlus, Edit2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import featureTryonNeutral from "@/assets/feature-tryon-neutral.jpg";
import featureStylistNeutral from "@/assets/feature-stylist-neutral.jpg";
import featureOotwNeutral from "@/assets/feature-ootw-neutral.jpg";
import newjeansCardBg from "@/assets/newjeans-card-ref.png";

const user = {
  name: "Amira",
  photo: null,
  instagram: "@amira.style",
  plan: "Free" as "Free" | "Basic" | "Pro" | "Premium",
  tryOnsRemaining: 2,
  tryOnsTotal: 3,
};

const featureButtons = [
  { icon: CameraIcon, label: "VTO", href: "/virtual-tryon", color: "hsl(340 60% 55%)" },
  { icon: Shirt, label: "OOTW", href: "/ootw", color: "hsl(45 100% 55%)" },
  { icon: ClipboardList, label: "Survey", href: "/style-survey", color: "hsl(160 60% 45%)" },
  { icon: Trophy, label: "Leaderboard", href: "/ootw", color: "hsl(270 60% 60%)" },
  { icon: MessageCircle, label: "AI", href: "/ai-stylist", color: "hsl(200 70% 55%)" },
];

const recentTryOns = [
  { id: 1, image: featureTryonNeutral, outfit: "Urban Layered Look", date: "2 hours ago" },
  { id: 2, image: featureStylistNeutral, outfit: "Minimal Street Fit", date: "Yesterday" },
  { id: 3, image: featureOotwNeutral, outfit: "Clean Edge Set", date: "3 days ago" },
];

const planBadge: Record<string, { icon: typeof Zap; gradient: string }> = {
  Free: { icon: Zap, gradient: "from-[hsl(0_0%_40%)] to-[hsl(0_0%_25%)]" },
  Basic: { icon: Sparkles, gradient: "from-[hsl(200_70%_50%)] to-[hsl(200_60%_35%)]" },
  Pro: { icon: Crown, gradient: "from-[hsl(340_60%_55%)] to-[hsl(340_50%_40%)]" },
  Premium: { icon: Crown, gradient: "from-[hsl(45_100%_55%)] to-[hsl(35_100%_40%)]" },
};

const DashboardPage = () => {
  const [promoCode, setPromoCode] = useState("");
  const [profileEdit, setProfileEdit] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: user.name,
    bio: "Fashion lover & street style enthusiast ✨",
    instagram: user.instagram,
    gender: "",
    age: "",
  });

  const surveyData = useMemo(() => {
    try {
      const raw = localStorage.getItem("ketra-style-survey");
      if (raw) return JSON.parse(raw) as { gender: string; age: string; bodyType: string; skinTone: string; clothingStyles: string[] };
    } catch {}
    return null;
  }, []);

  // Initialize profile gender/age from survey on first load
  useState(() => {
    if (surveyData) {
      setProfile(p => ({ ...p, gender: surveyData.gender || "", age: surveyData.age || "" }));
    }
  });

  const PlanIcon = planBadge[user.plan].icon;
  const tryOnPercent = (user.tryOnsRemaining / user.tryOnsTotal) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-12">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ROW 1: Welcome+Promo (left) + Profile Card (right) */}
          <div className="grid md:grid-cols-[1fr_auto] gap-6">
            {/* LEFT: Welcome + Promo */}
            <div className="space-y-6">
              {/* Welcome Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-6"
              >
                <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide">
                  Hi, <span className="gradient-text italic">{profile.name}</span>!
                </h1>
                <p className="text-muted-foreground font-serif text-sm mt-1 italic">
                  Welcome back to Ketra. What would you like to explore today?
                </p>

                {/* Try-ons remaining */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground font-serif text-xs tracking-widest uppercase">Try-ons remaining</span>
                    <span className="font-serif text-sm font-bold text-foreground">
                      {user.tryOnsRemaining}/{user.tryOnsTotal}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tryOnPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-[hsl(340_80%_65%)]"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {Array.from({ length: user.tryOnsTotal }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i < user.tryOnsRemaining ? "bg-accent" : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Current Plan */}
                <div className="mt-4 pt-4 flex items-center justify-between border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${planBadge[user.plan].gradient} flex items-center justify-center`}>
                      <PlanIcon size={16} className="text-background" />
                    </div>
                    <div>
                      <span className="text-muted-foreground font-serif text-[10px] tracking-widest uppercase block leading-none">Plan</span>
                      <span className="font-serif text-lg font-bold">{user.plan}</span>
                    </div>
                  </div>
                  {user.plan === "Free" && (
                    <Link to="/plans">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="py-2 px-5 rounded-xl bg-accent text-accent-foreground font-serif text-xs tracking-[0.12em] uppercase flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                      >
                        Upgrade <ArrowUpRight size={12} />
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Promo Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Gift size={16} className="text-accent" />
                  <h2 className="font-serif text-lg font-bold tracking-wide italic">Promo Code</h2>
                </div>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code here"
                    className="flex-1 bg-secondary/40 border border-border/40 rounded-xl px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-serif text-xs tracking-[0.1em] uppercase hover:opacity-90 transition-opacity shrink-0"
                  >
                    Apply
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: NewJeans-Style Profile Card (coded) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:w-[380px]"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: "3px solid hsl(260 40% 75%)", background: "hsl(200 60% 88%)" }}>
                {/* Title bar */}
                <div className="flex items-center justify-between px-3 py-2" style={{ background: "linear-gradient(135deg, hsl(260 50% 78%), hsl(200 50% 82%))" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: "hsl(0 70% 65%)" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "hsl(45 90% 60%)" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "hsl(140 60% 50%)" }} />
                    </div>
                    <span className="font-display text-sm tracking-[0.15em] uppercase font-extrabold" style={{ color: "hsl(260 40% 30%)" }}>
                      {profile.name.toUpperCase()}
                    </span>
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full text-[9px] font-display font-bold tracking-wider uppercase" style={{ background: "hsl(45 90% 60%)", color: "hsl(0 0% 20%)" }}>
                    ✦ LOOKING FOR ATTENTION !!!
                  </div>
                </div>

                {/* Hearts row */}
                <div className="text-center text-[10px] py-0.5 select-none" style={{ color: "hsl(300 50% 65%)", background: "hsl(260 40% 82%)" }}>
                  {"♡ ".repeat(20).trim()}
                </div>

                {/* URL bar */}
                <div className="mx-3 mt-2 px-3 py-1.5 rounded-full flex items-center gap-2" style={{ background: "white", border: "1.5px solid hsl(260 35% 78%)" }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: "hsl(260 40% 75%)" }} />
                  <span className="font-body text-[10px] truncate" style={{ color: "hsl(0 0% 45%)" }}>
                    https://www.ketra.style/{profile.name.toLowerCase()}
                  </span>
                </div>

                {/* Main content area */}
                <div className="mx-3 mt-3 mb-3 p-3 rounded-lg relative" style={{ background: "hsl(200 55% 92%)", border: "2px dashed hsl(260 35% 78%)" }}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Profile photo */}
                    <div className="shrink-0 relative group mx-auto sm:mx-0" style={{ width: "100px", height: "120px" }}>
                      <div className="w-full h-full rounded-md overflow-hidden" style={{ border: "2px solid hsl(260 40% 75%)", background: "linear-gradient(135deg, hsl(280 35% 88%), hsl(340 35% 88%))" }}>
                        {profilePic ? (
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-4xl font-bold" style={{ color: "hsl(280 45% 55%)" }}>{profile.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      {profileEdit && (
                        <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-white/60 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer rounded-md">
                          <ImagePlus size={20} style={{ color: "hsl(280 45% 45%)" }} />
                        </button>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setProfilePic(URL.createObjectURL(file)); }} />
                    </div>

                    {/* Info fields */}
                    <div className="flex-1 space-y-3 pt-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-display text-[10px] tracking-[0.12em] uppercase font-bold text-white shrink-0" style={{ background: "hsl(0 0% 15%)" }}>NAME</span>
                        {profileEdit ? (
                          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-white rounded px-2 py-1 font-display text-sm font-bold focus:outline-none w-full min-w-0" style={{ border: "1.5px solid hsl(260 40% 75%)", color: "hsl(0 0% 20%)" }} />
                        ) : (
                          <span className="font-display text-sm font-bold tracking-wide truncate" style={{ color: "hsl(0 0% 20%)" }}>{profile.name.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-display text-[10px] tracking-[0.12em] uppercase font-bold text-white shrink-0" style={{ background: "hsl(0 0% 15%)" }}>GENDER</span>
                        {profileEdit ? (
                          <input value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} placeholder="e.g. Male" className="bg-white rounded px-2 py-1 font-display text-sm font-bold focus:outline-none w-full min-w-0" style={{ border: "1.5px solid hsl(260 40% 75%)", color: "hsl(0 0% 20%)" }} />
                        ) : (
                          <span className="font-display text-sm font-bold tracking-wide truncate" style={{ color: "hsl(0 0% 20%)" }}>{(profile.gender || surveyData?.gender || "N/A").toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-display text-[10px] tracking-[0.12em] uppercase font-bold text-white shrink-0" style={{ background: "hsl(0 0% 15%)" }}>AGE</span>
                        {profileEdit ? (
                          <input value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="e.g. 22" className="bg-white rounded px-2 py-1 font-display text-sm font-bold focus:outline-none w-full min-w-0" style={{ border: "1.5px solid hsl(260 40% 75%)", color: "hsl(0 0% 20%)" }} />
                        ) : (
                          <span className="font-display text-sm font-bold tracking-wide truncate" style={{ color: "hsl(0 0% 20%)" }}>{(profile.age || surveyData?.age || "N/A").toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit button */}
                  <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-3 sm:right-3 flex justify-end">
                    {profileEdit ? (
                      <div className="flex gap-1.5">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setProfileEdit(false)} className="px-3 py-1 rounded font-display text-[9px] tracking-[0.1em] uppercase font-bold text-white" style={{ background: "hsl(260 45% 55%)" }}>Save</motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setProfileEdit(false)} className="px-3 py-1 rounded font-display text-[9px] tracking-[0.1em] uppercase" style={{ background: "white", border: "1px solid hsl(260 40% 75%)", color: "hsl(0 0% 35%)" }}>Cancel</motion.button>
                      </div>
                    ) : (
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setProfileEdit(true)} className="px-3 py-1.5 rounded font-display text-[9px] tracking-[0.1em] uppercase flex items-center gap-1.5 font-bold" style={{ background: "white", border: "1.5px solid hsl(260 40% 75%)", color: "hsl(0 0% 35%)", boxShadow: "2px 2px 0 hsl(260 35% 78%)" }}>
                        <Edit2 size={10} /> EDIT
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Bottom loading bar */}
                <div className="px-3 pb-2 flex items-center gap-2">
                  <span className="font-body text-[9px]" style={{ color: "hsl(260 30% 45%)" }}>Loading...</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(260 30% 80%)" }}>
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="h-full rounded-full"
                      style={{ background: "hsl(260 45% 60%)" }}
                    />
                  </div>
                </div>

                {/* Binary bottom bar */}
                <div className="text-center text-[8px] py-1 select-none overflow-hidden whitespace-nowrap" style={{ color: "hsl(260 25% 55%)", background: "hsl(260 40% 82%)" }}>
                  {"0 ".repeat(40).trim()}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ROW 2: Feature Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-3 md:grid-cols-5 gap-3"
          >
            {featureButtons.map(({ icon: Icon, label, href, color }) => (
              <Link key={label} to={href}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5 text-center cursor-pointer hover:border-border transition-all duration-300 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${color.replace(")", " / 0.15)")}` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <span className="font-serif text-sm font-bold tracking-wide">{label}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* ROW 3: Recent Try-Ons (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold tracking-wide italic">Recent Try-Ons</h2>
              <Link to="/virtual-tryon" className="text-accent font-body text-xs hover:underline flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentTryOns.map(({ id, image, outfit, date }) => (
                <div key={id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group cursor-pointer">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-border/30 shrink-0">
                    <img src={image} alt={outfit} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-foreground truncate italic">{outfit}</h4>
                    <p className="text-muted-foreground font-body text-xs italic">{date}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DashboardPage;
