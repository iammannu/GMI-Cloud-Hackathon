import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    background: "#0a0a0f",
    primaryColor: "#6366f1",
    primaryTextColor: "#f1f5f9",
    primaryBorderColor: "#4338ca",
    lineColor: "#475569",
    secondaryColor: "#1e1b4b",
    tertiaryColor: "#111118",
    edgeLabelBackground: "#1a1a27",
    clusterBkg: "#111118",
    titleColor: "#f1f5f9",
    attributeBackgroundColorEven: "#111118",
    attributeBackgroundColorOdd: "#0f0f1a",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 15,
  },
});

let mermaidId = 0;

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${++mermaidId}`);

  useEffect(() => {
    if (!chart) return;

    let cancelled = false;

    async function render() {
      try {
        const cleanChart = chart.trim().replace(/\\n/g, "\n");
        const { svg: rendered } = await mermaid.render(idRef.current, cleanChart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Unable to render diagram");
          console.warn("Mermaid render error:", e);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className={`rounded-xl bg-white/3 border border-white/8 p-4 ${className}`}>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </svg>
          <span>Architecture diagram generation pending</span>
        </div>
        <pre className="mt-2 text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className={`rounded-xl bg-white/3 border border-white/8 p-8 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Rendering architecture diagram...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mermaid-container rounded-xl bg-white/3 border border-white/8 p-4 overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
