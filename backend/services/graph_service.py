import asyncio
import uuid
from datetime import datetime
from typing import Optional
from langgraph.graph import StateGraph, END
from typing_extensions import TypedDict
from agents.ceo_agent import CEOAgent
from agents.market_research_agent import MarketResearchAgent
from agents.product_manager_agent import ProductManagerAgent
from agents.architect_agent import ArchitectAgent
from agents.growth_agent import GrowthAgent
from agents.investor_agent import InvestorAgent
from utils.logging_config import get_logger

logger = get_logger(__name__)

# In-memory session store (use Redis/DB in production)
_sessions: dict[str, dict] = {}

ceo_agent = CEOAgent()
market_agent = MarketResearchAgent()
pm_agent = ProductManagerAgent()
architect_agent = ArchitectAgent()
growth_agent = GrowthAgent()
investor_agent = InvestorAgent()


class AnalysisState(TypedDict):
    idea: str
    session_id: str
    model: Optional[str]
    queue: asyncio.Queue
    ceo: dict
    market: dict
    product: dict
    architect: dict
    growth: dict
    investor: dict
    error: Optional[str]


async def run_ceo(state: AnalysisState) -> AnalysisState:
    result = await ceo_agent.run(
        idea=state["idea"],
        context={},
        queue=state["queue"],
        model=state.get("model"),
    )
    return {**state, "ceo": result}


async def run_market(state: AnalysisState) -> AnalysisState:
    result = await market_agent.run(
        idea=state["idea"],
        context={"ceo": state.get("ceo", {})},
        queue=state["queue"],
        model=state.get("model"),
    )
    return {**state, "market": result}


async def run_pm(state: AnalysisState) -> AnalysisState:
    result = await pm_agent.run(
        idea=state["idea"],
        context={"ceo": state.get("ceo", {}), "market": state.get("market", {})},
        queue=state["queue"],
        model=state.get("model"),
    )
    return {**state, "product": result}


async def run_architect(state: AnalysisState) -> AnalysisState:
    result = await architect_agent.run(
        idea=state["idea"],
        context={"product": state.get("product", {})},
        queue=state["queue"],
        model=state.get("model"),
    )
    return {**state, "architect": result}


async def run_growth(state: AnalysisState) -> AnalysisState:
    result = await growth_agent.run(
        idea=state["idea"],
        context={"ceo": state.get("ceo", {}), "market": state.get("market", {})},
        queue=state["queue"],
        model=state.get("model"),
    )
    return {**state, "growth": result}


async def run_investor(state: AnalysisState) -> AnalysisState:
    result = await investor_agent.run(
        idea=state["idea"],
        context={
            "ceo": state.get("ceo", {}),
            "market": state.get("market", {}),
            "growth": state.get("growth", {}),
        },
        queue=state["queue"],
        model=state.get("model"),
    )
    return {**state, "investor": result}


def build_graph():
    graph = StateGraph(AnalysisState)
    # Prefix node names with "run_" to avoid collision with state keys
    graph.add_node("run_ceo", run_ceo)
    graph.add_node("run_market", run_market)
    graph.add_node("run_pm", run_pm)
    graph.add_node("run_architect", run_architect)
    graph.add_node("run_growth", run_growth)
    graph.add_node("run_investor", run_investor)

    graph.set_entry_point("run_ceo")
    graph.add_edge("run_ceo", "run_market")
    graph.add_edge("run_market", "run_pm")
    graph.add_edge("run_pm", "run_architect")
    graph.add_edge("run_architect", "run_growth")
    graph.add_edge("run_growth", "run_investor")
    graph.add_edge("run_investor", END)

    return graph.compile()


_graph = build_graph()


async def run_analysis_stream(idea: str, session_id: str, model: Optional[str] = None) -> asyncio.Queue:
    queue: asyncio.Queue = asyncio.Queue()

    async def _execute():
        try:
            initial_state: AnalysisState = {
                "idea": idea,
                "session_id": session_id,
                "model": model,
                "queue": queue,
                "ceo": {},
                "market": {},
                "product": {},
                "architect": {},
                "growth": {},
                "investor": {},
                "error": None,
            }
            final_state = await _graph.ainvoke(initial_state)

            report = {
                "session_id": session_id,
                "idea": idea,
                "ceo": final_state.get("ceo"),
                "market": final_state.get("market"),
                "product": final_state.get("product"),
                "architect": final_state.get("architect"),
                "growth": final_state.get("growth"),
                "investor": final_state.get("investor"),
                "created_at": datetime.utcnow().isoformat(),
            }

            _sessions[session_id] = report
            await queue.put({"type": "complete", "session_id": session_id, "data": report})

        except Exception as e:
            logger.error("Analysis pipeline failed", session_id=session_id, error=str(e))
            await queue.put({"type": "error", "error": str(e)})
        finally:
            await queue.put(None)

    asyncio.create_task(_execute())
    return queue


def get_session(session_id: str) -> Optional[dict]:
    return _sessions.get(session_id)


def list_sessions() -> list[dict]:
    return [
        {
            "session_id": sid,
            "idea": data.get("idea", ""),
            "created_at": data.get("created_at", ""),
            "has_results": bool(data.get("ceo")),
        }
        for sid, data in sorted(
            _sessions.items(),
            key=lambda x: x[1].get("created_at", ""),
            reverse=True,
        )
    ]
