import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AgentWorkflow } from "@/components/agents/AgentWorkflow";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { Header } from "@/components/layout/Header";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useModels } from "@/hooks/useModels";

import type { AnalysisReport } from "@/types";

interface LocationState {
  idea: string;
  model: string;
  existingReport?: AnalysisReport;
}

export function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const hasStarted = useRef(false);
  const { agents, isRunning, report, error, activeAgent, run, stop, reset } = useAnalysis();
  const { models, selectedModel, selectModel } = useModels();

  const idea = state?.idea ?? "";
  const model = state?.model ?? selectedModel;

  useEffect(() => {
    if (!idea) {
      navigate("/");
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;
    if (state?.existingReport) {
      // Load existing report without re-running
      return;
    }
    run(idea, model);
  }, [idea, model, navigate, run, state?.existingReport]);

  function handleNewAnalysis() {
    reset();
    navigate("/");
  }

  const activeModelName = models.find((m) => m.id === model)?.name ?? model;

  if (!idea) return null;

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <Header modelBadge={activeModelName} />

      <div className="flex-1 flex flex-col pt-14">
        {/* Sub-header */}
        <div className="border-b border-white/8 bg-surface-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleNewAnalysis}
                className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <p className="text-sm text-slate-400 truncate">
                <span className="text-slate-600">Analyzing: </span>
                <span className="text-white">{idea}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {isRunning && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={stop}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                >
                  Stop
                </motion.button>
              )}
              {report && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleNewAnalysis}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors"
                >
                  New Analysis
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex gap-6 h-[calc(100vh-112px)]">
          {/* Left sidebar — agents */}
          <div className="w-64 xl:w-72 flex-shrink-0 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-white/3 border border-white/10 p-4 flex-1 overflow-y-auto"
            >
              <AgentWorkflow
                agents={agents}
                activeAgent={activeAgent}
                isRunning={isRunning}
              />
            </motion.div>

            {/* GMI Cloud badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 p-3 rounded-xl bg-white/3 border border-white/8 text-center"
            >
              <p className="text-xs text-slate-600">Powered by</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">GMI Cloud AI</p>
              <p className="text-[10px] text-slate-600 mt-0.5 truncate">{model}</p>
            </motion.div>
          </div>

          {/* Right panel — results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-0 rounded-2xl bg-white/3 border border-white/10 p-6 overflow-hidden"
          >
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Analysis Error</p>
                  <p className="text-sm text-slate-500 max-w-sm">{error}</p>
                </div>
                <button
                  onClick={() => run(idea, model)}
                  className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ResultsPanel
                report={report ?? state?.existingReport ?? null}
                agents={agents}
                idea={idea}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
