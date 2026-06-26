# AgentBox Listing — LaunchPilot AI

## Publishing Instructions

Follow these steps to list LaunchPilot AI on [AgentBox](https://agentbox.ai).

---

## Agent Profile

| Field | Value |
|-------|-------|
| **Agent Name** | LaunchPilot AI |
| **Tagline** | Turn any startup idea into a launch-ready business plan in 90 seconds |
| **Category** | Business & Strategy |
| **Subcategory** | Startup Tools |
| **Pricing** | Freemium |
| **Logo** | Use the LaunchPilot star icon (public/icon.svg) |

---

## Description (Short)

LaunchPilot AI deploys six specialized AI agents that analyze your startup idea and produce a complete business plan in real time — from CEO strategy to investor pitch.

## Description (Long)

LaunchPilot AI is an AI-powered startup analyst that transforms any one-sentence idea into a comprehensive, investor-ready business plan in under 2 minutes.

**Six specialized agents work in parallel:**

- **CEO Agent** — Defines vision, mission, value proposition, and business model
- **Market Research Agent** — Analyzes TAM/SAM/SOM, competitors, SWOT, and pricing
- **Product Manager Agent** — Produces MVP feature list, roadmap, and user stories
- **Technical Architect Agent** — Designs full tech stack with system architecture diagrams
- **Growth Agent** — Creates GTM strategy, SEO plan, and 90-day launch playbook
- **Investor Agent** — Scores fundability (0-100), identifies risks, and writes investment thesis

**Output includes:**
- Business summary & elevator pitch
- Full competitor analysis
- Product roadmap
- System architecture diagram (Mermaid)
- Marketing & launch strategy
- Investor pitch with 90-day action plan
- Export to PDF, Markdown, or JSON

Powered by GMI Cloud's high-performance AI inference infrastructure.

---

## Example Prompts

1. `I want to build an AI recruiting platform that matches candidates using machine learning`
2. `A SaaS tool for remote teams to do async video standups instead of meetings`
3. `Marketplace connecting indie coffee roasters directly with coffee lovers`
4. `No-code tool that lets non-technical founders build custom CRM workflows`
5. `AI-powered legal document review service for small businesses`

---

## API / Live URL

Set the live URL to your deployed GMI Cloud instance:

```
https://your-app.gmi-cloud.app
```

---

## Capabilities

- ✅ Real-time streaming responses
- ✅ Multi-agent AI pipeline (6 agents)
- ✅ Structured JSON output
- ✅ Export PDF / Markdown / JSON
- ✅ Multiple GMI Cloud model options
- ✅ Guest mode (no login required)
- ✅ Session history

---

## Technical Details

- **AI Provider:** GMI Cloud (OpenAI-compatible API)
- **Models:** Llama 3.3 70B, Qwen 2.5 72B, DeepSeek R1, Gemma 3 27B
- **Backend:** Python / FastAPI / LangGraph
- **Frontend:** React / TypeScript / Vite
- **Streaming:** Server-Sent Events (SSE)

---

## Marketplace Tags

`ai`, `startup`, `business-plan`, `market-research`, `product-management`, `investors`, `gmi-cloud`, `llama`, `multi-agent`
