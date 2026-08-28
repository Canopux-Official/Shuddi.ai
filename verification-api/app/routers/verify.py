from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool

from app.schemas import VerifyRequest, VerifyResponse
from app.services.model_registry import registry

router = APIRouter(prefix="/verify", tags=["verify"])


@router.post("", response_model=VerifyResponse)
async def verify_submission(payload: VerifyRequest):
    verification_router = registry["verification_router"]
    if verification_router is None:
        raise HTTPException(status_code=503, detail="Verification router not initialized yet")

    input_data = {
        "verificationType": payload.verificationType,
        "rubric": payload.rubric,
        "user_text": payload.user_text,
        "image_path": payload.image_path,
        "image_before": payload.image_before,
        "image_after": payload.image_after,
    }

    try:
        # model.generate() is synchronous/blocking (GPU-bound) -- run it off
        # the event loop so one slow verification doesn't stall other requests.
        result: VerifyResponse = await run_in_threadpool(verification_router.invoke, input_data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Verification failed: {e}")

    return result
