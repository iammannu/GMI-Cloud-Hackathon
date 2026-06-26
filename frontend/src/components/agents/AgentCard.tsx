import { motion, AnimatePresence } from "framer-motion";
import type { AgentState, AgentId } from "@/types";

const AGENT_META: Record<AgentId, { emoji: string; color: string; description: string; gradient: string }> = {
  CEO: {
    emoji: "👔",
    color: "indigo",
    description: "Vision, mission & strategy",
    gradient: "from-indigo-600 to-blue-600",
  },
  "Market Research": {
    emoji: "📊",
    color: "purple",
    description: "Market size & competitors",
    gradient: "from-purple-600 to-violet-600",
  },
  "Product Manager": {
    emoji: "🗺️",
    color: "cyan",
    description: "MVP & feature roadmap",
    gradient: "from-cyan-600 to-teal-600",
  },
  "Technical Architect": {
    emoji: "🏗️",
    color: "blue",
    description: "Tech stack & architecture",
    gradient: "from-blue-600 to-indigo-600",
  },
  Growth: {
    emoji: "🚀",
    color: "emerald",
    description: "GTM & marketing plan",
    gradient: "from-emerald-600 to-green-600",
  },
  Investor: {
    emoji: "💰",
    color: "amber",
    description: "Funding & investor pitch",
    gradient: "from-amber-600 to-orange-600",
  },
};

const STATUS_CONFIG = {
  waiting: { label: "Waiting", textColor: "text-slate-500", ringColor: "ring-slate-500/20" },
  thinking: { label: "Thinking...", textColor: "text-indigo-400", ringColor: "ring-indigo-500/40" },
  done: { label: "Done", textColor: "text-emerald-400", ringColor: "ring-emerald-500/30" },
  error: { label: "Error", textColor: "text-red-400", ringColor: "ring-red-500/30" },
};

interface AgentCardProps {
  agent: AgentState;
  isActive: boolean;
  index: number;
}

export function AgentCard({ agent, isActive, index }: AgentCardProps) {
  const meta = AGENT_META[agent.name];
  const statusConf = STATUS_CONFIG[agent.status];
  const elapsed =
    agent.startedAt && agent.completedAt
      ? ((agent.completedAt - agent.startedAt) / 1000).toFixed(1)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isActive
          ? "border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
          : agent.status === "done"
          ? "border-emerald-500/20 bg-emerald-500/3"
          : agent.status === "error"
          ? "border-red-500/20 bg-red-500/3"
          : "border-white/8 bg-white/3"
      }`}
    >
      {isActive && (
        <motion.div
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <div className="p-3 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-sm
            ${agent.status === "waiting" ? "opacity-40" : "opacity-100"}`}
        >
          {meta.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className={`text-sm font-medium truncate ${agent.status === "waiting" ? "text-slate-500" : "text-white"}`}>
              {agent.name}
            </span>
            {elapsed && agent.status === "done" && (
              <span className="text-xs text-slate-600 flex-shrink-0">{elapsed}s</span>
            )}
          </div>
          <p className="text-xs text-slate-600 truncate mt-0.5">{meta.description}</p>
        </div>

        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            {agent.status === "thinking" ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-5 h-5"
              >
                <svg className="animate-spin w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </motion.div>
            ) : agent.status === "done" ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </motion.div>
            ) : agent.status === "error" ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              </motion.div>
            ) : (
              <motion.div key="waiting" className="w-5 h-5 rounded-full border-2 border-slate-700/60" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
