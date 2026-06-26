import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GmiModel } from "@/types";

interface ModelSelectorProps {
  models: GmiModel[];
  selected: string;
  onSelect: (id: string) => void;
  loading?: boolean;
}

const PROVIDER_COLORS: Record<string, string> = {
  Meta: "text-blue-400",
  Alibaba: "text-orange-400",
  DeepSeek: "text-cyan-400",
  Google: "text-green-400",
};

export function ModelSelector({ models, selected, onSelect, loading }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m.id === selected);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-48 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/8 transition-all text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="text-slate-300 font-medium truncate max-w-[150px]">
          {selectedModel?.name ?? "Select model"}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-surface-700 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="p-2 border-b border-white/8">
              <p className="text-xs text-slate-500 px-2 py-1 font-medium uppercase tracking-wider">
                GMI Cloud Models
              </p>
            </div>
            <div className="p-1.5 max-h-72 overflow-y-auto">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelect(model.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group ${
                    model.id === selected
                      ? "bg-indigo-500/20 border border-indigo-500/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{model.name}</span>
                        {model.id === selected && (
                          <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{model.description}</p>
                    </div>
                    <span className={`text-xs font-medium flex-shrink-0 ${PROVIDER_COLORS[model.provider] ?? "text-slate-400"}`}>
                      {model.provider}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-white/8 bg-white/2">
              <p className="text-xs text-slate-600 text-center">All models run on GMI Cloud</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
