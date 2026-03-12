import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Sparkles, Search, Shirt, Wand2 } from "lucide-react";
import scrollTextImg from "@/assets/howto-scroll-text.png";
const steps = [
  { step: "01", title: "Browse", desc: "Explore our curated collections and trending styles across categories.", icon: Search },
  { step: "02", title: "Try On", desc: "Use our virtual try-on to see how outfits look on you before buying.", icon: Shirt },
  { step: "03", title: "Get Styled", desc: "Let our AI stylist create personalized looks based on your preferences.", icon: Wand2 },
];

const HowToUse = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const headingRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);

  return (
    <section ref={ref} className="relative pt-6 md:pt-10 pb-12 md:pb-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[hsl(270_30%_8%)] via-[hsl(240_20%_10%)] to-background">
      {/* Label */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Sparkles size={16} className="text-accent" />
        <span className="text-muted-foreground font-body text-xs tracking-[0.4em] uppercase">
          Getting Started
        </span>
      </div>

      {/* Heading with image scrolling through text */}
      <div ref={headingRef} className="relative flex justify-center mb-12 md:mb-16 py-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(4.5rem,16vw,13rem)] font-extrabold leading-[1.1] tracking-[0.04em] text-center select-none"
        >
          <motion.span
            className="inline-block"
            style={{
              backgroundImage: `url(${scrollTextImg})`,
              backgroundSize: "cover",
              backgroundPositionX: "center",
              backgroundPositionY: imgY,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HOW TO USE
          </motion.span>
        </motion.h2>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-2xl bg-secondary/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-500 hover:bg-secondary/80"
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <Icon size={18} className="text-accent group-hover:text-accent transition-colors" />
                </div>
                <span className="font-display text-3xl text-muted-foreground/40 group-hover:text-accent/60 transition-colors duration-300">{item.step}</span>
              </div>
              <h3 className="font-display text-2xl tracking-wide text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HowToUse;
