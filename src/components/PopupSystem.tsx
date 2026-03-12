import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Lock, Loader2, Sparkles, CheckCircle, Calendar, Heart, Gift,
  AlertTriangle, Crown, XCircle, Frown, LogIn, AlertOctagon, Trash2,
  LogOut, Check, ArrowRight, Trophy
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── SHARED ─────────────────────────────────────────────────

const Backdrop = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-background/80 backdrop-blur-md"
    onClick={onClick}
  />
);

const Confetti = ({ count = 14 }: { count?: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -20, x: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [-(20 + Math.random() * 30), 80 + Math.random() * 100],
          x: (Math.random() - 0.5) * 80,
        }}
        transition={{ duration: 1.4 + Math.random() * 0.8, delay: 0.15 + i * 0.06, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: "5%",
          width: 4 + Math.random() * 5,
          height: 4 + Math.random() * 5,
          background: [
            "hsl(340 60% 55%)", "hsl(45 100% 55%)", "hsl(200 70% 55%)",
            "hsl(120 50% 55%)", "hsl(270 60% 60%)",
          ][i % 5],
        }}
      />
    ))}
  </div>
);

const LargeConfetti = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-[101]">
    {Array.from({ length: 40 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -50, x: 0, rotate: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [-(50 + Math.random() * 50), window.innerHeight + 50],
          x: (Math.random() - 0.5) * 300,
          rotate: Math.random() * 720 - 360,
        }}
        transition={{ duration: 2 + Math.random() * 1.5, delay: i * 0.04, ease: "easeOut" }}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: 0,
          width: 6 + Math.random() * 8,
          height: 6 + Math.random() * 8,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          background: [
            "hsl(340 60% 55%)", "hsl(45 100% 55%)", "hsl(200 70% 55%)",
            "hsl(120 50% 55%)", "hsl(270 60% 60%)", "hsl(15 80% 55%)",
          ][i % 6],
        }}
      />
    ))}
  </div>
);

const PopupShell = ({
  children,
  onClose,
  maxW = "max-w-sm",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxW?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    onClick={onClose}
  >
    <Backdrop onClick={onClose} />
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
      className={`relative w-full ${maxW} rounded-2xl border border-border/50 bg-card p-8 text-center shadow-2xl`}
    >
      {children}
    </motion.div>
  </motion.div>
);

const IconCircle = ({
  icon: Icon,
  color,
  glow,
  size = 30,
}: {
  icon: typeof Lock;
  color: string;
  glow: string;
  size?: number;
}) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", delay: 0.15, damping: 12 }}
    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
    style={{
      background: `${color.replace(")", " / 0.15)")}`,
      boxShadow: `0 0 40px ${glow}`,
    }}
  >
    <Icon size={size} style={{ color }} />
  </motion.div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="font-display text-2xl font-extrabold tracking-wide mb-2"
  >
    {children}
  </motion.h2>
);

const Subtitle = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="text-muted-foreground font-body text-sm leading-relaxed mb-6"
  >
    {children}
  </motion.p>
);

const PrimaryBtn = ({
  children,
  onClick,
  href,
  variant = "accent",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "accent" | "destructive";
}) => {
  const cls = `w-full py-3 rounded-xl font-display text-sm tracking-[0.12em] uppercase hover:opacity-90 transition-opacity ${
    variant === "destructive"
      ? "bg-destructive text-destructive-foreground"
      : "bg-accent text-accent-foreground"
  }`;
  if (href) {
    return (
      <Link to={href} onClick={onClick}>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className={cls}>
          {children}
        </motion.button>
      </Link>
    );
  }
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClick} className={cls}>
      {children}
    </motion.button>
  );
};

const SecondaryBtn = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full py-2.5 rounded-xl border border-border/50 text-muted-foreground font-display text-xs tracking-[0.1em] uppercase hover:text-foreground hover:border-border transition-colors mt-2"
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
    {children}
  </button>
);

const CloseX = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
    <X size={18} />
  </button>
);

// ─── COUNTDOWN HOOK ─────────────────────────────────────────

const useCountdownToMonday = () => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const day = now.getDay();
      const daysUntilMonday = day === 0 ? 1 : 8 - day;
      const next = new Date(now);
      next.setDate(now.getDate() + daysUntilMonday);
      next.setHours(0, 0, 0, 0);
      const diff = next.getTime() - now.getTime();
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    calc();
    const i = setInterval(calc, 60000);
    return () => clearInterval(i);
  }, []);
  return timeLeft;
};

// ─── 1. TRY-ONS EXHAUSTED ──────────────────────────────────

interface BaseProps {
  open: boolean;
  onClose: () => void;
}

export const TryOnsExhaustedPopup = ({ open, onClose }: BaseProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={Lock} color="hsl(340 60% 55%)" glow="hsl(340 60% 55% / 0.3)" />
        <Title>You've Used All Your Try-ons!</Title>
        <Subtitle>Upgrade your plan to unlock more virtual try-ons and keep exploring styles.</Subtitle>
        <PrimaryBtn href="/plans" onClick={onClose}>Upgrade Now</PrimaryBtn>
        <GhostBtn onClick={onClose}>Maybe later</GhostBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 2. AI LOADING OVERLAY ──────────────────────────────────

export const AILoadingOverlay = ({ open }: { open: boolean }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <Loader2 size={64} className="text-accent" />
          </motion.div>
          <h2 className="font-display text-2xl font-extrabold tracking-wide mb-2">Our AI is Styling You...</h2>
          <p className="text-muted-foreground font-body text-sm">This takes 10–30 seconds, please don't close</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                className="w-2 h-2 rounded-full bg-accent"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── 3. TRY-ON SUCCESS ─────────────────────────────────────

interface TryOnSuccessProps extends BaseProps {
  resultImage?: string;
  remaining: number;
  total: number;
  onTryAnother: () => void;
}

export const TryOnSuccessPopup = ({ open, onClose, resultImage, remaining, total, onTryAnother }: TryOnSuccessProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <Confetti />
        <CloseX onClick={onClose} />
        {resultImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-32 h-40 mx-auto mb-4 rounded-xl overflow-hidden border border-border/40"
          >
            <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
          </motion.div>
        )}
        <Title>Looking Amazing! ✨</Title>
        <Subtitle>Your virtual try-on is ready. Save it to your profile or try another outfit!</Subtitle>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-display text-sm font-bold text-foreground">{remaining}/{total}</span>
          <span className="text-muted-foreground font-body text-xs">try-ons remaining</span>
        </div>
        <PrimaryBtn onClick={onClose}>Save to Profile</PrimaryBtn>
        <SecondaryBtn onClick={onTryAnother}>Try Another Outfit</SecondaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 4. OUTFIT SUBMITTED ────────────────────────────────────

export const OutfitSubmittedPopup = ({ open, onClose }: BaseProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <Confetti count={18} />
        <CloseX onClick={onClose} />
        <IconCircle icon={CheckCircle} color="hsl(160 60% 45%)" glow="hsl(160 60% 45% / 0.3)" />
        <Title>Outfit Submitted Successfully!</Title>
        <Subtitle>Your outfit has been submitted for this week's vote. Good luck!</Subtitle>
        <PrimaryBtn href="/ootw" onClick={onClose}>View Leaderboard</PrimaryBtn>
        <GhostBtn onClick={onClose}>Close</GhostBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 5. ALREADY SUBMITTED ───────────────────────────────────

export const AlreadySubmittedPopup = ({ open, onClose }: BaseProps) => {
  const countdown = useCountdownToMonday();
  return (
    <AnimatePresence>
      {open && (
        <PopupShell onClose={onClose}>
          <CloseX onClick={onClose} />
          <IconCircle icon={Calendar} color="hsl(45 100% 55%)" glow="hsl(45 100% 55% / 0.3)" />
          <Title>Already Submitted This Week!</Title>
          <Subtitle>You can submit a new outfit when the week resets.</Subtitle>
          <div className="bg-secondary/50 rounded-xl py-3 px-4 mb-5">
            <span className="text-muted-foreground font-body text-xs tracking-widest uppercase">Resets in</span>
            <p className="font-display text-xl font-extrabold mt-1">{countdown}</p>
          </div>
          <PrimaryBtn href="/ootw" onClick={onClose}>View Leaderboard</PrimaryBtn>
        </PopupShell>
      )}
    </AnimatePresence>
  );
};

// ─── 6. VOTE CONFIRMATION ───────────────────────────────────

interface VoteConfirmProps extends BaseProps {
  outfitName: string;
}

export const VoteConfirmPopup = ({ open, onClose, outfitName }: VoteConfirmProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <Confetti count={10} />
        <CloseX onClick={onClose} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-[hsl(340_60%_55%_/_0.15)]"
          style={{ boxShadow: "0 0 40px hsl(340 60% 55% / 0.3)" }}
        >
          <Heart size={30} className="text-[hsl(340_60%_55%)] fill-[hsl(340_60%_55%)]" />
        </motion.div>
        <Title>Vote Cast Successfully!</Title>
        <Subtitle>You voted for "{outfitName}". Come back next week to vote again!</Subtitle>
        <PrimaryBtn onClick={onClose}>Got It</PrimaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 7. ALREADY VOTED ───────────────────────────────────────

export const AlreadyVotedPopup = ({ open, onClose }: BaseProps) => {
  const countdown = useCountdownToMonday();
  return (
    <AnimatePresence>
      {open && (
        <PopupShell onClose={onClose}>
          <CloseX onClick={onClose} />
          <IconCircle icon={Lock} color="hsl(270 60% 60%)" glow="hsl(270 60% 60% / 0.3)" />
          <Title>You Already Voted This Week!</Title>
          <Subtitle>Voting resets every Monday. Come back then!</Subtitle>
          <div className="bg-secondary/50 rounded-xl py-3 px-4 mb-5">
            <span className="text-muted-foreground font-body text-xs tracking-widest uppercase">Resets in</span>
            <p className="font-display text-xl font-extrabold mt-1">{countdown}</p>
          </div>
          <PrimaryBtn onClick={onClose}>Close</PrimaryBtn>
        </PopupShell>
      )}
    </AnimatePresence>
  );
};

// ─── 8. LOGIN REQUIRED ──────────────────────────────────────

export const LoginRequiredPopup = ({ open, onClose }: BaseProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.15, damping: 12 }}
          className="mx-auto mb-5"
        >
          <span className="font-display text-4xl font-extrabold tracking-[0.1em] gradient-text">KETRA</span>
        </motion.div>
        <Title>Login to Continue</Title>
        <Subtitle>Create a free account or log in to access this feature.</Subtitle>
        <div className="space-y-2">
          <PrimaryBtn href="/auth" onClick={onClose}>Sign Up Free</PrimaryBtn>
          <SecondaryBtn onClick={onClose}>Login</SecondaryBtn>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-border/50 font-body text-sm text-foreground hover:bg-secondary/50 transition-colors mt-2 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 9. PROMO CODE SUCCESS ──────────────────────────────────

interface PromoSuccessProps extends BaseProps {
  tryOnsAdded: number;
}

export const PromoCodeSuccessPopup = ({ open, onClose, tryOnsAdded }: PromoSuccessProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <Confetti count={16} />
        <CloseX onClick={onClose} />
        <IconCircle icon={Gift} color="hsl(160 60% 45%)" glow="hsl(160 60% 45% / 0.3)" />
        <Title>Promo Code Applied!</Title>
        <Subtitle>
          You've received <span className="text-foreground font-bold">{tryOnsAdded} extra try-ons</span>. Enjoy styling!
        </Subtitle>
        <PrimaryBtn href="/virtual-tryon" onClick={onClose}>Start Trying On</PrimaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 10. PROMO CODE INVALID ─────────────────────────────────

interface PromoInvalidProps extends BaseProps {
  errorMessage?: string;
}

export const PromoCodeInvalidPopup = ({ open, onClose, errorMessage }: PromoInvalidProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={XCircle} color="hsl(0 60% 55%)" glow="hsl(0 60% 55% / 0.3)" />
        <Title>Invalid Promo Code</Title>
        <Subtitle>{errorMessage || "The code you entered is invalid or has expired. Please check and try again."}</Subtitle>
        <PrimaryBtn onClick={onClose}>Try Again</PrimaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 11. PROMO CODE ALREADY USED ────────────────────────────

export const PromoCodeUsedPopup = ({ open, onClose }: BaseProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={AlertTriangle} color="hsl(45 100% 55%)" glow="hsl(45 100% 55% / 0.3)" />
        <Title>Code Already Used</Title>
        <Subtitle>This promo code has already been applied to your account.</Subtitle>
        <PrimaryBtn onClick={onClose}>Close</PrimaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 12. PAYMENT SUCCESS (FULL PAGE) ────────────────────────

interface PaymentSuccessProps extends BaseProps {
  planName: string;
  tryOnsAdded: number | "Unlimited";
  renewalDate: string;
}

export const PaymentSuccessFullPage = ({ open, onClose, planName, tryOnsAdded, renewalDate }: PaymentSuccessProps) => (
  <AnimatePresence>
    {open && (
      <>
        <LargeConfetti />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 18, stiffness: 250 }}
            className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card p-10 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, damping: 10 }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(45 100% 55% / 0.2), hsl(340 60% 55% / 0.2))",
                boxShadow: "0 0 60px hsl(45 100% 55% / 0.3)",
              }}
            >
              <Crown size={40} className="text-[hsl(45_100%_55%)]" />
            </motion.div>
            <Title>Welcome to Ketra!</Title>
            <div className="space-y-3 mb-8">
              <div className="bg-secondary/50 rounded-xl py-3 px-4">
                <span className="text-muted-foreground font-body text-[10px] tracking-widest uppercase block">Plan</span>
                <span className="font-display text-xl font-extrabold">{planName}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-xl py-3 px-4">
                  <span className="text-muted-foreground font-body text-[10px] tracking-widest uppercase block">Try-ons</span>
                  <span className="font-display text-lg font-extrabold">{tryOnsAdded === "Unlimited" ? "∞" : `+${tryOnsAdded}`}</span>
                </div>
                <div className="bg-secondary/50 rounded-xl py-3 px-4">
                  <span className="text-muted-foreground font-body text-[10px] tracking-widest uppercase block">Renewal</span>
                  <span className="font-display text-lg font-extrabold">{renewalDate}</span>
                </div>
              </div>
            </div>
            <PrimaryBtn href="/dashboard" onClick={onClose}>Start Exploring</PrimaryBtn>
          </motion.div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── 13. PAYMENT FAILED ─────────────────────────────────────

interface PaymentFailedProps extends BaseProps {
  onRetry: () => void;
}

export const PaymentFailedPopup = ({ open, onClose, onRetry }: PaymentFailedProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={XCircle} color="hsl(0 60% 55%)" glow="hsl(0 60% 55% / 0.3)" />
        <Title>Payment Failed</Title>
        <Subtitle>We couldn't process your payment. Please try again or contact support.</Subtitle>
        <PrimaryBtn onClick={onRetry}>Try Again</PrimaryBtn>
        <SecondaryBtn onClick={onClose}>Contact Support</SecondaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 14. VENDOR POOL EXHAUSTED ──────────────────────────────

export const VendorPoolExhaustedPopup = ({ open, onClose }: BaseProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={Frown} color="hsl(270 60% 60%)" glow="hsl(270 60% 60% / 0.3)" />
        <Title>Virtual Try-on Unavailable</Title>
        <Subtitle>This vendor's try-on pool has been exhausted. Visit Ketra for more options!</Subtitle>
        <PrimaryBtn href="/" onClick={onClose}>Visit ketra.in</PrimaryBtn>
        <GhostBtn onClick={onClose}>Close</GhostBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 15. VENDOR CUSTOMER TRY-ONS EXHAUSTED ──────────────────

export const VendorCustomerExhaustedPopup = ({ open, onClose }: BaseProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={Lock} color="hsl(340 60% 55%)" glow="hsl(340 60% 55% / 0.3)" />
        <Title>You've Used Your Free Try-ons Here!</Title>
        <Subtitle>Get a Ketra plan for unlimited virtual try-ons across all vendors.</Subtitle>
        <PrimaryBtn href="/plans" onClick={onClose}>See Ketra Plans</PrimaryBtn>
        <GhostBtn onClick={onClose}>Close</GhostBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 16. PROFILE UPDATE TOAST ───────────────────────────────

export const ProfileUpdateToast = ({ open }: { open: boolean }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
        className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-card border border-border/50 rounded-xl px-5 py-3 shadow-2xl"
      >
        <div className="w-6 h-6 rounded-full bg-[hsl(160_60%_45%_/_0.2)] flex items-center justify-center">
          <Check size={14} className="text-[hsl(160_60%_45%)]" />
        </div>
        <span className="font-body text-sm text-foreground">Profile updated successfully</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── 17. LOGOUT CONFIRMATION ────────────────────────────────

interface LogoutProps extends BaseProps {
  onLogout: () => void;
}

export const LogoutConfirmPopup = ({ open, onClose, onLogout }: LogoutProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <CloseX onClick={onClose} />
        <IconCircle icon={LogOut} color="hsl(0 0% 55%)" glow="hsl(0 0% 55% / 0.2)" />
        <Title>Are you sure you want to logout?</Title>
        <Subtitle>You'll need to sign in again to access your account.</Subtitle>
        <PrimaryBtn variant="destructive" onClick={onLogout}>Logout</PrimaryBtn>
        <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 18. DELETE ACCOUNT ─────────────────────────────────────

interface DeleteAccountProps extends BaseProps {
  onDelete: () => void;
}

export const DeleteAccountPopup = ({ open, onClose, onDelete }: DeleteAccountProps) => {
  const [confirmText, setConfirmText] = useState("");
  return (
    <AnimatePresence>
      {open && (
        <PopupShell onClose={onClose}>
          <CloseX onClick={onClose} />
          <IconCircle icon={AlertOctagon} color="hsl(0 60% 55%)" glow="hsl(0 60% 55% / 0.3)" />
          <Title>Delete Account</Title>
          <Subtitle>
            This action is <span className="text-destructive font-bold">permanent</span> and cannot be undone.
            All your data, try-ons, and preferences will be deleted forever.
          </Subtitle>
          <div className="mb-4">
            <label className="text-muted-foreground font-body text-xs block mb-2 text-left">
              Type <span className="text-foreground font-bold">DELETE</span> to confirm
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-secondary/40 border border-border/40 rounded-xl px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-destructive/50 transition-colors"
            />
          </div>
          <PrimaryBtn
            variant="destructive"
            onClick={() => {
              if (confirmText === "DELETE") {
                onDelete();
                onClose();
              }
            }}
          >
            Delete My Account
          </PrimaryBtn>
          <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
        </PopupShell>
      )}
    </AnimatePresence>
  );
};

// ─── 19. VENDOR TOP-UP SUCCESS ──────────────────────────────

interface VendorTopUpProps extends BaseProps {
  tryOnsAdded: number;
  poolBalance: number;
}

export const VendorTopUpSuccessPopup = ({ open, onClose, tryOnsAdded, poolBalance }: VendorTopUpProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <Confetti count={16} />
        <CloseX onClick={onClose} />
        <IconCircle icon={CheckCircle} color="hsl(160 60% 45%)" glow="hsl(160 60% 45% / 0.3)" />
        <Title>Pool Restored Successfully!</Title>
        <Subtitle>
          <span className="text-foreground font-bold">+{tryOnsAdded}</span> try-ons added to your pool.
        </Subtitle>
        <div className="bg-secondary/50 rounded-xl py-3 px-4 mb-5">
          <span className="text-muted-foreground font-body text-[10px] tracking-widest uppercase block">Updated Pool Balance</span>
          <span className="font-display text-2xl font-extrabold">{poolBalance.toLocaleString()}</span>
        </div>
        <PrimaryBtn onClick={onClose}>Got It</PrimaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);

// ─── 20. NEW WEEK POPUP ─────────────────────────────────────

interface NewWeekProps extends BaseProps {
  lastWinner: { name: string; outfit: string };
}

export const NewWeekPopup = ({ open, onClose, lastWinner }: NewWeekProps) => (
  <AnimatePresence>
    {open && (
      <PopupShell onClose={onClose}>
        <Confetti count={20} />
        <CloseX onClick={onClose} />
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.15, damping: 10 }}
          className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(45 100% 55% / 0.2), hsl(340 60% 55% / 0.2))",
            boxShadow: "0 0 40px hsl(45 100% 55% / 0.3)",
          }}
        >
          <Trophy size={30} className="text-[hsl(45_100%_55%)]" />
        </motion.div>
        <Title>New Week, New Winner! 🎉</Title>
        <div className="bg-secondary/50 rounded-xl py-3 px-4 mb-4">
          <span className="text-muted-foreground font-body text-[10px] tracking-widest uppercase block">Last Week's Winner</span>
          <span className="font-display text-lg font-extrabold block mt-1">{lastWinner.name}</span>
          <span className="text-muted-foreground font-body text-xs italic">{lastWinner.outfit}</span>
        </div>
        <Subtitle>Submit your outfit this week for a chance to win!</Subtitle>
        <PrimaryBtn onClick={onClose}>Submit My Outfit</PrimaryBtn>
      </PopupShell>
    )}
  </AnimatePresence>
);
