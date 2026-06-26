import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ModelSelector } from "@/components/ui/ModelSelector";
import { useModels } from "@/hooks/useModels";

const DEMO_IDEAS = [
  "AI recruiting platform that matches candidates using machine learning",
  "SaaS tool for managing remote teams with async video updates",
  "Marketplace connecting freelance designers with startups",
  "AI-powered legal document review for small businesses",
  "Subscription box service for indie coffee roasters",
  "No-code tool to build custom CRM workflows",
];

const FEATURES = [
  { icon: "👔", title: "CEO Strategy", desc: "Vision, mission & business model" },
  { icon: "📊", title: "Market Intel", desc: "TAM/SAM/SOM & competitor analysis" },
  { icon: "🗺️", title: "Product Roadmap", desc: "MVP features & user stories" },
  { icon: "🏗️", title: "Tech Architecture", desc: "Full stack & system diagrams" },
  { icon: "🚀", title: "Growth Plan", desc: "GTM strategy & launch playbook" },
  { icon: "💰", title: "Investor Pitch", desc: "Fundability score & 90-day plan" },
];

export function LandingPage() {
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();
  const { models, selectedModel, selectModel, loading: modelsLoading } = useModels();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % DEMO_IDEAS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim() || isSubmitting) return;
    setIsSubmitting(true);
    navigate("/analyze", { state: { idea: idea.trim(), model: selectedModel } });
  }

  function useDemoIdea(demoIdea: string) {
    setIdea(demoIdea);
    textareaRef.current?.focus();
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Beta AI Agent Hackathon — Powered by GMI Cloud
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 text-balance">
            Turn your idea into a{" "}
            <span className="gradient-text">startup plan</span>
            <br />in 90 seconds.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto text-balance">
            Six specialized AI agents analyze your startup idea and produce a complete business plan —
            from market research to investor pitch — in real time.
          </p>

          {/* Input Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="relative rounded-2xl bg-white/5 border border-white/15 focus-within:border-indigo-500/60 focus-within:bg-white/8 transition-all duration-200 shadow-2xl shadow-black/30">
              <textarea
                ref={textareaRef}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={3}
                className="w-full bg-transparent text-white placeholder-slate-600 text-base p-5 pr-4 pb-16 resize-none focus:outline-none rounded-2xl"
                placeholder={DEMO_IDEAS[placeholderIndex]}
              />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3">
                <ModelSelector
                  models={models}
                  selected={selectedModel}
                  onSelect={selectModel}
                  loading={modelsLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!idea.trim() || isSubmitting}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: idea.trim() ? 1.02 : 1 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  Analyze
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 text-center">
              Press Enter to analyze · Shift+Enter for new line
            </p>
          </motion.form>

          {/* Demo ideas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {DEMO_IDEAS.slice(0, 3).map((demo, i) => (
              <button
                key={i}
                onClick={() => useDemoIdea(demo)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-xs text-slate-500 hover:text-slate-300 transition-all"
              >
                {demo.slice(0, 40)}…
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="w-full max-w-5xl mx-auto mt-24"
        >
          <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-8 font-medium">
            Six specialized AI agents
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.06 }}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-indigo-500/30 hover:bg-white/5 transition-all duration-200"
              >
                <span className="text-2xl mb-2.5">{feature.icon}</span>
                <p className="text-sm font-semibold text-white mb-1">{feature.title}</p>
                <p className="text-xs text-slate-600 leading-snug">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">LaunchPilot AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <span>Powered by</span>
            <a
              href="https://gmi-serving.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
            >
              GMI Cloud
            </a>
            <span>·</span>
            <span>Beta AI Agent Hackathon 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
