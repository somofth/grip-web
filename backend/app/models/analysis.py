from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ScoreDimension(BaseModel):
    score: float
    issues: List[str]
    manual_score: Optional[float] = None

class AnalysisStatus(str, Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    REVIEWED = "reviewed"
    FAILED = "failed"

class AnalysisDetails(BaseModel):
    persuasion: ScoreDimension
    design: ScoreDimension
    trust: ScoreDimension
    technical: ScoreDimension

class AnalysisResult(BaseModel):
    id: str
    url: str
    created_at: datetime
    status: AnalysisStatus
    evaluator_id: str
    total_score: float
    grade: str
    manual_override: bool
    details: AnalysisDetails
    suggestions: List[str]

class AnalysisRequest(BaseModel):
    url: str
    evaluator_id: str
