import os
from typing import Optional
from langchain_openai import ChatOpenAI


GMI_MODELS = [
    {
        "id": "Qwen/Qwen3.7-Max",
        "name": "Qwen 3.7 Max",
        "provider": "Alibaba",
        "description": "GMI Cloud flagship — best overall performance.",
        "context_window": 131072,
    },
    {
        "id": "Qwen/Qwen3.6-Max-Preview",
        "name": "Qwen 3.6 Max",
        "provider": "Alibaba",
        "description": "Latest Qwen preview model with strong reasoning.",
        "context_window": 131072,
    },
    {
        "id": "deepseek-ai/DeepSeek-V3.2",
        "name": "DeepSeek V3.2",
        "provider": "DeepSeek",
        "description": "DeepSeek's latest frontier model.",
        "context_window": 65536,
    },
    {
        "id": "deepseek-ai/DeepSeek-R1-0528",
        "name": "DeepSeek R1",
        "provider": "DeepSeek",
        "description": "Advanced reasoning with chain-of-thought.",
        "context_window": 65536,
    },
    {
        "id": "deepseek-ai/DeepSeek-V3-0324",
        "name": "DeepSeek V3",
        "provider": "DeepSeek",
        "description": "Proven production-grade model.",
        "context_window": 65536,
    },
    {
        "id": "moonshotai/Kimi-K2-Instruct-0905",
        "name": "Kimi K2",
        "provider": "Moonshot",
        "description": "Moonshot AI's capable instruction model.",
        "context_window": 131072,
    },
    {
        "id": "google/gemma-4-31b-it",
        "name": "Gemma 4 31B",
        "provider": "Google",
        "description": "Google's latest open model.",
        "context_window": 131072,
    },
    {
        "id": "meta-llama/Llama-3.3-70B-Instruct",
        "name": "Llama 3.3 70B",
        "provider": "Meta",
        "description": "Meta's flagship open-source model.",
        "context_window": 131072,
    },
]


def get_default_model() -> str:
    return os.getenv("GMI_MODEL", "meta-llama/Llama-3.3-70B-Instruct")


def create_llm(model: Optional[str] = None, streaming: bool = False) -> ChatOpenAI:
    return ChatOpenAI(
        base_url=os.getenv("GMI_BASE_URL", "https://api.gmi-serving.com/v1"),
        api_key=os.getenv("GMI_API_KEY", ""),
        model=model or get_default_model(),
        temperature=float(os.getenv("LLM_TEMPERATURE", "0.7")),
        max_tokens=int(os.getenv("LLM_MAX_TOKENS", "4096")),
        timeout=int(os.getenv("LLM_TIMEOUT", "120")),
        streaming=streaming,
    )


def get_llm(model: Optional[str] = None) -> ChatOpenAI:
    return create_llm(model=model, streaming=False)


def get_streaming_llm(model: Optional[str] = None) -> ChatOpenAI:
    return create_llm(model=model, streaming=True)
