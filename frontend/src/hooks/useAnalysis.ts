import { useState, useCallback, useRef } from "react";
import { streamAnalysis } from "@/services/api";
import type { AgentState, AgentId, AnalysisReport, SSEEvent } from "@/types";

const AGENT_ORDER: AgentId[] = [
  "CEO",
  "Market Research",
  "Product Manager",
  "Technical Architect",
  "Growth",
  "Investor",
];

const initialAgents = (): AgentState[] =>
  AGENT_ORDER.map((name) => ({
    id: name,
    name,
    status: "waiting",
    streamedContent: "",
    output: null,
  }));

export function useAnalysis() {
  const [agents, setAgents] = useState<AgentState[]>(initialAgents());
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setAgents(initialAgents());
    setIsRunning(false);
    setSessionId(null);
    setReport(null);
    setError(null);
    setActiveAgent(null);
  }, []);

  const updateAgent = useCallback((name: AgentId, patch: Partial<AgentState>) => {
    setAgents((prev) =>
      prev.map((a) => (a.name === name ? { ...a, ...patch } : a))
    );
  }, []);

  const handleEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.type) {
        case "session_created":
          if (event.session_id) setSessionId(event.session_id);
          break;

        case "agent_start":
          if (event.agent) {
            setActiveAgent(event.agent);
            updateAgent(event.agent, {
              status: "thinking",
              startedAt: Date.now(),
              streamedContent: "",
            });
          }
          break;

        case "chunk":
          if (event.agent && event.content) {
            updateAgent(event.agent, {});
            setAgents((prev) =>
              prev.map((a) =>
                a.name === event.agent
                  ? { ...a, streamedContent: a.streamedContent + event.content }
                  : a
              )
            );
          }
          break;

        case "agent_done":
          if (event.agent) {
            updateAgent(event.agent, {
              status: "done",
              output: event.data,
              completedAt: Date.now(),
            });
          }
          break;

        case "complete":
          if (event.data) {
            setReport(event.data as AnalysisReport);
          }
          setIsRunning(false);
          setActiveAgent(null);
          break;

        case "error":
          if (event.agent) {
            updateAgent(event.agent, { status: "error" });
          }
          setError(event.error ?? "An error occurred");
          setIsRunning(false);
          break;

        case "stream_end":
          setIsRunning(false);
          break;
      }
    },
    [updateAgent]
  );

  const run = useCallback(
    async (idea: string, model: string | null) => {
      reset();
      setIsRunning(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamAnalysis(idea, model, handleEvent, controller.signal);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError((e as Error).message ?? "Something went wrong");
          setIsRunning(false);
        }
      }
    },
    [reset, handleEvent]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsRunning(false);
  }, []);

  return {
    agents,
    isRunning,
    sessionId,
    report,
    error,
    activeAgent,
    run,
    stop,
    reset,
  };
}
