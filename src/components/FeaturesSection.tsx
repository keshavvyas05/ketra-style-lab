import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import featureStylist from "@/assets/feature-stylist-bg.jpg";
import featureTryon from "@/assets/feature-vto-bg.jpg";
import featureOotw from "@/assets/feature-ootw-bg.jpg";
import FloatingMascot from "./FloatingMascot";

const features = [
  { title: "AI\nSTYLIST", image: featureStylist, path: "/ai-stylist", highlight: "Personalized fits powered by AI" },
  { title: "VIRTUAL\nTRY ONS", image: featureTryon, path: "/virtual-tryon", highlight: "See it on you before you buy" },
  { title: "OOTW", image: featureOotw, path: "/ootw", highlight: "Weekly curated outfit drops" },
];

const FeatureCard = ({
  title,
  image,
  path,
  index,
  highlight,
}: {
  title: string;
  image: string;
  path: string;
  index: number;
  highlight: string;
}) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.96]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
      style={{ scale: cardScale }}
      onClick={() => navigate(path)}
      className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group neon-border hover:neon-border-glow transition-shadow duration-500"
    >
      <motion.img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700"
        style={{ y: imgY, scale: 1.1 }}
      />
      <div className="absolute inset-0 bg-background/50 md:bg-secondary md:group-hover:bg-background/40 transition-all duration-500" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-3 text-center gap-2">
        <h3 className="font-display text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight whitespace-pre-line text-foreground">
          {title}
        </h3>
        <span className="font-body text-[10px] sm:text-xs md:text-sm text-muted-foreground tracking-wide opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500">
          {highlight}
        </span>
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-10 flex justify-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-primary text-primary-foreground font-body text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase group-hover:opacity-90 transition-all duration-300">
          View more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section id="features" className="px-6 md:px-12 lg:px-20 pt-10 md:pt-16 pb-20 md:pb-32 relative" ref={sectionRef}>
      <FloatingMascot pose="veiled" position="left" size="md" className="-top-4 hidden md:block" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="text-center mb-12"
        >
          <span className="text-muted-foreground font-body text-xs tracking-[0.4em] uppercase">
            Features
          </span>
          <p className="text-muted-foreground/60 font-body text-xs md:text-sm mt-2 max-w-md mx-auto">
            Discover tools that make styling effortless
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 md:gap-6 h-[65vh] md:h-[80vh] p-3 md:p-5 rounded-3xl md:rounded-[2rem] neon-border" style={{ perspective: "1200px" }}>
          {features.map(({ title, image, path, highlight }, i) => (
            <FeatureCard key={title} title={title} image={image} path={path} index={i} highlight={highlight} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
