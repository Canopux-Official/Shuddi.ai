# Shuddi (Ecosphere)

**Turning Everyday Climate Action Into a Community Movement**

Shuddi is a community-driven environmental and social impact platform that scales civic action by removing verification bottlenecks. It allows citizens to pick up bite-sized environmental tasks and get them instantly verified by an AI pipeline. For larger physical events, the platform enables verified NGOs to organize community drives with geofenced attendance checks. Every verified action earns points that convert into real rewards or can be redirected as donations to vetted campaigns.

## ✨ Core Features

*   **AI-Verified Individual Tasks:** Complete solo environmental tasks and get them verified instantly via an AI pipeline (Vision-LLM, text embeddings) instead of human moderators.
*   **NGO-Run Community Events:** Verified NGOs can organize physical events (like beach clean-ups) with registration limits and geofenced check-ins to verify real-world attendance.
*   **Gamification & Rewards Engine:** Earn XP, badges, and points for eco-friendly behavior. Compete on global and regional leaderboards and redeem points for real rewards.
*   **Donations to Verified Campaigns:** Support NGOs financially through integrated Razorpay donations with an auditable ledger.
*   **NGO Onboarding & Verification:** A strict vetting process for organizations ensures trust before they can host events or receive donations.
*   **Role-Based Access Control:** Fine-grained permissions at both platform-wide and per-NGO levels.
*   **Community Feed:** A lightweight social layer to share updates, photos, and environmental wins.
*   **Area-Based Regional Structure:** Geographically scoped leaderboards, NGOs, and events with a built-in demand signal for platform expansion.

## 💻 Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Material UI, Vite
*   **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, JWT Authentication
*   **AI Verification Service:** Python, FastAPI, Qwen2.5-VL, LangChain, Gemini (for auto-generating rubrics)
*   **Payments:** Razorpay
*   **Storage:** Multi-tenant file storage microservice

## 🚀 How to Run Locally

The project consists of three main services: the Frontend (client), the Backend (server), and the AI Verification API (verification-api).

### 1. Backend Server
Navigate to the `server` directory, install dependencies, and run the development server. Ensure you have PostgreSQL running.
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 2. Frontend Client
Navigate to the `client` directory to start the React application.
```bash
cd client
npm install
npm run dev
```

### 3. AI Verification API
Navigate to the `verification-api` directory. You will need to set up a Python virtual environment and run the FastAPI server using Uvicorn.
```bash
cd verification-api
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> **Note:** Example `.env` files are not currently included in the repository. Make sure to configure your environment variables (Database URLs, API Keys, etc.) before running the services in full.
