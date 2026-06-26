import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useSessions } from "@/hooks/useSessions";
import { useModels } from "@/hooks/useModels";
import { fetchSession } from "@/services/api";
import type { AnalysisReport } from "@/types";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function SessionCard({
  session,
  index,
  onOpen,
}: {
  session: { session_id: string; idea: string; created_at: string; has_results: boolean };
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onOpen}
      className="group p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-indigo-500/30 hover:bg-white/5 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
            {session.idea}
          </p>
          <p className="text-xs text-slate-600 mt-1">{formatDate(session.created_at)}</p>
        </div>
        {session.has_results && (
          <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Complete
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 group-hover:text-slate-500 transition-colors">
        <span>View report</span>
        <svg className="w-3 h-3 -translate-x-0.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </motion.div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { sessions, loading, refresh } = useSessions();
  const { selectedModel, models } = useModels();
  const activeModelName = models.find((m) => m.id === selectedModel)?.name ?? "";

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function openSession(sessionId: string) {
    try {
      const report: AnalysisReport = await fetchSession(sessionId);
      navigate("/analyze", {
        state: {
          idea: report.idea,
          model: selectedModel,
          existingReport: report,
        },
      });
    } catch {
      navigate("/analyze", { state: { idea: sessions.find(s => s.session_id === sessionId)?.idea ?? "", model: selectedModel } });
    }
  }

  return (
    <div className="min-h-screen mesh-bg">
      <Header modelBadge={activeModelName} />

      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-500">Your recent startup analyses</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Analyses Run", value: sessions.length.toString(), icon: "⚡" },
            { label: "Completed", value: sessions.filter((s) => s.has_results).length.toString(), icon: "✅" },
            { label: "AI Model", value: models.find((m) => m.id === selectedModel)?.name?.split(" ").slice(0, 2).join(" ") ?? "—", icon: "🤖" },
            { label: "Powered By", value: "GMI Cloud", icon: "☁️" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/3 border border-white/8">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* New analysis CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate("/")}
          className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 hover:border-indigo-500/50 hover:from-indigo-600/30 hover:to-purple-600/30 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">New Analysis</p>
                <p className="text-xs text-slate-500">Analyze a new startup idea</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors -translate-x-0.5 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </motion.button>

        {/* Sessions list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Recent Projects
            </h2>
            {sessions.length > 0 && (
              <button
                onClick={refresh}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Refresh
              </button>
            )}
          </div>

          <AnimatePresence>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/3 border border-white/8 animate-pulse" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="text-5xl mb-4">📋</div>
                <p className="text-slate-500 font-medium">No analyses yet</p>
                <p className="text-slate-600 text-sm mt-1">Run your first startup analysis to see it here</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors"
                >
                  Start Analyzing
                </button>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {sessions.map((session, i) => (
                  <SessionCard
                    key={session.session_id}
                    session={session}
                    index={i}
                    onOpen={() => openSession(session.session_id)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-slate-700">
            LaunchPilot AI · Powered by{" "}
            <a href="https://gmi-serving.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-colors font-medium">
              GMI Cloud
            </a>
            {" "}· Beta AI Agent Hackathon 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
}
