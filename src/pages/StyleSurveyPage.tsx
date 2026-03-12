import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Palette, Ruler, Shirt, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type SurveyData = {
  gender: string;
  age: string;
  bodyType: string;
  skinTone: string;
  clothingStyles: string[];
};

const steps = [
  {
    key: "gender" as const,
    title: "What's your gender?",
    icon: User,
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
    multi: false,
  },
  {
    key: "age" as const,
    title: "What's your age range?",
    icon: Calendar,
    options: ["Under 18", "18–24", "25–34", "35–44", "45+"],
    multi: false,
  },
  {
    key: "bodyType" as const,
    title: "What's your body type?",
    icon: Ruler,
    options: ["Slim", "Athletic", "Average", "Curvy", "Plus-size"],
    multi: false,
  },
  {
    key: "skinTone" as const,
    title: "What's your skin tone?",
    icon: Palette,
    options: ["Fair", "Light", "Medium", "Olive", "Tan", "Brown", "Dark", "Deep"],
    multi: false,
  },
  {
    key: "clothingStyles" as const,
    title: "Pick your style preferences",
    icon: Shirt,
    options: ["Street Style", "Casual", "Formal", "Old Money", "Minimalist", "Bohemian", "Sporty", "Vintage", "Avant-Garde", "Preppy"],
    multi: true,
  },
];

const StyleSurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [survey, setSurvey] = useState<SurveyData>({
    gender: "",
    age: "",
    bodyType: "",
    skinTone: "",
    clothingStyles: [],
  });
  const [completed, setCompleted] = useState(false);

  const step = steps[currentStep];
  const isMulti = step.multi;
  const currentValue = survey[step.key];
  const canProceed = isMulti
    ? (currentValue as string[]).length > 0
    : (currentValue as string) !== "";

  const handleSelect = (option: string) => {
    if (isMulti) {
      const arr = survey.clothingStyles;
      setSurvey({
        ...survey,
        clothingStyles: arr.includes(option)
          ? arr.filter((s) => s !== option)
          : [...arr, option],
      });
    } else {
      setSurvey({ ...survey, [step.key]: option });
    }
  };

  const isSelected = (option: string) => {
    if (isMulti) return (currentValue as string[]).includes(option);
    return currentValue === option;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("ketra-style-survey", JSON.stringify(survey));
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="flex gap-2 mb-12">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  i <= currentStep ? "bg-accent" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-accent" />
                </div>
                <h2 className="font-display text-4xl font-extrabold mb-3">You're All Set!</h2>
                <p className="text-muted-foreground font-body text-lg mb-8">
                  Your style profile has been saved. We'll use this to personalize your experience.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-accent-foreground font-display text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                >
                  Explore Ketra <ArrowRight size={16} />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Step header */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <span className="text-muted-foreground font-body text-xs tracking-widest uppercase">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-2 mt-4">
                  {step.title}
                </h2>
                {isMulti && (
                  <p className="text-muted-foreground font-body text-sm mb-6">Select all that apply</p>
                )}

                {/* Options grid */}
                <div className={`grid gap-3 mt-8 ${step.options.length > 5 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
                  {step.options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(option)}
                      className={`py-4 px-5 rounded-xl font-body text-sm text-left transition-all duration-300 border ${
                        isSelected(option)
                          ? "bg-accent/15 border-accent/50 text-foreground"
                          : "bg-card/60 border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isSelected(option) && <Check size={14} className="text-accent" />}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 font-body text-sm transition-colors ${
                      currentStep === 0
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <motion.button
                    whileHover={canProceed ? { scale: 1.03 } : {}}
                    whileTap={canProceed ? { scale: 0.97 } : {}}
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-display text-sm tracking-[0.15em] uppercase transition-all ${
                      canProceed
                        ? "bg-accent text-accent-foreground hover:opacity-90"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {currentStep === steps.length - 1 ? "Finish" : "Next"} <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StyleSurveyPage;
