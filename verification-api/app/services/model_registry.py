"""
Holds references to heavy, expensive-to-load objects (the Qwen model,
processor, embeddings, and LCEL chains). Populated once at FastAPI
startup and reused across all requests — never re-instantiate these
per-request, or you'll reintroduce the multi-minute load times.
"""

registry: dict = {
    "model": None,
    "processor": None,
    "embeddings": None,
    "image_text_chain": None,
    "before_after_chain": None,
    "text_only_chain": None,
    "verification_router": None,
    "rubric_chain": None,
}
