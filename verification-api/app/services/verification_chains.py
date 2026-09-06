import base64
import mimetypes
import re

import requests
import torch
from langchain_core.runnables import Runnable, RunnableLambda, RunnableBranch
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import USE_GEMINI_VERIFICATION, GEMINI_VISION_MODEL_NAME
from app.schemas import VerifyResponse
from app.services.model_registry import registry


class QwenVLRunnable(Runnable):
    """Wraps the local Qwen2.5-VL model so it behaves like a LangChain Runnable.
    Identical logic to the notebook version -- text-only and image inputs both go
    through the same code path so process_vision_info handles the empty-image case.

    UNCHANGED. Still used whenever USE_GEMINI_VERIFICATION is false/unset.

    NOTE: the qwen_vl_utils import is done lazily inside invoke() (rather
    than at module level) so this file -- and the whole app -- can still be
    imported and run in Gemini-only mode on a host where qwen-vl-utils /
    transformers / bitsandbytes aren't installed at all.
    """

    def invoke(self, input: dict, config=None):
        from qwen_vl_utils import process_vision_info

        model = registry["model"]
        processor = registry["processor"]

        image_paths = input.get("images", [])
        prompt_text = input["prompt"]
        max_tokens = input.get("max_tokens", 400)

        messages = [
            {"role": "system", "content": "You are a helpful assistant that outputs strictly valid JSON."}
        ]

        if image_paths:
            content = [{"type": "image", "image": p} for p in image_paths]
            content.append({"type": "text", "text": prompt_text})
            messages.append({"role": "user", "content": content})
            image_inputs, video_inputs = process_vision_info(messages)
        else:
            messages.append({"role": "user", "content": prompt_text})
            image_inputs, video_inputs = None, None

        text = processor.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt",
        ).to(model.device)

        with torch.no_grad():
            output_ids = model.generate(**inputs, max_new_tokens=max_tokens, do_sample=False)

        generated_ids = output_ids[:, inputs.input_ids.shape[1]:]
        return processor.batch_decode(
            generated_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True
        )[0]


class GeminiVLRunnable(Runnable):
    """Drop-in replacement for QwenVLRunnable with the SAME invoke() contract:
    a dict with 'images' (a list of URLs -- evidenceUrls are already URLs from
    the file storage service, not local paths), 'prompt', and 'max_tokens'.

    Because the contract matches, build_verification_router() below can swap
    this in for QwenVLRunnable without touching build_image_text_input,
    build_before_after_input, or extract_score at all.

    Used only when USE_GEMINI_VERIFICATION=true.
    """

    def __init__(self):
        self._llm = ChatGoogleGenerativeAI(model=GEMINI_VISION_MODEL_NAME, temperature=0)

    @staticmethod
    def _url_to_data_url(url: str) -> str:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        mime = resp.headers.get("Content-Type") or mimetypes.guess_type(url)[0] or "image/jpeg"
        b64 = base64.b64encode(resp.content).decode("utf-8")
        return f"data:{mime};base64,{b64}"

    def invoke(self, input: dict, config=None):
        image_urls = input.get("images", [])
        prompt_text = input["prompt"]
        max_tokens = input.get("max_tokens", 400)

        content = [{"type": "text", "text": prompt_text}]
        for url in image_urls:
            content.append({"type": "image_url", "image_url": self._url_to_data_url(url)})

        messages = [
            ("system", "You are a helpful assistant that outputs strictly valid JSON."),
            ("user", content),
        ]

        response = self._llm.bind(max_output_tokens=max_tokens).invoke(messages)
        return response.content


def extract_score(raw_text: str) -> VerifyResponse:
    match = re.search(r"\d{1,3}", raw_text)
    score = int(match.group()) if match else 0
    score = max(0, min(100, score))
    return VerifyResponse(confidence_score=score)


def build_image_text_input(data: dict) -> dict:
    prompt = f"""You are a task verification assistant.
Rubric: {data['rubric']}
User's description: {data.get('user_text', 'N/A')}

Look at the image and judge how well it satisfies the rubric.
Respond with ONLY a single integer from 0 to 100. No words, no explanation."""
    return {"images": [data["image_path"]], "prompt": prompt, "max_tokens": 10}


def build_before_after_input(data: dict) -> dict:
    prompt = f"""You are a task verification assistant.
Rubric: {data['rubric']}
You are given a BEFORE image and an AFTER image. Judge how well the change satisfies the rubric.

Respond with ONLY a single integer from 0 to 100. No words, no explanation."""
    return {"images": [data["image_before"], data["image_after"]], "prompt": prompt, "max_tokens": 10}


def run_text_similarity(data: dict) -> VerifyResponse:
    embeddings = registry["embeddings"]
    from sentence_transformers import util

    emb1 = embeddings.embed_query(data["user_text"])
    emb2 = embeddings.embed_query(data["rubric"])
    sim = util.cos_sim(emb1, emb2).item()
    score = int(max(0, sim) * 100)
    return VerifyResponse(confidence_score=score)


def build_verification_router() -> RunnableBranch:
    """Called once at startup. Picks which VLM runnable backs the
    IMAGE_TEXT / BEFORE_AFTER chains based on USE_GEMINI_VERIFICATION --
    everything downstream (input builders, score parser, branch logic)
    is identical either way.
    """
    vlm_runnable = GeminiVLRunnable() if USE_GEMINI_VERIFICATION else QwenVLRunnable()
    score_parser = RunnableLambda(extract_score)

    image_text_input = RunnableLambda(build_image_text_input)
    before_after_input = RunnableLambda(build_before_after_input)

    image_text_chain = image_text_input | vlm_runnable | score_parser
    before_after_chain = before_after_input | vlm_runnable | score_parser
    text_only_chain = RunnableLambda(run_text_similarity)

    return RunnableBranch(
        (lambda x: x["verificationType"] == "IMAGE_TEXT", image_text_chain),
        (lambda x: x["verificationType"] == "BEFORE_AFTER", before_after_chain),
        text_only_chain,  # default = TEXT_ONLY
    )