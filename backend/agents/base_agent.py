import asyncio
import json
import re
from abc import ABC, abstractmethod
from typing import Optional
from langchain_core.messages import HumanMessage, SystemMessage
from services.llm_service import get_streaming_llm
from utils.logging_config import get_logger

logger = get_logger(__name__)


class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    def _clean_json(self, text: str) -> str:
        text = text.strip()
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        return text.strip()

    async def _stream_llm(
        self,
        system_prompt: str,
        user_prompt: str,
        queue: asyncio.Queue,
        model: Optional[str] = None,
    ) -> str:
        llm = get_streaming_llm(model=model)
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]

        full_content = ""
        try:
            async for chunk in llm.astream(messages):
                if chunk.content:
                    full_content += chunk.content
                    await queue.put({
                        "type": "chunk",
                        "agent": self.name,
                        "content": chunk.content,
                    })
        except Exception as e:
            logger.error("LLM streaming error", agent=self.name, error=str(e))
            await queue.put({
                "type": "error",
                "agent": self.name,
                "error": str(e),
            })
            raise

        return full_content

    async def _parse_json_output(self, raw: str, fallback: dict) -> dict:
        try:
            cleaned = self._clean_json(raw)
            json_match = re.search(r'\{[\s\S]*\}', cleaned)
            if json_match:
                return json.loads(json_match.group())
            return json.loads(cleaned)
        except (json.JSONDecodeError, ValueError):
            logger.warning("JSON parse failed, using fallback", agent=self.name)
            return fallback

    @abstractmethod
    async def run(self, idea: str, context: dict, queue: asyncio.Queue, model: Optional[str] = None) -> dict:
        pass
