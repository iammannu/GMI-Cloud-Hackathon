import asyncio
from typing import Optional
from agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a Senior Partner at a top-tier VC firm with 15 years of experience evaluating thousands of startups. You've backed companies that went on to be worth billions. You are direct, analytical, and balanced.

Evaluate this startup and produce a comprehensive investor analysis.

IMPORTANT: Respond with ONLY valid JSON. No preamble or explanation.

{
  "fundability_score": 75,
  "stage_recommendation": "Pre-Seed|Seed|Series A",
  "funding_amount": "$X - $Y (recommended raise)",
  "strengths": [
    "Investor-relevant strength 1 with specifics",
    "Investor-relevant strength 2 with specifics",
    "Investor-relevant strength 3 with specifics",
    "Investor-relevant strength 4 with specifics"
  ],
  "weaknesses": [
    "Honest weakness 1 that investors will probe",
    "Honest weakness 2 that investors will probe",
    "Honest weakness 3 that investors will probe"
  ],
  "risks": [
    "Market risk: specific risk description",
    "Execution risk: specific risk description",
    "Competition risk: specific risk description",
    "Technology risk: specific risk description"
  ],
  "mitigations": [
    "How to mitigate market risk",
    "How to mitigate execution risk",
    "How to mitigate competition risk",
    "How to mitigate technology risk"
  ],
  "investment_thesis": "Why an investor should back this startup: market timing, founder fit, defensibility, and potential return (3-4 sentences)",
  "comparable_startups": [
    {
      "company": "Company name",
      "outcome": "IPO/$XB acquisition/Series X at $XM",
      "similarity": "Why this is comparable"
    }
  ],
  "ninety_day_plan": [
    {
      "days": "Day 1-30",
      "focus": "Foundation",
      "actions": ["Action 1", "Action 2", "Action 3"],
      "milestone": "Specific measurable milestone"
    },
    {
      "days": "Day 31-60",
      "focus": "Traction",
      "actions": ["Action 1", "Action 2", "Action 3"],
      "milestone": "Specific measurable milestone"
    },
    {
      "days": "Day 61-90",
      "focus": "Growth",
      "actions": ["Action 1", "Action 2", "Action 3"],
      "milestone": "Specific measurable milestone"
    }
  ]
}

Be honest and balanced. Score 0-100 where 70+ is fundable. Include real comparable companies."""


class InvestorAgent(BaseAgent):
    def __init__(self):
        super().__init__("Investor")

    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        await queue.put({"type": "agent_start", "agent": self.name})

        ceo = context.get("ceo", {})
        market = context.get("market", {})
        growth = context.get("growth", {})

        user_prompt = f"""Startup Idea: {idea}

Business Summary:
- Elevator Pitch: {ceo.get('elevator_pitch', '')}
- Business Model: {ceo.get('business_model', '')}
- TAM: {market.get('tam', '')}
- Revenue Streams: {', '.join(ceo.get('revenue_streams', [])[:3])}
- KPI Targets: {'; '.join(growth.get('kpis', [])[:3])}

Provide a thorough investor evaluation including fundability score, risks, investment thesis, and 90-day action plan. Be honest and specific."""

        raw = await self._stream_llm(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            queue=queue,
            model=model,
        )

        fallback = {
            "fundability_score": 72,
            "stage_recommendation": "Pre-Seed",
            "funding_amount": "$500K - $1.5M",
            "strengths": [
                "Large and growing TAM with clear tailwinds from AI adoption",
                "AI-native product architecture creates defensibility vs legacy competitors",
                "Low CAC potential through community-led growth",
                "Founder has deep domain expertise in the target market",
            ],
            "weaknesses": [
                "No traction yet — pure hypothesis without validation",
                "Crowded market with well-funded competitors",
                "LLM dependency creates margin pressure",
            ],
            "risks": [
                "Market risk: LLM commoditization could erode differentiation",
                "Execution risk: Small team tackling complex multi-agent AI system",
                "Competition risk: OpenAI/Google could release competing features",
                "Technology risk: LLM hallucinations could undermine trust",
            ],
            "mitigations": [
                "Build proprietary training data and fine-tuned models over time",
                "Focus on execution speed and UX moat rather than model quality",
                "Build integrations and partnerships to increase switching costs",
                "Implement human-in-loop validation for critical outputs",
            ],
            "investment_thesis": "The market for AI-powered startup tools is at an inflection point as founders demand faster validation cycles. This startup benefits from favorable timing, low CAC through community distribution, and a defensible AI-first architecture. The freemium model creates a wide funnel with enterprise upsell potential. Comparable to Notion's early trajectory if execution is strong.",
            "comparable_startups": [
                {
                    "company": "Copy.ai",
                    "outcome": "Series B at $13.9M, $250M valuation",
                    "similarity": "AI-powered business content generation with similar B2B SaaS model",
                },
                {
                    "company": "Tome",
                    "outcome": "Series B at $43M",
                    "similarity": "AI-generated business presentations targeting the same audience",
                },
                {
                    "company": "Jasper",
                    "outcome": "$1.5B valuation at Series A",
                    "similarity": "AI writing for business use cases with similar growth trajectory",
                },
            ],
            "ninety_day_plan": [
                {
                    "days": "Day 1-30",
                    "focus": "Validation",
                    "actions": ["Ship MVP to 50 beta users", "Conduct 20 customer interviews", "Define final ICP"],
                    "milestone": "10 users paying $99/month",
                },
                {
                    "days": "Day 31-60",
                    "focus": "Traction",
                    "actions": ["ProductHunt launch", "Build waitlist to 1000", "Collect 10 testimonials"],
                    "milestone": "$5K MRR, 50 paying customers",
                },
                {
                    "days": "Day 61-90",
                    "focus": "Fundraising",
                    "actions": ["Prepare investor deck", "Warm intros to 30 angels", "Close $500K pre-seed"],
                    "milestone": "Pre-seed round closed",
                },
            ],
        }

        result = await self._parse_json_output(raw, fallback)
        await queue.put({"type": "agent_done", "agent": self.name, "data": result})
        return result
