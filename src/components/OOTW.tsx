import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Heart, Share2 } from "lucide-react";
import ootwImage from "@/assets/ootw.jpg";

const OOTW = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ootw" className="section-padding relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-primary font-body text-sm tracking-[0.3em] uppercase">Weekly Drops</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            Outfit of the <span className="gradient-text">Week</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto">
            Fresh fits dropped every week. Curated by AI, approved by culture.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="neon-border rounded-3xl overflow-hidden">
            <img
              src={ootwImage}
              alt="Outfit of the Week"
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* Overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background/95 via-background/60 to-transparent rounded-b-3xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-primary font-body text-xs tracking-widest uppercase flex items-center gap-2">
                  <Calendar size={14} /> Week 10 • March 2026
                </span>
                <h3 className="font-display text-2xl md:text-4xl font-bold mt-2">
                  Streetcore Essentials
                </h3>
                <p className="text-muted-foreground font-body text-sm mt-1 max-w-md">
                  Three versatile looks that blend utility-wear with high-fashion edge. Layer up.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 glass rounded-xl hover:neon-border transition-all">
                  <Heart size={20} className="text-primary" />
                </button>
                <button className="p-3 glass rounded-xl hover:neon-border transition-all">
                  <Share2 size={20} className="text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mt-12"
        >
          {[
            { value: "52+", label: "Weekly Drops" },
            { value: "1M+", label: "Outfits Saved" },
            { value: "98%", label: "Style Match" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center glass rounded-2xl p-6">
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">{value}</div>
              <div className="text-muted-foreground font-body text-sm mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OOTW;
