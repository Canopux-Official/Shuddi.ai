import re
import torch
from langchain_core.runnables import Runnable, RunnableLambda, RunnableBranch
from qwen_vl_utils import process_vision_info

from app.schemas import VerifyResponse
from app.services.model_registry import registry


class QwenVLRunnable(Runnable):
    """Wraps the local Qwen2.5-VL model so it behaves like a LangChain Runnable.
    Identical logic to the notebook version — text-only and image inputs both go
    through the same code path so process_vision_info handles the empty-image case.
    """

    def invoke(self, input: dict, config=None):
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
    """Called once at startup after the model/processor are loaded."""
    qwen_runnable = QwenVLRunnable()
    score_parser = RunnableLambda(extract_score)

    image_text_input = RunnableLambda(build_image_text_input)
    before_after_input = RunnableLambda(build_before_after_input)

    image_text_chain = image_text_input | qwen_runnable | score_parser
    before_after_chain = before_after_input | qwen_runnable | score_parser
    text_only_chain = RunnableLambda(run_text_similarity)

    return RunnableBranch(
        (lambda x: x["verificationType"] == "IMAGE_TEXT", image_text_chain),
        (lambda x: x["verificationType"] == "BEFORE_AFTER", before_after_chain),
        text_only_chain,  # default = TEXT_ONLY
    )
