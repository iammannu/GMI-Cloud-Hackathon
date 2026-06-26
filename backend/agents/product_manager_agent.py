import asyncio
from typing import Optional
from agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a seasoned Product Manager with experience shipping products at top-tier tech companies. You excel at distilling complex ideas into clear, prioritized, and buildable product plans.

Produce a complete product management document for the startup.

IMPORTANT: Respond with ONLY valid JSON. No preamble or explanation.

{
  "mvp_features": [
    {
      "feature": "Feature name",
      "description": "Clear description of what it does",
      "priority": "P0|P1|P2",
      "effort": "Small|Medium|Large",
      "impact": "High|Medium|Low",
      "user_story": "As a [user], I want to [action] so that [benefit]"
    }
  ],
  "full_roadmap": [
    {
      "phase": "Phase 1: MVP (Month 1-3)",
      "theme": "Core value delivery",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "milestone": "First paying customer"
    },
    {
      "phase": "Phase 2: Growth (Month 4-6)",
      "theme": "Retention and expansion",
      "features": ["Feature 4", "Feature 5"],
      "milestone": "$10K MRR"
    },
    {
      "phase": "Phase 3: Scale (Month 7-12)",
      "theme": "Enterprise and integrations",
      "features": ["Feature 6", "Feature 7"],
      "milestone": "$100K MRR"
    }
  ],
  "user_personas": [
    {
      "name": "Persona name",
      "role": "Job title",
      "age_range": "25-35",
      "pain_points": ["Pain 1", "Pain 2"],
      "goals": ["Goal 1", "Goal 2"],
      "channels": ["Where they discover products"]
    }
  ],
  "user_stories": [
    "As a [persona], I want to [feature] so that [outcome]",
    "As a [persona], I want to [feature] so that [outcome]",
    "As a [persona], I want to [feature] so that [outcome]",
    "As a [persona], I want to [feature] so that [outcome]",
    "As a [persona], I want to [feature] so that [outcome]"
  ],
  "success_metrics": [
    "Metric 1: specific KPI with target",
    "Metric 2: specific KPI with target",
    "Metric 3: specific KPI with target",
    "Metric 4: specific KPI with target"
  ],
  "tech_requirements": [
    "Technical requirement 1",
    "Technical requirement 2",
    "Technical requirement 3",
    "Technical requirement 4"
  ]
}

Include 6-8 MVP features with P0/P1/P2 prioritization. Be specific and actionable."""


class ProductManagerAgent(BaseAgent):
    def __init__(self):
        super().__init__("Product Manager")

    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        await queue.put({"type": "agent_start", "agent": self.name})

        ceo = context.get("ceo", {})
        market = context.get("market", {})

        user_prompt = f"""Startup Idea: {idea}

Target Customer: {ceo.get('target_customer', 'Tech-forward professionals')}
Value Proposition: {ceo.get('value_proposition', 'Superior AI-powered solution')}
Key Competitors: {', '.join([c.get('name', '') for c in market.get('competitors', [])[:3]])}

Define the complete product plan with prioritized MVP features, full roadmap, user personas, and success metrics."""

        raw = await self._stream_llm(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            queue=queue,
            model=model,
        )

        fallback = {
            "mvp_features": [
                {
                    "feature": "AI Idea Analyzer",
                    "description": "Core AI engine that analyzes startup ideas",
                    "priority": "P0",
                    "effort": "Large",
                    "impact": "High",
                    "user_story": "As a founder, I want to analyze my idea instantly so that I can validate it before spending months building",
                },
                {
                    "feature": "Business Report Generator",
                    "description": "Generates complete business plans automatically",
                    "priority": "P0",
                    "effort": "Medium",
                    "impact": "High",
                    "user_story": "As a founder, I want a complete business plan so that I can pitch investors immediately",
                },
                {
                    "feature": "Export & Share",
                    "description": "Export reports as PDF, Markdown, or JSON",
                    "priority": "P1",
                    "effort": "Small",
                    "impact": "Medium",
                    "user_story": "As a founder, I want to export my plan so that I can share it with my team",
                },
            ],
            "full_roadmap": [
                {
                    "phase": "Phase 1: MVP (Month 1-3)",
                    "theme": "Core analysis engine",
                    "features": ["AI Analysis", "Report Generation", "Export"],
                    "milestone": "100 paid users",
                },
                {
                    "phase": "Phase 2: Growth (Month 4-6)",
                    "theme": "Collaboration and persistence",
                    "features": ["Team workspaces", "Version history", "Integrations"],
                    "milestone": "$10K MRR",
                },
            ],
            "user_personas": [
                {
                    "name": "Alex the Builder",
                    "role": "First-time Founder",
                    "age_range": "28-38",
                    "pain_points": ["No business background", "Limited time", "Analysis paralysis"],
                    "goals": ["Validate idea quickly", "Get investor-ready", "Launch fast"],
                    "channels": ["Twitter/X", "ProductHunt", "Hacker News"],
                },
            ],
            "user_stories": [
                "As a founder, I want to analyze my idea in minutes so that I can move fast",
                "As an investor, I want to see a structured pitch so that I can evaluate quickly",
                "As a PM, I want to see a feature roadmap so that I can plan sprints",
                "As a developer, I want to see the tech architecture so that I can start building",
                "As a marketer, I want a launch strategy so that I can plan campaigns",
            ],
            "success_metrics": [
                "Time-to-value: < 2 minutes from idea to full report",
                "Activation rate: > 60% of signups complete first analysis",
                "NPS: > 50 within 30 days",
                "MoM growth: > 20% for first 6 months",
            ],
            "tech_requirements": [
                "Sub-2-minute end-to-end analysis pipeline",
                "Real-time streaming responses to frontend",
                "Structured JSON output from all AI agents",
                "Session persistence for 30 days",
            ],
        }

        result = await self._parse_json_output(raw, fallback)
        await queue.put({"type": "agent_done", "agent": self.name, "data": result})
        return result
