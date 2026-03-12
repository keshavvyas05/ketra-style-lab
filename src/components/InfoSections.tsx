import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Users } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const sections = [
  {
    id: "about",
    icon: Users,
    label: "Who We Are",
    title: "ABOUT KETRA",
    description:
      "KETRA started with two friends, a bunch of random ideas, and a late night \"wait… this actually sounds cool\" moment. Taran and Keshav were trying to come up with a name when they realized something funny. KE from Keshav and TRA from Taran makes KETRA. And just like that, the name stuck.\n\nBut KETRA isn't just a name. We're building it to make online fashion way less stressful and way more fun. Instead of guessing how something might look on you, KETRA lets you actually try it on virtually.\n\nThink of it as fashion plus tech plus a little bit of curiosity. And honestly, this is just the beginning.",
  },
  {
    id: "privacy",
    icon: Shield,
    label: "Your Data",
    title: "PRIVACY",
    description:
      "Your privacy matters. We never sell your personal data to third parties. All virtual try-on images are processed securely and deleted after your session. We use industry-standard encryption to protect your information and give you full control over your data.",
    points: [
      "End-to-end encrypted sessions",
      "No third-party data sharing",
      "Images deleted after processing",
      "Full data control & export",
    ],
  },
];

const InfoSections = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-6 md:py-10">
      <div className="max-w-4xl mx-auto space-y-16 md:space-y-20">
        {sections.map((section, sIdx) => (
          <SectionBlock key={section.id} section={section} index={sIdx} />
        ))}
      </div>
    </div>
  );
};

const SectionBlock = ({ section, index }: { section: (typeof sections)[number]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = section.icon;

  return (
    <motion.div
      ref={ref}
      id={section.id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease }}
    >
      {/* Label */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size={16} className="text-accent" />
        <span className="text-muted-foreground font-body text-xs tracking-[0.4em] uppercase">
          {section.label}
        </span>
      </div>

      {/* Title */}
      <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-[0.15em] text-foreground mb-6">
        {section.title}
      </h2>

      {/* Description */}
      {"description" in section && section.description && (
        <div className="text-muted-foreground font-body text-sm md:text-base leading-relaxed max-w-2xl space-y-4">
          {section.description.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}


      {/* Points (Privacy) */}
      {"points" in section && section.points && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {section.points.map((point) => (
            <div
              key={point}
              className="flex items-center gap-2 text-muted-foreground font-body text-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {point}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InfoSections;
