import asyncio
from typing import Optional
from agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a world-class Growth Marketer and GTM strategist who has helped dozens of startups from 0 to $10M ARR. You combine data-driven marketing with creative storytelling.

Create a complete go-to-market and growth strategy.

IMPORTANT: Respond with ONLY valid JSON. No preamble or explanation.

{
  "go_to_market": "Detailed GTM narrative: who to target first, how to reach them, initial channels, and expected timeline to first 100 customers (4-5 sentences)",
  "marketing_channels": [
    {
      "channel": "Channel name",
      "strategy": "Specific tactics for this channel",
      "expected_cac": "$X CAC estimate",
      "timeline": "When to activate",
      "priority": "Primary|Secondary|Tertiary"
    }
  ],
  "seo_strategy": [
    "Target keyword 1 with search intent",
    "Target keyword 2 with search intent",
    "Target keyword 3 with search intent",
    "Content cluster topic 1",
    "Content cluster topic 2",
    "Technical SEO requirement"
  ],
  "launch_strategy": [
    {
      "phase": "Pre-launch (Week -4 to 0)",
      "actions": ["Build waitlist", "Create teaser content", "Reach out to beta users"],
      "goal": "500 waitlist signups"
    },
    {
      "phase": "Launch Day",
      "actions": ["ProductHunt launch", "Hacker News Show HN", "Twitter/X announcement"],
      "goal": "#1 Product of the Day on ProductHunt"
    },
    {
      "phase": "Post-launch (Week 1-4)",
      "actions": ["Onboard waitlist", "Collect testimonials", "Iterate on feedback"],
      "goal": "50 active paying users"
    }
  ],
  "social_media_plan": [
    {
      "platform": "Twitter/X",
      "content_type": "Build-in-public updates, product demos",
      "frequency": "2x daily",
      "sample_post": "Actual sample post content here"
    },
    {
      "platform": "LinkedIn",
      "content_type": "Thought leadership, case studies",
      "frequency": "Daily",
      "sample_post": "Actual sample post content here"
    }
  ],
  "content_calendar": [
    {
      "week": "Week 1",
      "theme": "Problem awareness",
      "pieces": ["Blog: Why X is broken", "Tweet thread: 5 signs you need X", "LinkedIn: Founder story"]
    },
    {
      "week": "Week 2",
      "theme": "Solution introduction",
      "pieces": ["Blog: How we solve X", "Demo video", "Case study"]
    }
  ],
  "kpis": [
    "Month 1: 100 signups, 10 paying customers, $1K MRR",
    "Month 3: 500 signups, 50 paying customers, $5K MRR",
    "Month 6: 2,000 signups, 150 paying customers, $15K MRR",
    "Month 12: 10,000 signups, 500 paying customers, $50K MRR"
  ],
  "partnerships": [
    "Partnership type 1 with specific partner category",
    "Partnership type 2 with specific partner category",
    "Integration partner category"
  ]
}"""


class GrowthAgent(BaseAgent):
    def __init__(self):
        super().__init__("Growth")

    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        await queue.put({"type": "agent_start", "agent": self.name})

        ceo = context.get("ceo", {})
        market = context.get("market", {})

        user_prompt = f"""Startup Idea: {idea}

Target Customer: {ceo.get('target_customer', '')}
Value Proposition: {ceo.get('value_proposition', '')}
Market Size: {market.get('tam', '')}
Key Competitors: {', '.join([c.get('name', '') for c in market.get('competitors', [])[:3]])}

Create a complete, actionable growth and go-to-market strategy. Be specific with tactics, timelines, and expected outcomes."""

        raw = await self._stream_llm(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            queue=queue,
            model=model,
        )

        fallback = {
            "go_to_market": "Start with a tight ICP focus on early-adopter founders and solo entrepreneurs who are active on Twitter/X and ProductHunt. Launch via ProductHunt on a Tuesday, backed by a 2-week pre-launch waitlist campaign. Use build-in-public content to generate organic awareness. Target $5K MRR within 60 days of launch through direct outbound to waitlist.",
            "marketing_channels": [
                {
                    "channel": "Product Hunt",
                    "strategy": "Full hunter strategy with maker follow-up posts and video demo",
                    "expected_cac": "$0-20",
                    "timeline": "Day 1",
                    "priority": "Primary",
                },
                {
                    "channel": "Twitter/X Build-in-Public",
                    "strategy": "Daily progress updates, metrics sharing, founder story",
                    "expected_cac": "$0-5",
                    "timeline": "Week -4",
                    "priority": "Primary",
                },
                {
                    "channel": "SEO Content",
                    "strategy": "Target high-intent startup keywords with comparison articles",
                    "expected_cac": "$10-30",
                    "timeline": "Month 2",
                    "priority": "Secondary",
                },
            ],
            "seo_strategy": [
                "startup business plan generator (informational, high volume)",
                "AI startup analyzer (transactional, medium volume)",
                "competitor analysis tool for startups (transactional)",
                "Content cluster: startup validation guides",
                "Content cluster: startup vs startup comparisons",
                "Technical SEO: Core Web Vitals < 2.5s LCP",
            ],
            "launch_strategy": [
                {
                    "phase": "Pre-launch (Week -4 to 0)",
                    "actions": ["Build waitlist landing page", "Create teaser demo video", "Reach 100 beta users"],
                    "goal": "500 waitlist signups",
                },
                {
                    "phase": "Launch Day",
                    "actions": ["ProductHunt at 12:01am PST", "Show HN post", "Email waitlist"],
                    "goal": "#1 Product of the Day",
                },
                {
                    "phase": "Post-launch (Week 1-4)",
                    "actions": ["Onboard waitlist users", "Weekly product updates", "Collect video testimonials"],
                    "goal": "50 paying users",
                },
            ],
            "social_media_plan": [
                {
                    "platform": "Twitter/X",
                    "content_type": "Build-in-public, demos, metrics",
                    "frequency": "3x daily",
                    "sample_post": "We just built an AI that replaces 6 startup consultants in 2 minutes. Here's what it produces: [thread] 🧵",
                },
                {
                    "platform": "LinkedIn",
                    "content_type": "Case studies and founder insights",
                    "frequency": "Daily",
                    "sample_post": "A founder spent $15,000 on consultants to get what our AI produces in 90 seconds. Here's why that changes everything.",
                },
            ],
            "content_calendar": [
                {
                    "week": "Week 1",
                    "theme": "Problem awareness",
                    "pieces": ["Blog: The broken state of startup validation", "Tweet thread: 7 signs your idea needs validation", "LinkedIn: My $50K mistake"],
                },
                {
                    "week": "Week 2",
                    "theme": "Product introduction",
                    "pieces": ["Blog: How AI changes startup planning", "Launch demo video", "First case study"],
                },
            ],
            "kpis": [
                "Month 1: 200 signups, 20 paying customers, $2K MRR",
                "Month 3: 800 signups, 80 paying customers, $8K MRR",
                "Month 6: 3,000 signups, 200 paying customers, $20K MRR",
                "Month 12: 15,000 signups, 600 paying customers, $60K MRR",
            ],
            "partnerships": [
                "Startup accelerators and incubators (YC, Techstars network)",
                "VC firms looking to pre-screen portfolio companies",
                "No-code/low-code platforms (Bubble, Webflow) for joint distribution",
            ],
        }

        result = await self._parse_json_output(raw, fallback)
        await queue.put({"type": "agent_done", "agent": self.name, "data": result})
        return result
