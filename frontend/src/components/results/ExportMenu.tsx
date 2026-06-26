import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToPDF, exportToMarkdown, exportToJSON } from "@/utils/export";
import type { AnalysisReport } from "@/types";

interface ExportMenuProps {
  report: AnalysisReport;
  contentRef?: React.RefObject<HTMLDivElement>;
}

export function ExportMenu({ report, contentRef }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handle(type: string) {
    setExporting(type);
    setOpen(false);
    try {
      if (type === "pdf" && contentRef?.current) {
        await exportToPDF(contentRef.current, report.idea);
      } else if (type === "markdown") {
        exportToMarkdown(report);
      } else if (type === "json") {
        exportToJSON(report);
      } else if (type === "copy") {
        await navigator.clipboard.writeText(exportToMarkdown(report, true));
      }
    } finally {
      setExporting(null);
    }
  }

  const items = [
    { id: "pdf", label: "Export PDF", icon: "📄", desc: "Full report as PDF" },
    { id: "markdown", label: "Export Markdown", icon: "📝", desc: "Raw markdown file" },
    { id: "json", label: "Export JSON", icon: "{ }", desc: "Structured data" },
    { id: "copy", label: "Copy to Clipboard", icon: "📋", desc: "Markdown format" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-slate-300 font-medium"
      >
        {exporting ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}
        Export
        <svg className={`w-3 h-3 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
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
            className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-700 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="p-1.5">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handle(item.id)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
