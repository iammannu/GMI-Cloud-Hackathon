# LaunchPilot AI

**Turn any startup idea into a launch-ready business in under two minutes.**

LaunchPilot AI deploys six specialized AI agents that collaborate to produce a complete startup plan — from business strategy to technical architecture to investor pitch — all in real time.

---

## Live Demo

Enter one sentence: _"I want to build an AI recruiting platform."_

Watch as six agents work simultaneously:
- **CEO Agent** — Vision, mission, value proposition
- **Market Research Agent** — Competitors, market size, SWOT
- **Product Manager Agent** — MVP, feature roadmap, user stories
- **Technical Architect Agent** — Tech stack, system architecture, Mermaid diagrams
- **Growth Agent** — Marketing strategy, SEO, launch plan
- **Investor Agent** — Funding readiness, risk analysis, pitch deck

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- GMI Cloud API key

### 1. Clone and configure

```bash
git clone <repo-url>
cd launchpilot-ai
cp .env.example .env
# Edit .env and add your GMI_API_KEY
```

### 2. Run with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 3. Local development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Framer Motion |
| Backend | Python 3.11, FastAPI, LangGraph, LangChain |
| AI | GMI Cloud (OpenAI-compatible), Llama 3.3 70B |
| Infrastructure | Docker, Nginx |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│         (Vite + TailwindCSS + Framer Motion)    │
└────────────────────┬────────────────────────────┘
                     │ SSE / REST
┌────────────────────▼────────────────────────────┐
│               FastAPI Backend                    │
│  ┌──────────────────────────────────────────┐   │
│  │           LangGraph Orchestrator          │   │
│  │  CEO → Market → PM → Architect →          │   │
│  │  Growth → Investor                        │   │
│  └──────────────────────────────────────────┘   │
│                     │                           │
│              GMI Cloud API                      │
│         (Llama 3.3 70B Instruct)                │
└─────────────────────────────────────────────────┘
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GMI_API_KEY` | GMI Cloud API key | **required** |
| `GMI_BASE_URL` | GMI Cloud endpoint | `https://api.gmi-serving.com/v1` |
| `GMI_MODEL` | Model to use | `meta-llama/Llama-3.3-70B-Instruct` |
| `LLM_TEMPERATURE` | Response creativity | `0.7` |
| `LLM_MAX_TOKENS` | Max tokens per agent | `4096` |

---

## AgentBox Deployment

1. Push Docker image to a public registry
2. Visit [AgentBox](https://agentbox.ai) and create a new agent
3. Set the public URL as the agent endpoint
4. Configure the agent description and capabilities
5. Publish

---

## GMI Cloud Deployment

```bash
# Build and tag images
docker build -t launchpilot-backend -f backend/Dockerfile .
docker build -t launchpilot-frontend -f frontend/Dockerfile .

# Push to GMI Cloud registry
docker tag launchpilot-backend registry.gmi-serving.com/<org>/launchpilot-backend:latest
docker push registry.gmi-serving.com/<org>/launchpilot-backend:latest

# Deploy via GMI Cloud dashboard or CLI
gmi deploy --config docker-compose.yml
```

---

## License

MIT
