from typing import List, Literal, Optional
from pydantic import BaseModel, Field, model_validator


# ---------- Rubric generation ----------

class RubricGenerateRequest(BaseModel):
    title: str
    description: str
    type: Literal["IMAGE_TEXT", "BEFORE_AFTER", "TEXT_ONLY"]


class Rubric(BaseModel):
    criteria: List[str] = Field(
        description="List of specific checkable conditions the evidence must satisfy"
    )
    criteria_text: str = Field(
        description="Single paragraph summarizing all criteria, used for text-similarity matching"
    )


# ---------- Verification ----------

class VerifyRequest(BaseModel):
    verificationType: Literal["IMAGE_TEXT", "BEFORE_AFTER", "TEXT_ONLY"]

    # rubric text you fetched back from your DB (use Rubric.criteria_text)
    rubric: str

    # IMAGE_TEXT fields
    image_path: Optional[str] = None
    user_text: Optional[str] = None

    # BEFORE_AFTER fields
    image_before: Optional[str] = None
    image_after: Optional[str] = None

    @model_validator(mode="after")
    def check_required_fields(self):
        if self.verificationType == "IMAGE_TEXT" and not self.image_path:
            raise ValueError("image_path is required for IMAGE_TEXT verification")
        if self.verificationType == "BEFORE_AFTER" and not (self.image_before and self.image_after):
            raise ValueError("image_before and image_after are required for BEFORE_AFTER verification")
        if self.verificationType == "TEXT_ONLY" and not self.user_text:
            raise ValueError("user_text is required for TEXT_ONLY verification")
        return self


class VerifyResponse(BaseModel):
    confidence_score: int = Field(ge=0, le=100)
