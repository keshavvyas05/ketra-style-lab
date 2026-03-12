import { useState } from "react";
import { motion } from "framer-motion";
import FeaturePageLayout from "@/components/FeaturePageLayout";
import { Search } from "lucide-react";
import searchGem from "@/assets/search-gem.png";
import bgImage from "@/assets/feature-stylist-bg.jpg";
import mascotLying from "@/assets/mascot-lying.png";

const Glitter = ({ x, y, delay, size = 6 }: { x: number; y: number; delay: number; size?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0.5, 1, 0],
      scale: [0.3, 1.3, 0.7, 1.1, 0.3],
    }}
    transition={{
      duration: 1.6,
      repeat: Infinity,
      delay,
      ease: "easeInOut" as const,
    }}
    className="absolute rounded-full pointer-events-none"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
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
    style={{
      left: x,
      top: y,
      width: 6,
      height: 6,
      background: "radial-gradient(circle, hsl(50 100% 82%), hsl(45 100% 58%))",
      boxShadow: "0 0 16px hsl(45 100% 68% / 0.9), 0 0 30px hsl(180 80% 65% / 0.5)",
    }}
  />
);

// Burst particle for landing
const BurstParticle = ({ angle, delay }: { angle: number; delay: number }) => {
  const dist = 30 + Math.random() * 25;
  const tx = Math.cos(angle) * dist;
  const ty = Math.sin(angle) * dist;
  const size = 4 + Math.random() * 5;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], x: tx, y: ty }}
      transition={{ duration: 0.6, delay, ease: "easeOut" as const }}
      className="absolute rounded-full pointer-events-none"
      style={{
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        background: "radial-gradient(circle, hsl(50 100% 82%), hsl(180 80% 70%))",
        boxShadow: `0 0 ${size * 3}px hsl(45 100% 68% / 0.9)`,
      }}
    />
  );
};

// Flight from TOP-LEFT corner, arcs down to land at top-right of search bar
const mascotX = [-250, -180, -100, -10, 80, 170, 250, 310, 340, 320];
const mascotY = [-200, -160, -120, -90, -60, -30, 0, 30, 60, 80];
const FLIGHT_DURATION = 1;
const FLIGHT_DELAY = 0.25;

// Trail points
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

// Burst angles for landing
const burstParticles = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI * 2,
  delay: FLIGHT_DELAY + FLIGHT_DURATION + 0.05,
}));

const AIStylistPage = () => {
  const [query, setQuery] = useState("");
  const [hasLanded, setHasLanded] = useState(false);

  return (
    <FeaturePageLayout backgroundImage={bgImage}>
      <div className="pt-24 pb-12 px-6 md:px-12 min-h-screen flex flex-col items-center relative">
        {/* Title + Mascot container */}
        <div className="relative mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-[0.08em] text-foreground"
          >
            AI STYLIST
          </motion.h1>

          {/* Glitter trail */}
          {trailPoints.map((p, i) => (
            <TrailSparkle key={i} x={p.x} y={p.y} appearAt={p.appearAt} />
          ))}

          {/* Landing glitter burst */}
          {hasLanded && (
            <div className="absolute pointer-events-none z-30" style={{ left: 320 + 10, top: 70 + 10 }}>
              {burstParticles.map((p, i) => (
                <BurstParticle key={i} angle={p.angle} delay={0} />
              ))}
            </div>
          )}

          {/* Character flight - left to right */}
          <motion.div
            className="absolute pointer-events-none z-30"
            style={{ top: 0, left: 0 }}
            initial={{ opacity: 0, x: -250, y: -200 }}
            animate={
              hasLanded
                ? { opacity: 1, x: 320, y: 70 }
                : { opacity: 1, x: mascotX, y: mascotY }
            }
            transition={
              hasLanded
                ? {
                    x: { type: "spring", stiffness: 180, damping: 12, bounce: 0.4 },
                    y: { type: "spring", stiffness: 180, damping: 12, bounce: 0.4 },
                  }
                : {
                    opacity: { duration: 0.1, delay: FLIGHT_DELAY },
                    x: { duration: FLIGHT_DURATION, delay: FLIGHT_DELAY, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1] },
                    y: { duration: FLIGHT_DURATION, delay: FLIGHT_DELAY, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1] },
                  }
            }
            onAnimationComplete={() => {
              if (!hasLanded) setHasLanded(true);
            }}
          >
            <div className="relative">
              <Glitter x={-8} y={5} delay={0.8} size={7} />
              <Glitter x={55} y={-6} delay={1.1} size={9} />
              <Glitter x={80} y={12} delay={1.4} size={6} />
              <Glitter x={25} y={50} delay={1.7} size={8} />
              <Glitter x={65} y={45} delay={2.0} size={5} />
              <Glitter x={-5} y={35} delay={0.5} size={7} />

              <motion.img
                src={mascotLying}
                alt="Ketra Guide"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                style={{
                  filter: "drop-shadow(0 0 12px hsl(45 100% 65% / 0.5)) drop-shadow(0 0 25px hsl(180 80% 65% / 0.25))",
                }}
                animate={{ 
                  y: hasLanded ? [-3, 3, -3] : 0,
                  scale: hasLanded ? 1.35 : 1,
                }}
                transition={{ 
                  y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
                  scale: { duration: 0.35, ease: "easeOut" as const },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-2xl mb-6"
        >
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-card subtle-border">
            <button className="shrink-0 hover:scale-110 transition-transform">
              <img src={searchGem} alt="Search" className="w-8 h-8 object-contain" />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="See Magic....."
              className="w-full bg-transparent font-body text-lg text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </motion.div>

        {/* Results Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="w-full max-w-2xl flex-1 min-h-[50vh] rounded-2xl bg-[hsl(170_40%_85%/0.6)] backdrop-blur-sm border border-[hsl(170_40%_70%/0.4)] p-6 flex items-center justify-center"
        >
          {query ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-card/80 flex items-center justify-center mx-auto">
                <Search size={28} className="text-muted-foreground" />
              </div>
              <p className="font-body text-foreground/70 text-lg">
                Searching styles for "<span className="font-semibold text-foreground">{query}</span>"...
              </p>
              <p className="font-body text-muted-foreground text-sm">
                AI is curating your perfect looks
              </p>
            </motion.div>
          ) : (
            <div className="text-center space-y-3">
              <p className="font-body text-foreground/50 text-lg">
                Type something to discover your style ✨
              </p>
              <p className="font-body text-foreground/30 text-sm">
                Try "casual summer outfit" or "streetwear vibes"
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </FeaturePageLayout>
  );
};

export default AIStylistPage;
