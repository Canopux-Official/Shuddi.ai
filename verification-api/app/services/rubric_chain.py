from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import GEMINI_MODEL_NAME
from app.schemas import Rubric


def build_rubric_chain():
    """Called once at startup. GOOGLE_API_KEY must already be set as an
    env var (app/config.py raises at import time if it's missing)."""
    llm = ChatGoogleGenerativeAI(model=GEMINI_MODEL_NAME, temperature=0)
    structured_gemini = llm.with_structured_output(Rubric)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are generating a verification rubric for a task."),
        ("user", "Task Title: {title}\nTask Description: {description}\nTask Type: {type}"),
    ])

    return prompt | structured_gemini
