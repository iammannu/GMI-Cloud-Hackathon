import asyncio
from typing import Optional
from agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a world-class market research analyst and competitive intelligence expert. You have deep knowledge of startup markets, venture trends, and competitive landscapes across all industries.

Analyze the startup idea and produce detailed market research.

IMPORTANT: Respond with ONLY valid JSON. No preamble or explanation.

{
  "market_size": "Total addressable market narrative with growth trajectory",
  "tam": "$X billion - Total Addressable Market explanation",
  "sam": "$X billion - Serviceable Addressable Market explanation",
  "som": "$X million - Serviceable Obtainable Market (Year 1-3 realistic capture)",
  "competitors": [
    {
      "name": "Competitor name",
      "description": "What they do",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "pricing": "Their pricing model",
      "market_share": "Estimated market share or funding stage"
    }
  ],
  "market_trends": [
    "Key trend 1 with data point",
    "Key trend 2 with data point",
    "Key trend 3 with data point",
    "Key trend 4 with data point"
  ],
  "swot": {
    "strengths": ["Internal strength 1", "Internal strength 2", "Internal strength 3"],
    "weaknesses": ["Internal weakness 1", "Internal weakness 2"],
    "opportunities": ["Market opportunity 1", "Market opportunity 2", "Market opportunity 3"],
    "threats": ["External threat 1", "External threat 2"]
  },
  "pricing_analysis": "Detailed pricing analysis covering competitor pricing, willingness to pay, and recommended pricing strategy",
  "differentiation": "Clear articulation of how this startup is uniquely positioned to win against existing competitors"
}

Include 3-5 real or realistic competitors. Be specific with market sizes and data."""


class MarketResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__("Market Research")

    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        await queue.put({"type": "agent_start", "agent": self.name})

        ceo_context = ""
        if context.get("ceo"):
            ceo = context["ceo"]
            ceo_context = f"""
CEO Analysis:
- Target Customer: {ceo.get('target_customer', '')}
- Value Proposition: {ceo.get('value_proposition', '')}
- Business Model: {ceo.get('business_model', '')}
"""

        user_prompt = f"""Startup Idea: {idea}
{ceo_context}
Produce comprehensive market research with real market data, named competitors, and actionable insights. Be specific."""

        raw = await self._stream_llm(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            queue=queue,
            model=model,
        )

        fallback = {
            "market_size": "Rapidly growing market with significant tailwinds from AI adoption",
            "tam": "$50 billion - Total addressable market across all potential customers globally",
            "sam": "$5 billion - Serviceable market focusing on tech-forward SMBs",
            "som": "$50 million - Realistic 3-year capture targeting early adopters",
            "competitors": [
                {
                    "name": "Competitor A",
                    "description": "Leading incumbent with legacy architecture",
                    "strengths": ["Brand recognition", "Large customer base"],
                    "weaknesses": ["Slow innovation", "High pricing"],
                    "pricing": "$500-2000/month",
                    "market_share": "Series B, $40M raised",
                },
                {
                    "name": "Competitor B",
                    "description": "AI-native startup entering the space",
                    "strengths": ["Modern stack", "VC-backed"],
                    "weaknesses": ["Limited features", "Small team"],
                    "pricing": "$200-800/month",
                    "market_share": "Seed, $5M raised",
                },
            ],
            "market_trends": [
                "AI adoption accelerating at 40% YoY across all industries",
                "SMBs increasingly seeking AI-powered automation tools",
                "Shift from point solutions to integrated platforms",
                "Rising demand for real-time insights and streaming analytics",
            ],
            "swot": {
                "strengths": ["AI-first architecture", "Faster time-to-value", "Lower cost structure"],
                "weaknesses": ["No brand recognition", "Limited initial feature set"],
                "opportunities": ["Greenfield market", "AI regulation creating barriers for competitors", "Enterprise upsell path"],
                "threats": ["Big Tech entering the space", "Economic downturn reducing budgets"],
            },
            "pricing_analysis": "Market supports $99-999/month pricing. Freemium entry point converts at 8-12% to paid tiers.",
            "differentiation": "First-mover advantage in AI-native approach with 10x faster onboarding than competitors.",
        }

        result = await self._parse_json_output(raw, fallback)
        await queue.put({"type": "agent_done", "agent": self.name, "data": result})
        return result
