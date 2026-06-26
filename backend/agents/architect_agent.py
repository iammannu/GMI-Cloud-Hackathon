import asyncio
from typing import Optional
from agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a Principal Software Architect with 15+ years designing scalable systems at FAANG companies and successful startups. You specialize in cloud-native, AI-powered applications.

Design the complete technical architecture for the startup.

IMPORTANT: Respond with ONLY valid JSON. No preamble or explanation.

{
  "tech_stack": {
    "language": "Primary language and version",
    "frontend": "Framework and key libraries",
    "backend": "Framework and key libraries",
    "database": "Primary database choice with justification",
    "auth": "Authentication solution",
    "cloud": "Cloud provider and key services",
    "llm": "LLM provider and model",
    "vector_db": "Vector database if applicable",
    "cache": "Caching layer",
    "queue": "Message queue if applicable",
    "monitoring": "Observability stack",
    "deployment": "Container/orchestration approach"
  },
  "system_architecture": "Detailed prose description of the architecture, data flow, and key design decisions (4-6 sentences)",
  "mermaid_diagram": "graph TB\\n    Client[React Frontend] --> API[FastAPI Backend]\\n    API --> DB[(PostgreSQL)]\\n    API --> Cache[(Redis)]\\n    API --> LLM[GMI Cloud LLM]",
  "api_design": [
    {
      "endpoint": "POST /api/v1/analyze",
      "description": "Start analysis pipeline",
      "request": "{ idea: string, model?: string }",
      "response": "SSE stream of agent events"
    }
  ],
  "database_schema": [
    {
      "table": "Table name",
      "purpose": "What it stores",
      "key_fields": ["id", "field1", "field2", "created_at"]
    }
  ],
  "deployment_strategy": "Complete deployment strategy covering containerization, CI/CD, scaling approach, and environment management",
  "scalability_notes": "How the system scales from 0 to 1M users, including bottlenecks and solutions",
  "security_considerations": [
    "Security consideration 1 with mitigation",
    "Security consideration 2 with mitigation",
    "Security consideration 3 with mitigation",
    "Security consideration 4 with mitigation"
  ]
}

The mermaid_diagram must be a valid Mermaid graph with real nodes and relationships. Include at least 8-10 nodes."""


class ArchitectAgent(BaseAgent):
    def __init__(self):
        super().__init__("Technical Architect")

    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        await queue.put({"type": "agent_start", "agent": self.name})

        pm = context.get("product", {})
        tech_reqs = pm.get("tech_requirements", [])

        user_prompt = f"""Startup Idea: {idea}

Technical Requirements:
{chr(10).join(f'- {r}' for r in tech_reqs)}

Design the complete, production-ready technical architecture. Choose modern, proven technologies. Include a detailed Mermaid architecture diagram."""

        raw = await self._stream_llm(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            queue=queue,
            model=model,
        )

        fallback = {
            "tech_stack": {
                "language": "Python 3.11 (backend), TypeScript 5.0 (frontend)",
                "frontend": "React 18 + Vite + TailwindCSS + Framer Motion",
                "backend": "FastAPI + LangGraph + LangChain",
                "database": "PostgreSQL 16 (primary), Redis 7 (cache/sessions)",
                "auth": "Supabase Auth / JWT tokens",
                "cloud": "AWS ECS Fargate + RDS + ElastiCache + CloudFront",
                "llm": "GMI Cloud API (Llama 3.3 70B Instruct)",
                "vector_db": "Pinecone / pgvector for semantic search",
                "cache": "Redis with 15-minute TTL for LLM responses",
                "queue": "AWS SQS for async processing at scale",
                "monitoring": "Datadog APM + Sentry + CloudWatch",
                "deployment": "Docker + GitHub Actions CI/CD",
            },
            "system_architecture": "The system uses a microservices-inspired monolith architecture optimized for rapid iteration. The React frontend communicates with FastAPI via REST and Server-Sent Events for real-time streaming. LangGraph orchestrates six specialized AI agents that run sequentially, each building on previous context. All AI inference routes through GMI Cloud's OpenAI-compatible API. PostgreSQL stores session data and reports, while Redis handles caching and rate limiting.",
            "mermaid_diagram": """graph TB
    User[👤 User Browser] --> CDN[CloudFront CDN]
    CDN --> FE[React Frontend]
    FE -->|REST + SSE| APIGW[API Gateway]
    APIGW --> BE[FastAPI Backend]
    BE --> LG[LangGraph Orchestrator]
    LG --> CEO[CEO Agent]
    LG --> MR[Market Research Agent]
    LG --> PM[PM Agent]
    LG --> ARCH[Architect Agent]
    LG --> GR[Growth Agent]
    LG --> INV[Investor Agent]
    CEO & MR & PM & ARCH & GR & INV --> GMI[GMI Cloud LLM API]
    BE --> DB[(PostgreSQL)]
    BE --> CACHE[(Redis)]
    BE --> S3[S3 Reports Storage]
    APIGW --> AUTH[Auth Service]""",
            "api_design": [
                {
                    "endpoint": "POST /api/v1/analyze",
                    "description": "Start full analysis pipeline with SSE streaming",
                    "request": "{ idea: string, model?: string, session_id?: string }",
                    "response": "SSE stream: agent_start, chunk, agent_done, complete events",
                },
                {
                    "endpoint": "GET /api/v1/sessions/{id}",
                    "description": "Retrieve saved analysis report",
                    "request": "session_id path param",
                    "response": "Full AnalysisReport JSON",
                },
                {
                    "endpoint": "GET /api/v1/models",
                    "description": "List available GMI Cloud models",
                    "request": "None",
                    "response": "Array of model objects with id, name, description",
                },
            ],
            "database_schema": [
                {
                    "table": "sessions",
                    "purpose": "Stores analysis sessions and metadata",
                    "key_fields": ["id", "idea", "model", "status", "created_at", "updated_at"],
                },
                {
                    "table": "reports",
                    "purpose": "Stores complete analysis reports per session",
                    "key_fields": ["id", "session_id", "agent", "output_json", "created_at"],
                },
                {
                    "table": "users",
                    "purpose": "User accounts (optional, guest mode supported)",
                    "key_fields": ["id", "email", "created_at", "plan"],
                },
            ],
            "deployment_strategy": "Containerized via Docker with multi-stage builds. GitHub Actions CI/CD pipeline runs tests, builds images, and pushes to AWS ECR. ECS Fargate provides serverless container execution with auto-scaling based on CPU/memory. Blue-green deployments ensure zero downtime. Environment-specific configs via AWS Parameter Store.",
            "scalability_notes": "At 0-1K users: single Fargate task, RDS t3.medium. At 1K-100K: ECS auto-scaling, RDS read replicas, ElastiCache cluster. At 100K-1M: add SQS for async processing, implement request batching, add regional CDN endpoints. Primary bottleneck is LLM throughput — mitigate with response caching for similar ideas.",
            "security_considerations": [
                "API key rotation: GMI Cloud keys stored in AWS Secrets Manager, rotated monthly",
                "Input sanitization: All user inputs validated with Pydantic, HTML stripped to prevent XSS",
                "Rate limiting: 10 requests/minute per IP, 100/day for free tier via Redis",
                "HTTPS everywhere: TLS 1.3, HSTS headers, Cloudflare proxy",
            ],
        }

        result = await self._parse_json_output(raw, fallback)
        await queue.put({"type": "agent_done", "agent": self.name, "data": result})
        return result
