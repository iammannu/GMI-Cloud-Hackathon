import { motion } from "framer-motion";
import { AgentCard } from "./AgentCard";
import type { AgentState } from "@/types";

interface AgentWorkflowProps {
  agents: AgentState[];
  activeAgent: string | null;
  isRunning: boolean;
}

export function AgentWorkflow({ agents, activeAgent, isRunning }: AgentWorkflowProps) {
  const doneCount = agents.filter((a) => a.status === "done").length;
  const totalCount = agents.length;
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          AI Agents
        </h3>
        <span className="text-xs text-slate-600">
          {doneCount}/{totalCount} complete
        </span>
      </div>

      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        {isRunning && (
          <motion.div
            className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["0%", "500%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="space-y-2">
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isActive={activeAgent === agent.name}
            index={index}
          />
        ))}
      </div>

      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-slate-500 mt-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
          AI agents are working in real time via GMI Cloud
        </motion.div>
      )}
    </div>
  );
}
