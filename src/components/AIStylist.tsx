import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Palette, TrendingUp, Zap } from "lucide-react";
import aiStylistImage from "@/assets/ai-stylist.jpg";

const features = [
  { icon: Brain, label: "Smart Picks" },
  { icon: Palette, label: "Color Match" },
  { icon: TrendingUp, label: "Trend Aware" },
  { icon: Zap, label: "Instant Recs" },
];

const AIStylist = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ai-stylist" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8 order-2 md:order-1"
        >
          <span className="text-primary font-body text-sm tracking-[0.3em] uppercase">AI Powered</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Your Personal <span className="gradient-text">AI Stylist</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-md">
            Tell us your vibe, mood, or occasion — our AI curates complete outfits tailored 
            to your unique style DNA. Fashion that gets you.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass rounded-xl p-5 text-center hover:neon-border transition-all duration-300 group"
              >
                <Icon className="text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" size={28} />
                <span className="font-body text-sm text-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative order-1 md:order-2"
        >
          <div className="neon-border rounded-3xl overflow-hidden">
            <img
              src={aiStylistImage}
              alt="AI Stylist Interface"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIStylist;
