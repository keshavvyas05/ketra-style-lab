import { useState } from "react";
import { motion } from "framer-motion";
import SuccessPopup from "@/components/SuccessPopup";
import { Check, Zap, Medal, Shield, Crown, Shirt, Vote, Upload, Bot, Calendar, Infinity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free",
    price: "0",
    icon: Zap,
    desc: "Perfect for trying out KETRA for the first time and exploring virtual try-on.",
    features: [
      { text: "2 Virtual Try-Ons / month", icon: Shirt },
      { text: "Vote in OOTW", icon: Vote },
      { text: "3 uploads in OOTW", icon: Upload },
      { text: "Basic AI Stylist", icon: Bot },
    ],
    cta: "Get Started",
    popular: false,
    gradient: "from-secondary to-secondary/60",
    iconBg: "bg-secondary",
    iconColor: "text-foreground",
  },
  {
    name: "Bronze",
    price: "199",
    icon: Medal,
    desc: "Great for experimenting with more outfits and discovering your style.",
    features: [
      { text: "12 Virtual Try-Ons", icon: Shirt },
      { text: "2 months OOTW uploads", icon: Calendar },
      { text: "Improved AI Stylist", icon: Bot },
    ],
    cta: "Upgrade",
    popular: false,
    gradient: "from-[hsl(30_50%_40%)] to-[hsl(30_40%_30%)]",
    iconBg: "bg-[hsl(30_50%_40%_/_0.15)]",
    iconColor: "text-[hsl(30_50%_55%)]",
  },
  {
    name: "Silver",
    price: "499",
    icon: Shield,
    desc: "Ideal for users who love trying new looks and want better styling recommendations.",
    features: [
      { text: "30 Virtual Try-Ons", icon: Shirt },
      { text: "Full OOTW access", icon: Vote },
      { text: "Advanced AI Stylist", icon: Bot },
    ],
    cta: "Upgrade",
    popular: true,
    gradient: "from-accent to-accent/70",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    name: "Gold",
    price: "1,499",
    icon: Crown,
    desc: "The ultimate KETRA experience for the most powerful styling tools.",
    features: [
      { text: "Unlimited Virtual Try-Ons", icon: Infinity },
      { text: "Unlimited OOTW uploads & voting", icon: Vote },
      { text: "Fully personalized AI Stylist", icon: Bot },
    ],
    cta: "Upgrade",
    popular: false,
    gradient: "from-[hsl(45_80%_50%)] to-[hsl(35_70%_40%)]",
    iconBg: "bg-[hsl(45_80%_50%_/_0.12)]",
    iconColor: "text-[hsl(45_80%_55%)]",
  },
];

const PlansPage = () => {
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-[0.04em] uppercase mb-4">
              Pick Your <span className="gradient-text">Vibe</span>
            </h1>
            <p className="text-muted-foreground font-body text-base sm:text-lg max-w-md mx-auto">
              Unlock the full KETRA experience. Upgrade anytime, cancel whenever. 💅
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {plans.map(({ name, price, icon: Icon, desc, features, cta, popular, iconBg, iconColor }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative group rounded-2xl p-6 border backdrop-blur-sm transition-shadow duration-300 ${
                  popular
                    ? "bg-card/90 border-accent/40 shadow-[0_0_40px_hsl(340_60%_55%_/_0.12)]"
                    : "bg-card/60 border-border/40 hover:border-border/70"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground font-display text-[11px] tracking-[0.2em] uppercase whitespace-nowrap">
                    Most Popular 🔥
                  </div>
                )}

                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>

                <h3 className="font-display text-2xl font-bold tracking-wide mb-1">{name}</h3>
                <p className="text-muted-foreground font-body text-xs leading-relaxed mb-5 min-h-[40px]">{desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl font-extrabold">₹{price}</span>
                  <span className="text-muted-foreground font-body text-xs">/month</span>
                </div>

                <ul className="space-y-2.5 mb-7">
                  {features.map(({ text, icon: FIcon }) => (
                    <li key={text} className="flex items-start gap-2.5">
                      <FIcon size={14} className={`shrink-0 mt-0.5 ${popular ? "text-accent" : "text-muted-foreground"}`} />
                      <span className="text-foreground font-body text-sm leading-snug">{text}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { if (name !== "Free") setShowPaymentPopup(true); }}
                  className={`w-full py-3 rounded-xl font-display text-sm tracking-[0.15em] uppercase transition-all duration-200 ${
                    popular
                      ? "bg-accent text-accent-foreground hover:shadow-[0_4px_20px_hsl(340_60%_55%_/_0.3)]"
                      : "bg-secondary text-foreground border border-border/50 hover:bg-secondary/80"
                  }`}
                >
                  {cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SuccessPopup open={showPaymentPopup} onClose={() => setShowPaymentPopup(false)} variant="payment-success" />
      <Footer />
    </div>
  );
};

export default PlansPage;
