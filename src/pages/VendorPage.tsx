import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Store, Code, BarChart3, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  { icon: Store, title: "Your Own Branded Subdomain", desc: "Get a custom storefront like yourstore.ketra.fashion with your branding, logo, and colors." },
  { icon: Code, title: "Embed Widget for Any Website", desc: "Add virtual try-on to your existing website with a simple copy-paste embed code." },
  { icon: BarChart3, title: "Detailed Analytics Dashboard", desc: "Track try-on sessions, popular products, peak hours, and customer engagement in real time." },
];

const countries = [
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dial: "+966" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dial: "+971" },
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "IN", name: "India", flag: "🇮🇳", dial: "+91" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dial: "+20" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", dial: "+90" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dial: "+81" },
];

const trafficOptions = ["Under 100", "100 to 500", "500 to 1,000", "1,000 to 5,000", "Above 5,000"];
const hearAboutOptions = ["Social Media", "Google Search", "Friend Referral", "Fashion Event", "Other"];

const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300";
const labelClass = "block text-foreground font-body text-sm font-medium mb-1.5";

const VendorPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    storeName: "", ownerName: "", email: "", phone: "", country: "", countryCode: "", website: "", traffic: "", hearAbout: "",
  });

  const selectedCountry = countries.find(c => c.code === form.country);

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.storeName || !form.ownerName || !form.email || !form.phone || !form.traffic || !form.hearAbout) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("vendors").insert({
        store_name: form.storeName,
        email: form.email,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-accent font-body text-xs tracking-[0.4em] uppercase mb-4 block">For Vendors</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wide mb-6">
              Power Your Store with<br />AI Virtual <span className="gradient-text">Try-On</span>
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Give your customers the ability to try on your products virtually. Increase conversions, reduce returns, and stand out from the competition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefit Cards */}
      <section className="px-6 md:px-12 lg:px-20 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-7 rounded-2xl glass hover:neon-border transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display text-xl tracking-wide text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Registration Form / Thank You */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
                <div className="text-center mb-10">
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide">Register Your <span className="gradient-text">Store</span></h2>
                  <p className="text-muted-foreground font-body text-sm mt-2">Fill in your details and we'll get you set up</p>
                </div>
                <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6 md:p-10 rounded-2xl glass">
                  <div>
                    <label className={labelClass}>Store Name *</label>
                    <input className={inputClass} placeholder="e.g. Fab Fashion Co." value={form.storeName} onChange={e => handleChange("storeName", e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Owner Full Name *</label>
                    <input className={inputClass} placeholder="John Doe" value={form.ownerName} onChange={e => handleChange("ownerName", e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" className={inputClass} placeholder="vendor@example.com" value={form.email} onChange={e => handleChange("email", e.target.value)} required />
                  </div>

                  {/* Phone with country code */}
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input 
                      type="tel" 
                      className={inputClass} 
                      placeholder="+91 555 123 4567" 
                      value={form.phone} 
                      onChange={e => handleChange("phone", e.target.value)} 
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className={labelClass}>Country </label>
                    <select className={inputClass} value={form.country} onChange={e => handleChange("country", e.target.value)}>
                      <option value="">Select your country</option>
                      {countries.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Existing Website URL <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <input type="url" className={inputClass} placeholder="https://yourstore.com" value={form.website} onChange={e => handleChange("website", e.target.value)} />
                  </div>

                  <div>
                    <label className={labelClass}>Expected Monthly Customer Traffic *</label>
                    <select className={inputClass} value={form.traffic} onChange={e => handleChange("traffic", e.target.value)}>
                      <option value="">Select range</option>
                      {trafficOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>How did you hear about Ketra? *</label>
                    <select className={inputClass} value={form.hearAbout} onChange={e => handleChange("hearAbout", e.target.value)}>
                      <option value="">Select one</option>
                      {hearAboutOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-4 rounded-xl font-body font-semibold text-sm tracking-wider uppercase text-accent-foreground bg-accent hover:bg-accent/90 disabled:opacity-70 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit Registration"}
                  </button>
                </form>

                <div className="text-center mt-8">
                  <p className="text-muted-foreground font-body text-sm">
                    Already a vendor?{" "}
                    <Link to="/vendor/login" className="text-accent hover:underline">Log in here</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="thankyou"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="p-10 md:p-14 rounded-2xl glass text-center"
              >
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
                    <Check size={36} className="text-emerald-500" />
                  </motion.div>
                </motion.div>

                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-3">
                  Thank You for Registering!
                </h2>
                <p className="text-muted-foreground font-body text-base leading-relaxed max-w-md mx-auto mb-8">
                  Our team will personally contact you within 24 hours to discuss your custom plan.
                </p>

                <div className="space-y-2 text-left max-w-sm mx-auto p-5 rounded-xl bg-secondary/60 border border-border/50">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Store Name</span>
                    <span className="text-foreground font-medium">{form.storeName}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground font-medium">{form.email}</span>
                  </div>
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 mt-8 text-accent hover:underline font-body text-sm"
                >
                  <ArrowLeft size={16} /> Back to Home
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VendorPage;
