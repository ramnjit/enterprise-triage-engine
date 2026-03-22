# AI Medical Scribe & Triage Engine

## Overview
Medical professionals spend a disproportionate amount of time on manual data entry, translating messy patient narratives into structured Electronic Medical Records (EMR). 

This application demonstrates a solution using a decoupled, cloud-native microservice architecture. It ingests unstructured clinical text (like telehealth transcripts or rushed doctor notes) and utilizes an Agentic LLM workflow to extract, categorize, and stream structured clinical data back to the user interface in real-time.

## Architecture & Data Flow
The system is split into a Next.js client and a Node.js API gateway, communicating via Server-Sent Events (SSE) to handle the latency of LLM generation.

1. **Ingestion:** The React client captures unstructured text and posts it to the backend.
2. **Agentic Processing:** The Node.js server routes the text to OpenAI's models using a highly engineered system prompt.
3. **Deterministic Output:** The backend utilizes Zod to enforce a strict JSON schema contract. The LLM is restricted from hallucinating fields and must return data matching the exact required EMR structure (Age, Vitals, Symptoms, Triage Level, Alerts).
4. **Streaming:** As the LLM resolves the JSON chunks, the Node server streams the partial objects back to the client via SSE.
5. **Dynamic UI:** A custom React hook parses the stream, silently catches incomplete JSON fragments, and dynamically renders the triage dashboard.

## Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, shadcn/ui components.
* **Backend:** Node.js, Express.js, Vercel AI SDK, CORS.
* **Validation & Types:** TypeScript, Zod.
* **LLM:** OpenAI (gpt-4o-mini).

## Key Technical Features
* **Strict Schema Enforcement:** Overcomes the standard unreliability of LLM outputs by forcing deterministic JSON shapes.
* **Real-Time Streaming (SSE):** Reduces perceived latency to near-zero by updating the UI as the AI "thinks," rather than waiting for a complete network resolution.
* **Graceful Degradation:** Built-in error boundaries and fallback states for network timeouts, LLM failures, or missing patient demographics.
* **Decoupled Deployment:** Designed to have the UI hosted on Edge networks (Vercel) while the intensive API layer lives on dedicated cloud infrastructure (Azure App Service).

## Local Development Setup

### Prerequisites
* Node.js (v20+ recommended)
* An active OpenAI API Key

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/ramnjit/enterprise-triage-engine.git
cd ai-medical-scribe
\`\`\`

### 2. Backend Environment
Navigate to the backend directory, install dependencies, and configure your secrets.
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory:
\`\`\`text
OPENAI_API_KEY=sk-your-api-key-here
PORT=8080
FRONTEND_URL=http://localhost:3000
\`\`\`

### 3. Frontend Environment
Open a new terminal, navigate to the frontend directory, and install dependencies.
\`\`\`bash
cd frontend
npm install
\`\`\`

### 4. Run the Application
Start the backend microservice:
\`\`\`bash
# In the backend directory
npm run dev
\`\`\`
Start the frontend client:
\`\`\`bash
# In the frontend directory
npm run dev
\`\`\`
The UI will be available at `http://localhost:3000`.

## License
MIT