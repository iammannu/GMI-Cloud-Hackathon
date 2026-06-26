import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MermaidDiagram } from "./MermaidDiagram";
import { ExportMenu } from "./ExportMenu";
import { Badge } from "@/components/ui/Badge";
import type { AnalysisReport, AgentState } from "@/types";

interface ResultsPanelProps {
  report: AnalysisReport | null;
  agents: AgentState[];
  idea: string;
}

function SectionHeader({ icon, title, badge }: { icon: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {badge && <Badge variant="purple">{badge}</Badge>}
    </div>
  );
}

function InfoCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className={`p-4 rounded-xl bg-white/3 border border-white/8 ${accent ? `border-l-2 border-l-${accent}-500` : ""}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-sm text-slate-200 leading-relaxed">{value}</p>
    </div>
  );
}

function TagList({ items, color = "indigo" }: { items: string[]; color?: string }) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    red: "bg-red-500/10 text-red-300 border border-red-500/20",
    cyan: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
  };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colorMap[color] ?? colorMap.indigo}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function FundabilityScore({ score }: { score: number }) {
  const color = score >= 70 ? "emerald" : score >= 50 ? "amber" : "red";
  const colorClass = {
    emerald: "text-emerald-400 border-emerald-500",
    amber: "text-amber-400 border-amber-500",
    red: "text-red-400 border-red-500",
  }[color];
  const label = score >= 70 ? "Fundable" : score >= 50 ? "Needs Work" : "Not Ready";

  return (
    <div className="flex items-center gap-6">
      <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-4 ${colorClass} bg-white/3`}>
        <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
      </div>
      <div>
        <p className={`text-xl font-bold ${colorClass}`}>{label}</p>
        <p className="text-sm text-slate-500 mt-0.5">Fundability Score / 100</p>
        <div className="mt-3 h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-red-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

export function ResultsPanel({ report, agents, idea }: ResultsPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!report?.ceo && agents.every((a) => a.status === "waiting")) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-3xl">
          🚀
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Ready to Launch</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Enter your startup idea and watch six AI agents build your complete business plan in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {report && (
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Analysis Report</h2>
            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">"{idea}"</p>
          </div>
          <ExportMenu report={report} contentRef={contentRef} />
        </div>
      )}

      <div ref={contentRef} className="space-y-8 overflow-y-auto flex-1 pr-1">

        {/* CEO Section */}
        <AnimatePresence>
          {report?.ceo && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-indigo-500/20 p-6"
            >
              <SectionHeader icon="👔" title="Business Foundation" badge="CEO Agent" />

              <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <p className="text-xs text-indigo-400 uppercase tracking-wider mb-2 font-medium">Elevator Pitch</p>
                <p className="text-white text-sm leading-relaxed font-medium">{report.ceo.elevator_pitch}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <InfoCard label="Vision" value={report.ceo.vision} />
                <InfoCard label="Mission" value={report.ceo.mission} />
                <InfoCard label="Value Proposition" value={report.ceo.value_proposition} />
                <InfoCard label="Target Customer" value={report.ceo.target_customer} />
                <InfoCard label="Business Model" value={report.ceo.business_model} />
                <InfoCard label="Strategy" value={report.ceo.business_strategy} />
              </div>

              {report.ceo.revenue_streams?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Revenue Streams</p>
                  <TagList items={report.ceo.revenue_streams} color="indigo" />
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Market Research Section */}
        <AnimatePresence>
          {report?.market && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-purple-500/20 p-6"
            >
              <SectionHeader icon="📊" title="Market Research" badge="Market Agent" />

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "TAM", value: report.market.tam, color: "bg-purple-500/10 border-purple-500/20 text-purple-300" },
                  { label: "SAM", value: report.market.sam, color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" },
                  { label: "SOM", value: report.market.som, color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" },
                ].map((item) => (
                  <div key={item.label} className={`p-3 rounded-xl border ${item.color}`}>
                    <p className="text-xs font-bold opacity-70 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold leading-tight">{item.value}</p>
                  </div>
                ))}
              </div>

              {report.market.competitors?.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-white mb-3">Competitors</p>
                  <div className="space-y-3">
                    {report.market.competitors.map((comp, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/3 border border-white/8">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-medium text-sm text-white">{comp.name}</span>
                          <span className="text-xs text-slate-500 flex-shrink-0">{comp.pricing}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{comp.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-emerald-500 font-medium mb-1">Strengths</p>
                            <ul className="space-y-0.5">
                              {comp.strengths?.slice(0, 2).map((s, j) => (
                                <li key={j} className="text-xs text-slate-400">• {s}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-red-400 font-medium mb-1">Weaknesses</p>
                            <ul className="space-y-0.5">
                              {comp.weaknesses?.slice(0, 2).map((w, j) => (
                                <li key={j} className="text-xs text-slate-400">• {w}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.market.swot && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-3">SWOT Analysis</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "strengths", label: "Strengths", color: "emerald" },
                      { key: "weaknesses", label: "Weaknesses", color: "red" },
                      { key: "opportunities", label: "Opportunities", color: "cyan" },
                      { key: "threats", label: "Threats", color: "amber" },
                    ].map(({ key, label, color }) => {
                      const colorClasses: Record<string, string> = {
                        emerald: "border-emerald-500/20 bg-emerald-500/5",
                        red: "border-red-500/20 bg-red-500/5",
                        cyan: "border-cyan-500/20 bg-cyan-500/5",
                        amber: "border-amber-500/20 bg-amber-500/5",
                      };
                      const textClasses: Record<string, string> = {
                        emerald: "text-emerald-400",
                        red: "text-red-400",
                        cyan: "text-cyan-400",
                        amber: "text-amber-400",
                      };
                      const items = report.market!.swot[key as keyof typeof report.market.swot] as string[];
                      return (
                        <div key={key} className={`p-3 rounded-xl border ${colorClasses[color]}`}>
                          <p className={`text-xs font-bold ${textClasses[color]} mb-2 uppercase tracking-wide`}>{label}</p>
                          <ul className="space-y-1">
                            {items?.slice(0, 3).map((item, i) => (
                              <li key={i} className="text-xs text-slate-400">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {report.market.market_trends?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Market Trends</p>
                  <ul className="space-y-1.5">
                    {report.market.market_trends.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-purple-400 mt-0.5 flex-shrink-0">↗</span>
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Product Manager Section */}
        <AnimatePresence>
          {report?.product && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-cyan-500/20 p-6"
            >
              <SectionHeader icon="🗺️" title="Product Plan" badge="PM Agent" />

              {report.product.mvp_features?.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-white mb-3">MVP Features</p>
                  <div className="space-y-2">
                    {report.product.mvp_features.map((feature, i) => {
                      const priorityColor = feature.priority === "P0" ? "red" : feature.priority === "P1" ? "amber" : "slate";
                      const impactColor = feature.impact === "High" ? "emerald" : feature.impact === "Medium" ? "amber" : "slate";
                      return (
                        <div key={i} className="p-3.5 rounded-xl bg-white/3 border border-white/8">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-medium text-sm text-white">{feature.feature}</span>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <Badge variant={priorityColor as "error" | "warning" | "default"}>{feature.priority}</Badge>
                              <Badge variant={impactColor as "success" | "warning" | "default"}>{feature.impact}</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{feature.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {report.product.full_roadmap?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-3">Roadmap</p>
                  <div className="space-y-3">
                    {report.product.full_roadmap.map((phase, i) => (
                      <div key={i} className="relative pl-5 border-l-2 border-indigo-500/30">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <p className="text-sm font-medium text-white">{phase.phase}</p>
                        <p className="text-xs text-indigo-400 mt-0.5">{phase.theme}</p>
                        <p className="text-xs text-emerald-400 mt-1">🎯 {phase.milestone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.product.success_metrics?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Success Metrics</p>
                  <ul className="space-y-1.5">
                    {report.product.success_metrics.map((metric, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-cyan-400 flex-shrink-0">◆</span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Architect Section */}
        <AnimatePresence>
          {report?.architect && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-blue-500/20 p-6"
            >
              <SectionHeader icon="🏗️" title="Technical Architecture" badge="Architect Agent" />

              {report.architect.system_architecture && (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 mb-5">
                  <p className="text-sm text-slate-300 leading-relaxed">{report.architect.system_architecture}</p>
                </div>
              )}

              {report.architect.tech_stack && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-white mb-3">Tech Stack</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(report.architect.tech_stack).map(([key, value]) => (
                      <div key={key} className="flex gap-2 p-2.5 rounded-lg bg-white/3 border border-white/6">
                        <span className="text-xs text-slate-500 capitalize min-w-[70px] flex-shrink-0">{key.replace(/_/g, " ")}</span>
                        <span className="text-xs text-slate-300 font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.architect.mermaid_diagram && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-white mb-3">System Architecture Diagram</p>
                  <MermaidDiagram chart={report.architect.mermaid_diagram} />
                </div>
              )}

              {report.architect.api_design?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-3">API Design</p>
                  <div className="space-y-2">
                    {report.architect.api_design.map((api, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/8">
                        <code className="text-xs text-indigo-300 font-mono">{api.endpoint}</code>
                        <p className="text-xs text-slate-500 mt-1">{api.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.architect.security_considerations?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Security</p>
                  <ul className="space-y-1.5">
                    {report.architect.security_considerations.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-blue-400 flex-shrink-0">🔒</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Growth Section */}
        <AnimatePresence>
          {report?.growth && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-emerald-500/20 p-6"
            >
              <SectionHeader icon="🚀" title="Growth & GTM" badge="Growth Agent" />

              {report.growth.go_to_market && (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-5">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2 font-medium">Go-to-Market Strategy</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{report.growth.go_to_market}</p>
                </div>
              )}

              {report.growth.marketing_channels?.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-white mb-3">Marketing Channels</p>
                  <div className="space-y-2">
                    {report.growth.marketing_channels.map((ch, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/8 flex items-start gap-3">
                        <Badge variant={ch.priority === "Primary" ? "success" : ch.priority === "Secondary" ? "info" : "default"}>
                          {ch.priority}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{ch.channel}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{ch.strategy}</p>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium flex-shrink-0">{ch.expected_cac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.growth.kpis?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-3">KPI Targets</p>
                  <div className="space-y-2">
                    {report.growth.kpis.map((kpi, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 border border-white/6">
                        <span className="text-emerald-400 font-bold text-sm min-w-[20px]">{i + 1}</span>
                        <span className="text-sm text-slate-300">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.growth.seo_strategy?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">SEO Strategy</p>
                  <div className="flex flex-wrap gap-2">
                    {report.growth.seo_strategy.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Investor Section */}
        <AnimatePresence>
          {report?.investor && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-amber-500/20 p-6"
            >
              <SectionHeader icon="💰" title="Investor Analysis" badge="Investor Agent" />

              <div className="mb-6">
                <FundabilityScore score={report.investor.fundability_score} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <InfoCard label="Stage" value={report.investor.stage_recommendation} />
                <InfoCard label="Raise" value={report.investor.funding_amount} />
              </div>

              {report.investor.investment_thesis && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 mb-5">
                  <p className="text-xs text-amber-400 uppercase tracking-wider mb-2 font-medium">Investment Thesis</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{report.investor.investment_thesis}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">Strengths</p>
                  <ul className="space-y-1.5">
                    {report.investor.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-2">Risks</p>
                  <ul className="space-y-1.5">
                    {report.investor.risks?.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-red-400 flex-shrink-0 mt-0.5">!</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {report.investor.ninety_day_plan?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-3">90-Day Action Plan</p>
                  <div className="space-y-3">
                    {report.investor.ninety_day_plan.map((phase, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-white/8 bg-white/3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-amber-400">{phase.days}</span>
                          <Badge variant="warning">{phase.focus}</Badge>
                        </div>
                        <ul className="space-y-1 mb-2">
                          {phase.actions.map((action, j) => (
                            <li key={j} className="text-xs text-slate-400">• {action}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-emerald-400">🎯 {phase.milestone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.investor.comparable_startups?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-white mb-3">Comparable Companies</p>
                  <div className="space-y-2">
                    {report.investor.comparable_startups.map((comp, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/8">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm text-white">{comp.company}</span>
                          <span className="text-xs text-amber-400 flex-shrink-0">{comp.outcome}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{comp.similarity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Streaming placeholders */}
        {!report?.ceo && agents.some((a) => a.status !== "waiting") && (
          <div className="space-y-4">
            {agents.filter((a) => a.status === "thinking").map((agent) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-white/3 border border-indigo-500/20 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-sm font-semibold text-indigo-400">{agent.name} Agent thinking...</span>
                </div>
                <div className="font-mono text-xs text-slate-500 leading-relaxed max-h-48 overflow-hidden">
                  <span className={agent.streamedContent ? "" : "streaming-cursor"}>
                    {agent.streamedContent.slice(-500)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
