import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { AnalysisReport } from "@/types";

export async function exportToPDF(element: HTMLElement, title: string): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: "#0a0a0f",
    scale: 2,
    useCORS: true,
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = imgWidth / imgHeight;
  const pdfImgWidth = pdfWidth;
  const pdfImgHeight = pdfWidth / ratio;

  let heightLeft = pdfImgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfImgWidth, pdfImgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - pdfImgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfImgWidth, pdfImgHeight);
    heightLeft -= pdfHeight;
  }

  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  pdf.save(`launchpilot_${safeTitle}.pdf`);
}

export function exportToMarkdown(report: AnalysisReport, returnString?: boolean): string | void {
  const lines: string[] = [];
  const { ceo, market, product, architect, growth, investor } = report;

  lines.push(`# LaunchPilot AI Report`);
  lines.push(`**Idea:** ${report.idea}`);
  lines.push(`**Generated:** ${new Date().toLocaleString()}`);
  lines.push(`**Powered by:** GMI Cloud\n`);
  lines.push("---\n");

  if (ceo) {
    lines.push(`## 👔 Business Foundation\n`);
    lines.push(`### Elevator Pitch\n${ceo.elevator_pitch}\n`);
    lines.push(`### Vision\n${ceo.vision}\n`);
    lines.push(`### Mission\n${ceo.mission}\n`);
    lines.push(`### Value Proposition\n${ceo.value_proposition}\n`);
    lines.push(`### Target Customer\n${ceo.target_customer}\n`);
    lines.push(`### Business Model\n${ceo.business_model}\n`);
    lines.push(`### Revenue Streams\n${ceo.revenue_streams?.map((r) => `- ${r}`).join("\n")}\n`);
    lines.push("---\n");
  }

  if (market) {
    lines.push(`## 📊 Market Research\n`);
    lines.push(`| Metric | Value |`);
    lines.push(`|--------|-------|`);
    lines.push(`| TAM | ${market.tam} |`);
    lines.push(`| SAM | ${market.sam} |`);
    lines.push(`| SOM | ${market.som} |\n`);

    if (market.competitors?.length) {
      lines.push(`### Competitors\n`);
      market.competitors.forEach((c) => {
        lines.push(`**${c.name}** — ${c.description}`);
        lines.push(`- Pricing: ${c.pricing}`);
        lines.push(`- Strengths: ${c.strengths?.join(", ")}`);
        lines.push(`- Weaknesses: ${c.weaknesses?.join(", ")}\n`);
      });
    }

    if (market.swot) {
      lines.push(`### SWOT Analysis\n`);
      lines.push(`**Strengths:** ${market.swot.strengths?.join(" · ")}`);
      lines.push(`**Weaknesses:** ${market.swot.weaknesses?.join(" · ")}`);
      lines.push(`**Opportunities:** ${market.swot.opportunities?.join(" · ")}`);
      lines.push(`**Threats:** ${market.swot.threats?.join(" · ")}\n`);
    }
    lines.push("---\n");
  }

  if (product) {
    lines.push(`## 🗺️ Product Plan\n`);
    if (product.mvp_features?.length) {
      lines.push(`### MVP Features\n`);
      product.mvp_features.forEach((f) => {
        lines.push(`**${f.feature}** [${f.priority}] [${f.impact} Impact]`);
        lines.push(`${f.description}\n`);
      });
    }
    if (product.full_roadmap?.length) {
      lines.push(`### Roadmap\n`);
      product.full_roadmap.forEach((p) => {
        lines.push(`#### ${p.phase}`);
        lines.push(`*${p.theme}* — 🎯 ${p.milestone}`);
        lines.push(p.features?.map((f) => `- ${f}`).join("\n") + "\n");
      });
    }
    lines.push("---\n");
  }

  if (architect) {
    lines.push(`## 🏗️ Technical Architecture\n`);
    lines.push(`### System Overview\n${architect.system_architecture}\n`);
    if (architect.tech_stack) {
      lines.push(`### Tech Stack\n`);
      Object.entries(architect.tech_stack).forEach(([k, v]) => {
        lines.push(`- **${k}:** ${v}`);
      });
      lines.push("");
    }
    if (architect.mermaid_diagram) {
      lines.push("### Architecture Diagram\n```mermaid");
      lines.push(architect.mermaid_diagram);
      lines.push("```\n");
    }
    lines.push("---\n");
  }

  if (growth) {
    lines.push(`## 🚀 Growth & GTM\n`);
    lines.push(`### Go-to-Market\n${growth.go_to_market}\n`);
    if (growth.kpis?.length) {
      lines.push(`### KPI Targets\n`);
      growth.kpis.forEach((k) => lines.push(`- ${k}`));
      lines.push("");
    }
    if (growth.launch_strategy?.length) {
      lines.push(`### Launch Strategy\n`);
      growth.launch_strategy.forEach((p) => {
        lines.push(`**${p.phase}** — 🎯 ${p.goal}`);
        lines.push(p.actions?.map((a) => `- ${a}`).join("\n") + "\n");
      });
    }
    lines.push("---\n");
  }

  if (investor) {
    lines.push(`## 💰 Investor Analysis\n`);
    lines.push(`**Fundability Score:** ${investor.fundability_score}/100`);
    lines.push(`**Stage:** ${investor.stage_recommendation}`);
    lines.push(`**Recommended Raise:** ${investor.funding_amount}\n`);
    lines.push(`### Investment Thesis\n${investor.investment_thesis}\n`);
    if (investor.ninety_day_plan?.length) {
      lines.push(`### 90-Day Plan\n`);
      investor.ninety_day_plan.forEach((p) => {
        lines.push(`**${p.days} — ${p.focus}** (🎯 ${p.milestone})`);
        lines.push(p.actions?.map((a) => `- ${a}`).join("\n") + "\n");
      });
    }
    lines.push("---\n");
  }

  lines.push(`\n*Generated by LaunchPilot AI · Powered by GMI Cloud*`);

  const content = lines.join("\n");

  if (returnString) return content;

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `launchpilot_${report.idea.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(report: AnalysisReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `launchpilot_${report.session_id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
