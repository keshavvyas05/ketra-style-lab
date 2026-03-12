import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";

const faqs = [
  { q: "What is Ketra?", a: "Ketra is a fashion-tech platform that lets you virtually try on clothes using AI. See how outfits look on you before buying!" },
  { q: "How does Virtual Try-On work?", a: "Upload a photo of yourself, pick any outfit from our catalog, and our AI generates a realistic preview of you wearing it — no downloads needed." },
  { q: "Is Ketra free to use?", a: "Yes! You get free virtual try-on sessions. For unlimited access and premium features, check out our Pro and Premium plans." },
  { q: "What is OOTW?", a: "OOTW stands for Outfit of the Week — curated weekly outfit drops powered by AI and approved by culture. Fresh fits every week!" },
  { q: "How does the AI Stylist work?", a: "Tell us your vibe, mood, or occasion and our AI curates complete outfits tailored to your unique style preferences." },
  { q: "Can vendors use Ketra?", a: "Absolutely! Vendors get a branded subdomain, embed widgets, analytics dashboards, and virtual try-on for their customers. Visit /vendor to register." },
  { q: "How do I contact support?", a: "You can reach us through the support section in your dashboard, or email us directly. We typically respond within 24 hours." },
  { q: "Is my data safe?", a: "Yes. We take privacy seriously. Your photos are processed securely and never shared with third parties." },
];

const FAQChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi! 👋 I'm Ketra's assistant. Pick a question below or type your own!" },
  ]);
  const [input, setInput] = useState("");
  const [showFaqs, setShowFaqs] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFaqClick = (faq: typeof faqs[0]) => {
    setMessages(prev => [
      ...prev,
      { role: "user", text: faq.q },
      { role: "bot", text: faq.a },
    ]);
    setShowFaqs(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    // Simple keyword matching against FAQs
    const lower = userMsg.toLowerCase();
    const match = faqs.find(f =>
      f.q.toLowerCase().includes(lower) ||
      lower.split(" ").some(word => word.length > 3 && f.q.toLowerCase().includes(word))
    );

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: match
            ? match.a
            : "Thanks for your question! For detailed help, please visit our support page or reach out to our team. Is there anything else I can help with?",
        },
      ]);
    }, 600);
    setShowFaqs(false);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle FAQ chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(520px, calc(100vh - 8rem))" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border bg-secondary/50 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <MessageCircle size={16} className="text-accent" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">Ketra Help</p>
                <p className="font-body text-xs text-muted-foreground">Ask us anything</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl font-body text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* FAQ suggestions */}
              {showFaqs && (
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground font-body text-xs">Common questions:</p>
                  {faqs.slice(0, 5).map((faq, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleFaqClick(faq)}
                      className="block w-full text-left px-3 py-2 rounded-xl bg-secondary/60 border border-border/50 hover:border-accent/30 text-foreground font-body text-xs transition-all duration-200"
                    >
                      {faq.q}
                    </motion.button>
                  ))}
                  {!showFaqs || (
                    <button
                      onClick={() => setShowFaqs(false)}
                      className="text-muted-foreground font-body text-xs hover:text-foreground flex items-center gap-1 mt-1"
                    >
                      <ChevronDown size={12} /> Hide suggestions
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Show FAQs again button */}
            {!showFaqs && (
              <button
                onClick={() => setShowFaqs(true)}
                className="mx-4 mb-2 text-accent font-body text-xs hover:underline text-left"
              >
                Show common questions
              </button>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-secondary/30 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Type a question..."
                className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/40 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-accent text-accent-foreground disabled:opacity-40 hover:bg-accent/90 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FAQChatbot;
