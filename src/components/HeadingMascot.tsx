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

interface HeadingMascotProps {
  pose?: MascotPose;
  flip?: boolean;
}

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

const HeadingMascot = ({ pose = "original", flip = false }: HeadingMascotProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{ top: -20, right: -40 }}
      initial={{ opacity: 0, x: -200, y: -80 }}
      animate={{
        opacity: 1,
        x: [0, 30, -20, 40, -10, 25, 0],
        y: [0, -25, 10, -15, 20, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay: 0.5 },
        x: { duration: 14, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 },
        y: { duration: 9, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 },
      }}
    >
      {/* Glitter trail */}
      <Glitter x={-10} y={5} delay={0} size={7} />
      <Glitter x={50} y={-8} delay={0.3} size={9} />
      <Glitter x={85} y={10} delay={0.6} size={6} />
      <Glitter x={20} y={55} delay={0.9} size={8} />
      <Glitter x={70} y={50} delay={1.2} size={5} />
      <Glitter x={-5} y={40} delay={0.5} size={7} />

      <motion.img
        src={poseMap[pose]}
        alt="Ketra Guide"
        className="w-16 h-16 md:w-24 md:h-24 object-contain"
        style={{
          transform: flip ? "scaleX(-1)" : undefined,
          filter: "drop-shadow(0 0 12px hsl(45 100% 65% / 0.5)) drop-shadow(0 0 25px hsl(180 80% 65% / 0.25))",
        }}
        animate={{ rotate: [0, 5, -3, 4, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </motion.div>
  );
};

export { HeadingMascot, poseMap };
export type { HeadingMascotProps };
