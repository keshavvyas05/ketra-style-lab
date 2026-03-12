import { useState } from "react";
import SuccessPopup from "@/components/SuccessPopup";
import { motion } from "framer-motion";
import FeaturePageLayout from "@/components/FeaturePageLayout";
import { Heart, Upload, ThumbsUp, Crown, Trophy, Medal } from "lucide-react";
import bgImage from "@/assets/feature-ootw-bg.jpg";
import featureOotwNeutral from "@/assets/feature-ootw-neutral.jpg";
import featureStylistNeutral from "@/assets/feature-stylist-neutral.jpg";
import featureTryonNeutral from "@/assets/feature-tryon-neutral.jpg";
import mascotJumping from "@/assets/mascot-jumping.png";
import mascotSitting from "@/assets/mascot-sitting.png";

const Glitter = ({ x, y, delay, size = 8 }: { x: number; y: number; delay: number; size?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0.5, 1, 0], scale: [0.3, 1.3, 0.7, 1.1, 0.3] }}
    transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeInOut" as const }}
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size,
      background: "radial-gradient(circle, hsl(50 100% 78%), hsl(45 100% 60%))",
      boxShadow: `0 0 ${size * 3}px hsl(45 100% 65% / 0.8), 0 0 ${size * 5}px hsl(180 80% 65% / 0.4)`,
    }}
  />
);

const TrailSparkle = ({ x, y, appearAt }: { x: number; y: number; appearAt: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0.7, 0], scale: [0, 1.3, 0.9, 0] }}
    transition={{ duration: 1.0, delay: appearAt, ease: "easeOut" as const }}
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: 6, height: 6,
      background: "radial-gradient(circle, hsl(50 100% 82%), hsl(45 100% 58%))",
      boxShadow: "0 0 16px hsl(45 100% 68% / 0.9), 0 0 30px hsl(180 80% 65% / 0.5)",
    }}
  />
);

const BurstParticle = ({ angle }: { angle: number }) => {
  const dist = 30 + Math.random() * 25;
  const size = 4 + Math.random() * 5;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="absolute rounded-full pointer-events-none"
      style={{ left: "50%", top: "50%", width: size, height: size,
        background: "radial-gradient(circle, hsl(50 100% 82%), hsl(180 80% 70%))",
        boxShadow: `0 0 ${size * 3}px hsl(45 100% 68% / 0.9)`,
      }}
    />
  );
};

// Right-to-left flight path
const mascotX = [500, 420, 340, 240, 140, 40, -30, -70, -90, -100];
const mascotY = [0, -30, -60, -70, -65, -50, -35, -45, -55, -60];
const FLIGHT_DURATION = 1;
const FLIGHT_DELAY = 0.25;

const trailPoints: { x: number; y: number; appearAt: number }[] = [];
for (let i = 0; i < mascotX.length - 1; i++) {
  const t = FLIGHT_DELAY + (i / (mascotX.length - 1)) * FLIGHT_DURATION;
  trailPoints.push({ x: mascotX[i] + 12, y: mascotY[i] + 12, appearAt: t });
  trailPoints.push({
    x: (mascotX[i] + mascotX[i + 1]) / 2 + 12 + (Math.random() - 0.5) * 10,
    y: (mascotY[i] + mascotY[i + 1]) / 2 + 12 + (Math.random() - 0.5) * 10,
    appearAt: t + (FLIGHT_DURATION / (mascotX.length - 1)) * 0.5,
  });
}

const burstAngles = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);

const steps = [
  { step: "01", title: "Browse Drops", desc: "Check out the latest weekly outfit drops curated by AI." },
  { step: "02", title: "Vote & Save", desc: "Like your favorites and save them to your wardrobe." },
  { step: "03", title: "Upload Yours", desc: "Submit your own outfit and get featured." },
];

const feedOutfits = [
  { id: 1, image: featureOotwNeutral, title: "Street Minimal", votes: 342 },
  { id: 2, image: featureStylistNeutral, title: "Urban Layer", votes: 518 },
  { id: 3, image: featureTryonNeutral, title: "Clean Edge", votes: 275 },
  { id: 4, image: featureOotwNeutral, title: "Soft Structure", votes: 189 },
];

const leaderboard = [
  { rank: 1, name: "Amira K.", handle: "@amira.style", likes: 2847, image: featureStylistNeutral },
  { rank: 2, name: "Zain R.", handle: "@zain.drip", likes: 2134, image: featureTryonNeutral },
  { rank: 3, name: "Layla M.", handle: "@laylamode", likes: 1892, image: featureOotwNeutral },
  { rank: 4, name: "Omar S.", handle: "@omar.fits", likes: 1456, image: featureStylistNeutral },
  { rank: 5, name: "Noor H.", handle: "@noor.chic", likes: 1203, image: featureTryonNeutral },
];

const rankIcons = [Crown, Trophy, Medal];
const rankColors = [
  "from-[hsl(45_100%_55%)] to-[hsl(35_100%_45%)]",
  "from-[hsl(0_0%_75%)] to-[hsl(0_0%_60%)]",
  "from-[hsl(25_70%_50%)] to-[hsl(20_60%_40%)]",
];

const OOTWPage = () => {
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());
  const [hasLanded, setHasLanded] = useState(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);

  const handleVote = (id: number) => {
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <FeaturePageLayout backgroundImage={bgImage}>
      <section className="pt-32 pb-10 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-7xl font-extrabold leading-[0.85] tracking-[0.04em] uppercase italic mb-8"
            style={{
              textShadow: "0 0 60px hsl(var(--accent) / 0.3), 0 0 120px hsl(var(--accent) / 0.15)",
            }}
          >
            Outfit Of The Week
          </motion.h1>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Feed with picture frames & vote */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-card/55 backdrop-blur-sm rounded-2xl p-4 neon-border space-y-3 relative"
            >
              {/* Mascot at top-left with glitter */}
              <div className="absolute -top-14 -left-12 z-20 pointer-events-none">
                <Glitter x={-5} y={8} delay={0.6} size={7} />
                <Glitter x={50} y={-4} delay={1.0} size={8} />
                <Glitter x={70} y={20} delay={1.3} size={6} />
                <Glitter x={20} y={55} delay={0.9} size={7} />
                <motion.img
                  src={mascotJumping}
                  alt="Ketra"
                  className="w-24 h-24 md:w-28 md:h-28 object-contain"
                  style={{ filter: "drop-shadow(0 0 12px hsl(45 100% 65% / 0.5)) drop-shadow(0 0 25px hsl(180 80% 65% / 0.25))", transform: "scaleX(-1)" }}
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: [-2, 3, -2] }}
                  transition={{ opacity: { duration: 0.4, delay: 0.5 }, scale: { duration: 0.5, delay: 0.5 }, y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
                />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg md:text-xl font-extrabold tracking-wide text-foreground">FEED</h2>
                <span className="text-muted-foreground font-body text-[10px] tracking-widest uppercase">Vote your fav</span>
              </div>

              {/* Picture grid with vote buttons */}
              <div className="grid grid-cols-2 gap-2">
                {feedOutfits.map(({ id, image, title, votes }) => {
                  const voted = votedIds.has(id);
                  return (
                    <div key={id} className="group">
                      {/* Picture frame */}
                      <div className="rounded-lg overflow-hidden border border-border/40 bg-muted/30 aspect-square relative">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                          <span className="font-display text-xs font-bold text-foreground">{title}</span>
                        </div>
                      </div>
                      {/* Vote button */}
                      <button
                        onClick={() => handleVote(id)}
                        className={`w-full mt-2 py-1.5 rounded-lg font-display text-xs tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                          voted
                            ? "bg-primary/20 text-primary neon-border"
                            : "bg-secondary/50 text-foreground hover:bg-secondary"
                        }`}
                      >
                        <ThumbsUp size={12} className={voted ? "fill-primary" : ""} />
                        {voted ? votes + 1 : votes}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right column - Upload & How It Works */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-card/55 backdrop-blur-sm rounded-2xl p-6 neon-border group cursor-pointer hover:neon-border-glow transition-shadow duration-500"
              >
                <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-wide text-foreground mb-3">UPLOAD YOUR OWN</h2>
                <p className="text-muted-foreground font-body text-sm mb-5">
                  Submit your outfit and get featured in next week's drop.
                </p>
                <div
                  onClick={() => setShowSubmitPopup(true)}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors cursor-pointer"
                >
                  <Upload size={28} className="text-muted-foreground" />
                  <span className="text-muted-foreground font-body text-xs">Drag & drop or click to upload</span>
                </div>
                <SuccessPopup open={showSubmitPopup} onClose={() => setShowSubmitPopup(false)} variant="outfit-submitted" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="bg-card/55 backdrop-blur-sm rounded-2xl p-6 neon-border relative"
              >
                {/* Sitting mascot near How It Works with glitter */}
                <div className="absolute -top-14 -right-10 z-20 pointer-events-none">
                  <Glitter x={-6} y={10} delay={1.2} size={6} />
                  <Glitter x={45} y={-2} delay={0.7} size={8} />
                  <Glitter x={65} y={25} delay={1.5} size={7} />
                  <Glitter x={15} y={50} delay={0.4} size={6} />
                  <motion.img
                    src={mascotSitting}
                    alt="Ketra sitting"
                    className="w-24 h-24 md:w-28 md:h-28 object-contain"
                    style={{ filter: "drop-shadow(0 0 12px hsl(280 60% 60% / 0.5)) drop-shadow(0 0 25px hsl(180 80% 65% / 0.25))" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: [-1, 3, -1] }}
                    transition={{ opacity: { duration: 0.5, delay: 0.8 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                  />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-wide text-foreground mb-5">HOW IT WORKS</h2>
                <div className="space-y-4">
                  {steps.map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="font-display text-sm font-bold text-primary">{step}</span>
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-foreground">{title}</h4>
                        <p className="text-muted-foreground font-body text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-wide"
          >
            <Crown className="inline-block mr-3 text-[hsl(45_100%_55%)]" size={32} />
            Style <span className="gradient-text">Leaderboard</span>
          </motion.h2>

          <div className="space-y-3">
            {leaderboard.map(({ rank, name, handle, likes, image }, i) => {
              const RankIcon = rankIcons[i] || null;
              const isTop3 = rank <= 3;
              return (
                <motion.div
                  key={rank}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                    isTop3
                      ? "bg-card/70 border-primary/30 hover:border-primary/50"
                      : "bg-card/50 border-border/40 hover:border-border/60"
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-extrabold text-sm ${
                    isTop3
                      ? `bg-gradient-to-br ${rankColors[i]} text-background`
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {RankIcon ? <RankIcon size={18} /> : `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-border/50 shrink-0">
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold text-foreground truncate">{name}</h4>
                    <p className="text-muted-foreground font-body text-xs">{handle}</p>
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Heart size={14} className="text-primary fill-primary" />
                    <span className="font-display text-sm font-bold text-foreground">{likes.toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </FeaturePageLayout>
  );
};

export default OOTWPage;
