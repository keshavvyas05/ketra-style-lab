import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingMascot from "@/components/FloatingMascot";

const paragraphs = [
  "KETRA didn't start as a big business plan, it started as two friends messing around with ideas and trying to build something cool.",
  "We're Taran and Keshav, two people who love tech, design, and the idea that the internet should make life easier (and way more fun). One day while brainstorming names, we realized something funny: if you mix KE from Keshav and TRA from Taran, you get KETRA. And honestly… it just sounded right.",
  "But KETRA became more than just a name. We realized how annoying online shopping can be. You see something that looks great, order it, and when it arrives… it's nothing like what you imagined. We thought: what if people could actually see how things look on them before buying?",
  "So we started building something that mixes fashion and technology to make that possible.",
  "KETRA is important to us because it represents the idea that you don't need a huge company or a big team to start something. Sometimes it's just two people, a random idea, and the motivation to try building it.",
  "Right now, KETRA is just the beginning of what we're creating, and honestly, we're excited to see where it goes.",
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 relative">
      <FloatingMascot pose="standing" position="left" size="md" className="bottom-0 hidden lg:block" flip />
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-4">
          <span className="text-muted-foreground font-body text-xs tracking-[0.3em] uppercase">Our Story</span>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[0.9]">
            We Are <span className="text-accent">Ketra</span>
          </h1>
        </motion.div>

        <div className="space-y-6">
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="text-muted-foreground font-body text-base md:text-lg leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          Ready to <span className="gradient-text">Redefine</span> Your Style?
        </h2>
        <p className="text-muted-foreground font-body text-lg">Join the future of fashion.</p>
        <a href="/" className="inline-block px-10 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition-all">
          Get Started
        </a>
      </motion.div>
    </section>
    <Footer />
  </div>
);

export default About;
