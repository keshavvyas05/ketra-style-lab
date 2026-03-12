import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, Sparkles, RotateCcw } from "lucide-react";
import tryOnImage from "@/assets/virtual-tryon.jpg";

const VirtualTryOn = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="virtual-tryon" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="neon-border rounded-3xl overflow-hidden">
            <img
              src={tryOnImage}
              alt="Virtual Try-On Technology"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <span className="text-primary font-body text-sm tracking-[0.3em] uppercase">Feature</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Virtual <span className="gradient-text">Try-On</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-md">
            See how every piece looks on you before you buy. Our AR-powered virtual mirror 
            brings the fitting room to your screen — no downloads needed.
          </p>

          <div className="space-y-4">
            {[
              { icon: Camera, title: "Snap & Try", desc: "Upload a selfie and see outfits on you instantly" },
              { icon: Sparkles, title: "AI Fit Analysis", desc: "Get personalized size and style recommendations" },
              { icon: RotateCcw, title: "360° View", desc: "Rotate and view from every angle" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-xl glass hover:neon-border transition-all duration-300">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">{title}</h4>
                  <p className="text-muted-foreground font-body text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOn;
