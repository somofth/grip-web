from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.analysis import AnalysisRequest, AnalysisResult, AnalysisStatus
from app.core.crawler import crawler
from app.core.scoring import scoring_engine
from app.core.db import get_db
import uuid
from datetime import datetime
import asyncio

router = APIRouter()

# In-memory store fallback if DB fails
local_store = {}

async def process_analysis(analysis_id: str, url: str):
    db = get_db()
    
    try:
        # Update status to processing
        if db:
            db.collection("analysis_results").document(analysis_id).update({"status": AnalysisStatus.PROCESSING})
        else:
            local_store[analysis_id]["status"] = AnalysisStatus.PROCESSING

        # 1. Crawl
        crawl_result = await crawler.crawl(url)
        
        # 2. Score
        details = await scoring_engine.evaluate(
            url=url,
            title=crawl_result["title"],
            html_content=crawl_result["html_content"],
            image_chunks=crawl_result["image_chunks"]
        )
        
        # 3. Calculate Total Score
        total_score = (
            details.persuasion.score * 0.4 +
            details.design.score * 0.3 +
            details.trust.score * 0.2 +
            details.technical.score * 0.1
        )
        
        grade = "C"
        if total_score >= 90: grade = "S"
        elif total_score >= 80: grade = "A"
        elif total_score >= 70: grade = "B"

        result = AnalysisResult(
            id=analysis_id,
            url=url,
            created_at=datetime.utcnow(),
            status=AnalysisStatus.COMPLETED,
            evaluator_id="system",
            total_score=round(total_score, 1),
            grade=grade,
            manual_override=False,
            details=details,
            suggestions=details.persuasion.issues + details.design.issues + details.trust.issues + details.technical.issues
        )
        
        # Save Result
        if db:
            db.collection("analysis_results").document(analysis_id).set(result.dict())
        else:
            local_store[analysis_id] = result.dict()
            
    except Exception as e:
        print(f"Analysis failed: {e}")
        error_status = {"status": AnalysisStatus.FAILED, "error": str(e)}
        if db:
            db.collection("analysis_results").document(analysis_id).update(error_status)
        else:
            if analysis_id in local_store:
                local_store[analysis_id].update(error_status)


@router.post("/analyze", response_model=dict)
async def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    analysis_id = str(uuid.uuid4())
    
    # Initialize record
    initial_record = {
        "id": analysis_id,
        "url": request.url,
        "status": AnalysisStatus.PROCESSING,
        "created_at": datetime.utcnow().isoformat()
    }
    
    db = get_db()
    if db:
        db.collection("analysis_results").document(analysis_id).set(initial_record)
    else:
        local_store[analysis_id] = initial_record

    background_tasks.add_task(process_analysis, analysis_id, request.url)
    
    return {"id": analysis_id, "status": AnalysisStatus.PROCESSING}

@router.get("/analyze/{analysis_id}")
async def get_analysis(analysis_id: str):
    db = get_db()
    
    if db:
        doc = db.collection("analysis_results").document(analysis_id).get()
        if doc.exists:
            return doc.to_dict()
    else:
        if analysis_id in local_store:
            return local_store[analysis_id]
            
    raise HTTPException(status_code=404, detail="Analysis not found")
