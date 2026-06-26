import json
import uuid
import os
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from api.models import AnalyzeRequest, HealthResponse
from services.graph_service import run_analysis_stream, get_session, list_sessions
from services.llm_service import GMI_MODELS, get_default_model
from utils.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        model=get_default_model(),
    )


@router.get("/models")
async def get_models():
    return {"models": GMI_MODELS, "default": get_default_model()}


@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    session_id = request.session_id or str(uuid.uuid4())
    idea = request.idea.strip()
    model = request.model if hasattr(request, "model") else None

    logger.info("Starting analysis", session_id=session_id, idea=idea[:50])

    queue = await run_analysis_stream(idea=idea, session_id=session_id, model=model)

    async def event_stream():
        yield f"data: {json.dumps({'type': 'session_created', 'session_id': session_id})}\n\n"

        while True:
            event = await queue.get()
            if event is None:
                yield "data: {\"type\": \"stream_end\"}\n\n"
                break
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )


@router.get("/sessions")
async def get_sessions():
    return {"sessions": list_sessions()}


@router.get("/sessions/{session_id}")
async def get_session_report(session_id: str):
    report = get_session(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Session not found")
    return report
