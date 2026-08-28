from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool

from app.schemas import RubricGenerateRequest, Rubric
from app.services.model_registry import registry

router = APIRouter(prefix="/rubric", tags=["rubric"])


@router.post("/generate", response_model=Rubric)
async def generate_rubric(payload: RubricGenerateRequest):
    chain = registry["rubric_chain"]
    if chain is None:
        raise HTTPException(status_code=503, detail="Rubric chain not initialized yet")

    try:
        # Gemini call is a network call, not CPU-bound, but run_in_threadpool
        # keeps it from blocking the event loop just in case the client is sync.
        result: Rubric = await run_in_threadpool(
            chain.invoke,
            {"title": payload.title, "description": payload.description, "type": payload.type},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Rubric generation failed: {e}")

    return result
