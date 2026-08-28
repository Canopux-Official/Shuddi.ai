import os

# Load from environment variables. Set these in your shell or a .env file
# loaded by python-dotenv (see main.py) before starting the app.
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
QWEN_MODEL_NAME = os.environ.get("QWEN_MODEL_NAME", "Qwen/Qwen2.5-VL-3B-Instruct")
GEMINI_MODEL_NAME = os.environ.get("GEMINI_MODEL_NAME", "gemini-2.5-flash")

if not GOOGLE_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is not set. Export it as an environment variable "
        "or put it in a .env file before starting the server."
    )
