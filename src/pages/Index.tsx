import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUse from "@/components/HowToUse";
import InfoSections from "@/components/InfoSections";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowToUse />
      <InfoSections />
      <Footer />
    </div>
  );
};

export default Index;
