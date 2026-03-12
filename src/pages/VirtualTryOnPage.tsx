import { useState } from "react";
import SuccessPopup from "@/components/SuccessPopup";
import { motion } from "framer-motion";
import FeaturePageLayout from "@/components/FeaturePageLayout";
import { Camera, Sparkles, RotateCcw, Upload, Layers, Smartphone } from "lucide-react";
import bgImage from "@/assets/feature-vto-bg.jpg";
import vtoCanvas from "@/assets/vto-canvas.png";
import mascotStanding from "@/assets/mascot-standing.png";
import mascotLamp from "@/assets/mascot-lamp.png";

const Glitter = ({ x, y, delay, size = 8 }: { x: number; y: number; delay: number; size?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0.5, 1, 0], scale: [0.3, 1.3, 0.7, 1.1, 0.3] }}
    transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeInOut" as const }}
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size,
      background: "radial-gradient(circle, hsl(340 80% 72%), hsl(320 60% 55%))",
      boxShadow: `0 0 ${size * 3}px hsl(340 80% 65% / 0.8), 0 0 ${size * 5}px hsl(280 60% 60% / 0.4)`,
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
      background: "radial-gradient(circle, hsl(340 80% 78%), hsl(320 60% 55%))",
      boxShadow: "0 0 16px hsl(340 80% 68% / 0.9), 0 0 30px hsl(280 60% 60% / 0.5)",
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
        background: "radial-gradient(circle, hsl(340 80% 78%), hsl(280 60% 65%))",
        boxShadow: `0 0 ${size * 3}px hsl(340 80% 68% / 0.9)`,
      }}
    />
  );
};

// Top-left flight path landing near right edge of VTO canvas
const mascotX = [-300, -220, -140, -100, -80, -60, -50, -45, -42, -40];
const mascotY = [-200, -150, -100, -60, -30, -10, 5, -5, 0, 5];
const FLIGHT_DURATION = 1;
const FLIGHT_DELAY = 0.4;

const trailPoints: { x: number; y: number; appearAt: number }[] = [];
for (let i = 0; i < mascotX.length - 1; i++) {
  const t = FLIGHT_DELAY + (i / (mascotX.length - 1)) * FLIGHT_DURATION;
  trailPoints.push({ x: mascotX[i] + 20, y: mascotY[i] + 20, appearAt: t });
  trailPoints.push({
    x: (mascotX[i] + mascotX[i + 1]) / 2 + 20 + (Math.random() - 0.5) * 10,
    y: (mascotY[i] + mascotY[i + 1]) / 2 + 20 + (Math.random() - 0.5) * 10,
    appearAt: t + (FLIGHT_DURATION / (mascotX.length - 1)) * 0.5,
  });
}

const burstAngles = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);

const features = [
  { icon: Camera, title: "Snap & Try", desc: "Upload a selfie and see outfits on you instantly" },
  { icon: Sparkles, title: "Upload The Fit", desc: "Get personalized size and style recommendations" },
  { icon: RotateCcw, title: "360° View", desc: "Rotate and view from every angle" },
];

const steps = [
  { icon: Upload, title: "Upload Your Photo", desc: "Snap a selfie or upload a full-body pic." },
  { icon: Layers, title: "Choose Your Fit", desc: "Browse outfits and layer pieces to create your look." },
  { icon: Smartphone, title: "See It On You", desc: "AR shows exactly how it looks — from every angle." },
];

const VirtualTryOnPage = () => {
  const [hasLanded, setHasLanded] = useState(false);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [tryOnCount, setTryOnCount] = useState(() => {
    const saved = localStorage.getItem("ketra-tryon-count");
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleTryOn = () => {
    const newCount = tryOnCount + 1;
    setTryOnCount(newCount);
    localStorage.setItem("ketra-tryon-count", String(newCount));
    if (newCount >= 2) {
      setShowCreditsPopup(true);
    }
  };

  return (
    <FeaturePageLayout backgroundImage={bgImage}>
      {/* Hero */}
      <section className="pt-36 pb-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          {/* Heading + Mascot row */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl font-extrabold leading-[0.85] tracking-[0.04em] uppercase italic mb-8"
              style={{
                textShadow: "0 0 60px hsl(var(--accent) / 0.3), 0 0 120px hsl(var(--accent) / 0.15)",
              }}
            >
              Virtual Try On
            </motion.h1>

          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground font-body text-lg md:text-xl leading-relaxed max-w-md mb-14 italic"
          >
            No guessing, no awkward trials.<br />
            See every outfit on you instantly.
          </motion.p>

          {/* Two-column: features + canvas */}
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Feature cards */}
            <div className="space-y-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/70 backdrop-blur-md border border-border/50 hover:bg-card/90 transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-xl bg-secondary shrink-0 group-hover:bg-accent/10 transition-colors">
                    <Icon className="text-foreground" size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm tracking-[0.15em] uppercase font-bold">{title}</h4>
                    <p className="text-muted-foreground font-body text-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* VTO Canvas + Mascot */}
            <div className="relative -mt-16 max-w-sm mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm aspect-[3/4] flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              >
                {/* Decorative corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />

                {/* Crosshair center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-px h-10 bg-border/30" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-px w-10 bg-border/30" />
                </div>

                {/* Icon + text */}
                <div className="p-3 rounded-full bg-secondary/50">
                  <Camera className="text-muted-foreground" size={24} />
                </div>
                <p className="text-muted-foreground font-body text-xs tracking-[0.2em] uppercase">Your outfit will appear here</p>
              </motion.div>

              {/* Mascot with flight animation + glitter */}
              <div className="absolute -top-6 -left-14 md:-left-20 pointer-events-none z-10">
                {trailPoints.map((p, i) => (
                  <TrailSparkle key={i} x={p.x} y={p.y} appearAt={p.appearAt} />
                ))}

                {hasLanded && (
                  <div className="absolute pointer-events-none z-30" style={{ left: -30, top: 15 }}>
                    {burstAngles.map((a, i) => <BurstParticle key={i} angle={a} />)}
                  </div>
                )}

                <motion.div
                  className="pointer-events-none z-30"
                  initial={{ opacity: 0, x: mascotX[0], y: mascotY[0] }}
                  animate={hasLanded
                    ? { opacity: 1, x: -40, y: 5 }
                    : { opacity: 1, x: mascotX, y: mascotY }
                  }
                  transition={hasLanded
                    ? { x: { type: "spring", stiffness: 180, damping: 12 }, y: { type: "spring", stiffness: 180, damping: 12 } }
                    : {
                        opacity: { duration: 0.1, delay: FLIGHT_DELAY },
                        x: { duration: FLIGHT_DURATION, delay: FLIGHT_DELAY, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1] },
                        y: { duration: FLIGHT_DURATION, delay: FLIGHT_DELAY, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1] },
                      }
                  }
                  onAnimationComplete={() => { if (!hasLanded) setHasLanded(true); }}
                >
                  <div className="relative">
                    <Glitter x={-10} y={8} delay={0.8} size={7} />
                    <Glitter x={60} y={-8} delay={1.1} size={9} />
                    <Glitter x={85} y={15} delay={1.4} size={6} />
                    <Glitter x={30} y={55} delay={1.7} size={8} />
                    <Glitter x={-8} y={40} delay={0.5} size={7} />

                    <motion.img
                      src={mascotStanding}
                      alt="Ketra Guide"
                      className="w-24 h-24 md:w-36 md:h-36 object-contain"
                      style={{
                        filter: "drop-shadow(0 0 12px hsl(340 80% 65% / 0.5)) drop-shadow(0 0 25px hsl(280 60% 60% / 0.25))",
                      }}
                      animate={{ y: hasLanded ? [-3, 3, -3] : 0, scale: hasLanded ? 1.15 : 1 }}
                      transition={{ y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const }, scale: { duration: 0.35, ease: "easeOut" as const } }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto relative">
          {/* Heading row with mascot on the left */}
          <div className="flex items-center justify-center gap-6 mb-16 relative">
            {/* Mascot with smoke on the left */}
            <div className="relative pointer-events-none w-28 h-28 md:w-36 md:h-36 shrink-0">
              {/* Smoke wisps */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={`smoke-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 20 + i * 14,
                    height: 20 + i * 14,
                    left: `${30 + (i % 3) * 12}%`,
                    top: `${-10 - i * 8}%`,
                    background: `radial-gradient(circle, hsl(280 50% 55% / ${0.18 - i * 0.02}), hsl(320 40% 50% / ${0.08 - i * 0.01}), transparent)`,
                    filter: `blur(${6 + i * 3}px)`,
                  }}
                  animate={{
                    y: [0, -15 - i * 12, -25 - i * 8, 0],
                    x: [0, (i % 2 === 0 ? 10 : -12), (i % 3 === 0 ? -6 : 8), 0],
                    opacity: [0.15, 0.5, 0.25, 0.15],
                    scale: [0.8, 1.4, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 3.5 + i * 0.6,
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeInOut",
                  }}
                />
              ))}
              {/* Larger diffused smoke clouds */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`cloud-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 60 + i * 25,
                    height: 40 + i * 15,
                    left: `${15 + i * 15}%`,
                    top: `${-25 - i * 12}%`,
                    background: `radial-gradient(ellipse, hsl(270 30% 50% / ${0.1 - i * 0.02}), transparent 70%)`,
                    filter: `blur(${14 + i * 6}px)`,
                  }}
                  animate={{
                    y: [0, -30 - i * 15, 0],
                    opacity: [0.1, 0.35, 0.1],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                />
              ))}
              {/* Glitter */}
              <Glitter x={-5} y={10} delay={0.5} size={6} />
              <Glitter x={55} y={-5} delay={1.0} size={7} />
              <Glitter x={80} y={18} delay={1.3} size={5} />
              <Glitter x={25} y={65} delay={0.7} size={6} />
              <motion.img
                src={mascotLamp}
                alt="Ketra with lamp"
                className="w-full h-full object-contain relative z-10"
                style={{ filter: "drop-shadow(0 0 15px hsl(280 60% 55% / 0.5)) drop-shadow(0 0 30px hsl(45 100% 60% / 0.3))" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [-2, 4, -2] }}
                transition={{ opacity: { duration: 0.5, delay: 0.6 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold"
            >
              How It <span className="gradient-text">Works</span>
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card/80 backdrop-blur-sm subtle-border rounded-2xl p-8 text-center hover-lift group relative"
              >
                <div className="absolute top-4 right-4 font-display text-5xl font-bold text-border">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5">
                  <Icon className="text-foreground" size={28} />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mt-14"
          >
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-display text-lg tracking-[0.15em] uppercase hover:opacity-90 transition-opacity shadow-lg">
              Try It Now
            </button>
          </motion.div>
          <SuccessPopup open={showCreditsPopup} onClose={() => setShowCreditsPopup(false)} variant="credits-exhausted" />
        </div>
      </section>
    </FeaturePageLayout>
  );
};

export default VirtualTryOnPage;
