import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import heroBg from "@/assets/hero-bg-wave.png";
import mascotLamp from "@/assets/mascot-lamp.png";

const HERO_VIDEO = "/videos/hero-bg.mp4";

const RippleLetter = ({
  letter,
  index,
  loaded,
  ease,
}: {
  letter: string;
  index: number;
  loaded: boolean;
  ease: [number, number, number, number];
}) => {
  const [rippling, setRippling] = useState(false);
  const filterId = `water-ripple-${index}`;
  const baseFreqRef = useRef({ val: 0 });
  const scaleRef = useRef({ val: 0 });
  const animFrameRef = useRef<number>(0);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  const handleHover = () => {
    if (rippling) return;
    setRippling(true);

    const start = performance.now();
    const duration = 1200;

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      // Frequency starts high and decreases (ripple spreads out)
      const freq = 0.04 * (1 - t) + 0.005;
      // Scale peaks then fades
      const scale = Math.sin(t * Math.PI) * 60 * (1 - t * 0.5);

      if (turbRef.current) {
        turbRef.current.setAttribute("baseFrequency", `${freq} ${freq * 1.5}`);
      }
      if (dispRef.current) {
        dispRef.current.setAttribute("scale", `${scale}`);
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setRippling(false);
        if (dispRef.current) dispRef.current.setAttribute("scale", "0");
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <span className="relative inline-block cursor-default" onMouseEnter={handleHover}>
      {/* SVG filter for water ripple distortion */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.01 0.015"
              numOctaves="3"
              seed={index * 7 + 1}
              result="turbulence"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="turbulence"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <motion.span
        className="font-display text-[clamp(6rem,22vw,16rem)] font-extrabold leading-[0.85] tracking-[0.15em] text-white inline-block"
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={loaded ? { y: 0, opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease }}
        style={{
          filter: `url(#${filterId})`,
        }}
      >
        {letter}
      </motion.span>
    </span>
  );
};

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const glowX = useTransform(smoothX, [-0.5, 0.5], [35, 65]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], [35, 65]);

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#0a0a0f] z-[0]" />

      {/* Video background */}
      <div className="absolute inset-0 z-[1]">
        <video
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Ambient cursor glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) =>
              `radial-gradient(ellipse 800px 600px at ${x}% ${y}%, hsl(340 60% 30% / 0.25), transparent 70%),
               radial-gradient(ellipse 500px 400px at ${Number(x) + 20}% ${Number(y) - 10}%, hsl(280 30% 20% / 0.15), transparent 60%)`
          ),
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mascot */}
      <motion.div
        className="absolute top-6 right-2 sm:top-12 sm:right-6 md:top-20 md:right-12 lg:top-24 lg:right-16 xl:right-24 z-30 pointer-events-none"
        animate={{ y: [0, -12, 0, 8, 0], rotate: [0, 3, -2, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={mascotLamp}
          alt="Ketra Guide"
          className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40 object-contain"
          style={{
            filter: "drop-shadow(0 0 20px hsl(280 60% 55% / 0.5)) drop-shadow(0 0 40px hsl(45 100% 60% / 0.3))",
          }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* KETRA — ripple letters */}
        <div className="flex justify-center py-6">
          {"KETRA".split("").map((letter, i) => (
            <RippleLetter key={i} letter={letter} index={i} loaded={loaded} ease={ease} />
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="font-body text-[hsl(0_0%_80%)] text-base md:text-lg italic text-center mt-4 tracking-wide"
        >
          One stop for all undressed and overdressed people
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex gap-4 mt-10 flex-wrap justify-center"
        >
          <motion.a
            href="/vendor"
            className="px-10 py-3.5 font-body font-medium text-sm tracking-wider text-white rounded-full border border-[hsl(270_60%_65%/0.4)] backdrop-blur-md"
            style={{
              background: "linear-gradient(135deg, hsl(270 60% 55% / 0.5), hsl(270 50% 40% / 0.3))",
              boxShadow: "inset 0 1px 1px hsl(270 80% 80% / 0.3), 0 4px 20px hsl(270 60% 50% / 0.2)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "inset 0 1px 1px hsl(270 80% 80% / 0.4), 0 6px 30px hsl(270 60% 50% / 0.35)" }}
            whileTap={{ scale: 0.97 }}
          >
            vendor
          </motion.a>
          <motion.a
            href="#features"
            className="px-10 py-3.5 font-body font-medium text-sm tracking-wider text-white rounded-full border border-[hsl(180_60%_55%/0.4)] backdrop-blur-md"
            style={{
              background: "linear-gradient(135deg, hsl(180 60% 50% / 0.5), hsl(180 50% 35% / 0.3))",
              boxShadow: "inset 0 1px 1px hsl(180 80% 75% / 0.3), 0 4px 20px hsl(180 60% 45% / 0.2)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "inset 0 1px 1px hsl(180 80% 75% / 0.4), 0 6px 30px hsl(180 60% 45% / 0.35)" }}
            whileTap={{ scale: 0.97 }}
          >
            explorer
          </motion.a>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[hsl(0_0%_14%)] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="mx-8 text-[hsl(0_0%_16%)] font-display text-xl uppercase tracking-widest">
              Virtual Try-On — AI Stylist — OOTW — Fashion Tech — Ketra —
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
