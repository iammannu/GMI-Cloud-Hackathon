from pydantic import BaseModel, Field
from typing import Optional, Any


class AnalyzeRequest(BaseModel):
    idea: str = Field(..., min_length=10, max_length=2000)
    session_id: Optional[str] = None
    model: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    model: str
