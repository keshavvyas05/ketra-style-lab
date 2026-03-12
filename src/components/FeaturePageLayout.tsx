import { motion } from "framer-motion";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface FeaturePageLayoutProps {
  backgroundImage: string;
  children: ReactNode;
}

const FeaturePageLayout = ({ backgroundImage, children }: FeaturePageLayoutProps) => (
  <div className="min-h-screen bg-background relative">
    {/* Background image - fades in smoothly */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.92 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="fixed inset-0 z-0"
    >
      <img
        src={backgroundImage}
        alt=""
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* Overlay to soften the bg */}
    <div className="fixed inset-0 z-[1] bg-background/60" />

    {/* Content slides up over the background */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="relative z-10"
    >
      <Navbar />
      {children}
      <Footer />
    </motion.div>
  </div>
);

export default FeaturePageLayout;
