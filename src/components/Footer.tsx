import { Link } from "react-router-dom";
import { Instagram, Twitter } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <motion.footer
      ref={ref}
      className="border-t border-border py-12 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <Link to="/" className="font-display text-xl font-bold tracking-wider">
            KETRA
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="flex gap-6 text-muted-foreground font-body text-sm"
        >
          <Link to="/virtual-tryon" className="hover:text-foreground transition-colors">Try-On</Link>
          <Link to="/ai-stylist" className="hover:text-foreground transition-colors">AI Stylist</Link>
          <Link to="/ootw" className="hover:text-foreground transition-colors">OOTW</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="flex gap-4"
        >
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter size={20} /></a>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="max-w-7xl mx-auto mt-8 text-center text-muted-foreground font-body text-xs"
      >
        © 2026 Ketra. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
