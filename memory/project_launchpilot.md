---
name: project-launchpilot-ai
description: LaunchPilot AI — Beta AI Agent Hackathon project for GMI Cloud. Full-stack AI startup analyzer.
metadata:
  type: project
---

LaunchPilot AI is a full production application built for the Beta AI Agent Hackathon sponsored by GMI Cloud.

**Why:** To win the hackathon by demonstrating GMI Cloud as the AI inference backbone for a compelling multi-agent product.

**How to apply:** All AI calls must use GMI Cloud API exclusively. The app is already complete at `d:\GMI Cloud Hackathon\`.

Stack:
- Backend: Python/FastAPI/LangGraph, 6 AI agents (CEO, Market, PM, Architect, Growth, Investor)
- Frontend: React/TypeScript/Vite/TailwindCSS/Framer Motion
- AI: GMI Cloud OpenAI-compatible API — model selectable via UI or env var
- Docker: `docker compose up` to run

Key files:
- `backend/main.py` — FastAPI entrypoint
- `backend/services/llm_service.py` — GMI model list + LLM factory
- `backend/services/graph_service.py` — LangGraph orchestration
- `frontend/src/components/ui/ModelSelector.tsx` — GMI model picker
- `frontend/src/pages/LandingPage.tsx` — Hero + input
- `frontend/src/pages/AnalysisPage.tsx` — Real-time streaming UI
- `docker-compose.yml` — Full deployment config

[[feedback-no-placeholders]]
