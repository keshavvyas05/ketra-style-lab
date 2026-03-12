import { motion } from "framer-motion";
import mascotOriginal from "@/assets/mascot-character.png";
import mascotStanding from "@/assets/mascot-standing.png";
import mascotCarpet from "@/assets/mascot-carpet.png";
import mascotCarpetStanding from "@/assets/mascot-carpet-standing.png";
import mascotLying from "@/assets/mascot-lying.png";
import mascotVeiled from "@/assets/mascot-veiled.png";
import mascotJumping from "@/assets/mascot-jumping.png";

export type MascotPose = "original" | "standing" | "carpet" | "carpet-standing" | "lying" | "veiled" | "jumping";

const poseMap: Record<MascotPose, string> = {
  original: mascotOriginal,
  standing: mascotStanding,
  carpet: mascotCarpet,
  "carpet-standing": mascotCarpetStanding,
  lying: mascotLying,
  veiled: mascotVeiled,
  jumping: mascotJumping,
};

interface FloatingMascotProps {
  position?: "left" | "right" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  flip?: boolean;
  rotate?: number;
  pose?: MascotPose;
}

const Glitter = ({ x, y, delay, size = 8 }: { x: string; y: string; delay: number; size?: number }) => (
  <motion.div
    animate={{
      opacity: [0, 1, 0.6, 1, 0],
      scale: [0.3, 1.4, 0.8, 1.2, 0.3],
    }}
    transition={{
      duration: 1.8 + delay * 0.2,
      repeat: Infinity,
      delay: delay * 0.3,
      ease: "easeInOut" as const,
    }}
    className="absolute rounded-full"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      background: `radial-gradient(circle, hsl(50 100% 75%), hsl(45 100% 60%))`,
      boxShadow: `0 0 ${size * 3}px hsl(45 100% 65% / 0.8), 0 0 ${size * 6}px hsl(180 80% 65% / 0.4)`,
    }}
  />
);

const sizeMap = {
  sm: "w-24 h-24 md:w-32 md:h-32",
  md: "w-32 h-32 md:w-48 md:h-48",
  lg: "w-40 h-40 md:w-64 md:h-64",
  xl: "w-48 h-48 md:w-72 md:h-72",
};

const FloatingMascot = ({
  position = "right",
  size = "md",
  className = "",
  flip = false,
  rotate = 0,
  pose = "original",
}: FloatingMascotProps) => {
  const positionClass = {
    left: "left-2 md:left-8",
    right: "right-2 md:right-8",
    center: "left-1/2 -translate-x-1/2",
  }[position];

  return (
    <div className={`absolute ${positionClass} ${className} pointer-events-none z-20`}>
      <div className="relative">
        {/* Glitter particles */}
        <Glitter x="-5%" y="15%" delay={0} size={8} />
        <Glitter x="85%" y="5%" delay={0.8} size={10} />
        <Glitter x="100%" y="45%" delay={1.5} size={7} />
        <Glitter x="-10%" y="65%" delay={2} size={9} />
        <Glitter x="45%" y="-5%" delay={0.4} size={8} />
        <Glitter x="75%" y="80%" delay={1.2} size={11} />
        <Glitter x="15%" y="85%" delay={2.2} size={7} />
        <Glitter x="55%" y="95%" delay={0.6} size={9} />
        <Glitter x="30%" y="30%" delay={1.8} size={6} />
        <Glitter x="70%" y="60%" delay={0.2} size={7} />

        {/* Fairy-like floating character */}
        <motion.div
          initial={{ opacity: 0, x: -60, y: -30 }}
          animate={{
            opacity: 1,
            x: [0, 15, -10, 20, -5, 12, 0],
            y: [0, -18, 8, -12, 14, -8, 0],
            rotate: [0, 3, -2, 4, -3, 2, 0],
          }}
          transition={{
            opacity: { duration: 0.8 },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" as const },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
            rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" as const },
          }}
        >
          <motion.img
            src={poseMap[pose]}
            alt="Ketra Style Guide"
            className={`${sizeMap[size]} object-contain`}
            style={{
              transform: `${flip ? "scaleX(-1)" : ""} rotate(${rotate}deg)`,
              filter: "drop-shadow(0 0 15px hsl(45 100% 65% / 0.4)) drop-shadow(0 0 30px hsl(180 80% 65% / 0.2))",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingMascot;
