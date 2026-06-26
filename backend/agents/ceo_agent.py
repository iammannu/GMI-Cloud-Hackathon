import asyncio
import json
from typing import Optional
from agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are an elite startup CEO and business strategist with 20 years of experience founding and scaling billion-dollar companies. You have deep expertise in business model design, market positioning, and fundraising.

When given a startup idea, you must analyze it and produce a comprehensive business foundation.

IMPORTANT: You must respond with ONLY valid JSON matching this exact structure. No preamble, no explanation, no markdown.

{
  "vision": "Inspiring long-term vision statement (2-3 sentences)",
  "mission": "Clear mission statement describing what the company does and for whom",
  "business_strategy": "Detailed strategy covering competitive positioning, growth approach, and key differentiators (3-4 sentences)",
  "target_customer": "Precise ICP description including demographics, psychographics, pain points, and buying behavior",
  "value_proposition": "Unique value proposition that clearly articulates the benefit over alternatives",
  "elevator_pitch": "Compelling 30-second pitch: problem, solution, market, traction, ask",
  "business_model": "How the company makes money, monetization mechanics, unit economics overview",
  "revenue_streams": ["Primary revenue stream", "Secondary revenue stream", "Future revenue stream"]
}"""


class CEOAgent(BaseAgent):
    def __init__(self):
        super().__init__("CEO")

    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        await queue.put({"type": "agent_start", "agent": self.name})

        user_prompt = f"""Startup Idea: {idea}

Analyze this startup idea and produce the complete business foundation JSON. Be specific, realistic, and compelling. Base your analysis on real market dynamics."""

        raw = await self._stream_llm(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            queue=queue,
            model=model,
        )

        fallback = {
            "vision": f"To become the leading platform in the {idea} space",
            "mission": f"We help entrepreneurs build and scale AI-powered startups through intelligent automation",
            "business_strategy": "Build a strong product foundation, acquire early adopters, and expand through network effects",
            "target_customer": "Tech-forward entrepreneurs aged 25-45 who value speed and data-driven decisions",
            "value_proposition": "10x faster startup validation compared to traditional methods",
            "elevator_pitch": f"Most founders waste months validating ideas. {idea} provides instant AI-driven validation and planning.",
            "business_model": "SaaS subscription with freemium entry point and enterprise tiers",
            "revenue_streams": ["Monthly SaaS subscriptions", "Enterprise licensing", "Marketplace commissions"],
        }

        result = await self._parse_json_output(raw, fallback)
        await queue.put({"type": "agent_done", "agent": self.name, "data": result})
        return result
