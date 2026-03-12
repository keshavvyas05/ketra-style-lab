import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

type PopupVariant = "outfit-submitted" | "payment-success" | "credits-exhausted";

interface SuccessPopupProps {
  open: boolean;
  onClose: () => void;
  variant: PopupVariant;
}

const config: Record<PopupVariant, {
  icon: typeof CheckCircle;
  iconColor: string;
  iconGlow: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
}> = {
  "outfit-submitted": {
    icon: CheckCircle,
    iconColor: "hsl(120 50% 55%)",
    iconGlow: "hsl(120 50% 55% / 0.3)",
    title: "Outfit Submitted! 🎉",
    subtitle: "Your outfit has been submitted successfully. Get ready to be featured in next week's drop!",
  },
  "payment-success": {
    icon: CreditCard,
    iconColor: "hsl(45 100% 55%)",
    iconGlow: "hsl(45 100% 55% / 0.3)",
    title: "Payment Successful! 🎊",
    subtitle: "Welcome to the club! Your subscription is now active. Enjoy unlimited access to all features.",
  },
  "credits-exhausted": {
    icon: AlertTriangle,
    iconColor: "hsl(340 60% 55%)",
    iconGlow: "hsl(340 60% 55% / 0.3)",
    title: "Oops! Free Credits Used Up 😢",
    subtitle: "You've used all your free virtual try-ons. Subscribe to a plan for unlimited access and more styling features!",
    cta: { label: "View Plans", href: "/plans" },
  },
};

const SuccessPopup = ({ open, onClose, variant }: SuccessPopupProps) => {
  const { icon: Icon, iconColor, iconGlow, title, subtitle, cta } = config[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-card p-8 text-center shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15, damping: 12 }}
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: `${iconColor.replace(")", " / 0.15)")}`, boxShadow: `0 0 40px ${iconGlow}` }}
            >
              <Icon size={30} style={{ color: iconColor }} />
            </motion.div>

            {/* Confetti dots */}
            {variant !== "credits-exhausted" && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -20, x: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-(20 + Math.random() * 30), 60 + Math.random() * 80],
                      x: (Math.random() - 0.5) * 60,
                    }}
                    transition={{ duration: 1.2 + Math.random() * 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                    className="absolute rounded-full"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: "10%",
                      width: 4 + Math.random() * 4,
                      height: 4 + Math.random() * 4,
                      background: [
                        "hsl(340 60% 55%)",
                        "hsl(45 100% 55%)",
                        "hsl(200 70% 55%)",
                        "hsl(120 50% 55%)",
                        "hsl(270 60% 60%)",
                      ][i % 5],
                    }}
                  />
                ))}
              </div>
            )}

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl font-extrabold tracking-wide mb-3"
            >
              {title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground font-body text-sm leading-relaxed mb-6"
            >
              {subtitle}
            </motion.p>

            {/* CTA or Close button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {cta ? (
                <div className="flex flex-col gap-2">
                  <Link to={cta.href} onClick={onClose}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                    >
                      {cta.label}
                    </motion.button>
                  </Link>
                  <button
                    onClick={onClose}
                    className="py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                >
                  Got it!
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessPopup;
