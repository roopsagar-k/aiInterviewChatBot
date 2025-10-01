## AI Interview Assistant

Full‑stack application to conduct a guided technical interview and evaluate a candidate using Google Gemini. The app extracts resume details, conducts a structured Q&A, and generates an interview evaluation.

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Redux Toolkit, Radix UI, Tailwind CSS
- **Backend**: Node.js, Express 5, TypeScript
- **AI**: Google Gemini (via `@google/genai`)

### Monorepo Structure

```
.
├─ backend/           # Express + TypeScript API
│  ├─ src/
│  │  ├─ config/env.ts       # Env loading (PORT, GEMINI_API_KEY, CLIENT_URL)
│  │  ├─ controllers/llm.controller.ts
│  │  ├─ services/llm.ts     # Gemini integration (gemini-2.5-flash)
│  │  ├─ routes/             # /api endpoints
│  │  ├─ prompt.ts           # Prompt builders
│  │  ├─ types.ts
│  │  └─ index.ts, server.ts # App and boot
│  └─ dist/                  # Build output
└─ frontend/         # React app (Vite)
   └─ src/
      ├─ lib/requestHandler.ts   # Axios client (VITE_BASE_URL)
      ├─ lib/apis.ts             # API wrappers
      ├─ slices/                 # Redux slices
      └─ components/             # UI
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A Google Gemini API key

### Environment Variables

Create `.env` files using the examples below. If `.env.example` files exist, copy them; otherwise, use these keys.

Backend (`backend/.env`):

```
# Server
PORT=3000
CLIENT_URL=http://localhost:5173

# Google Gemini
GEMINI_API_KEY=your-google-gemini-api-key
```

Frontend (`frontend/.env`):

```
# Base URL of the backend server (no trailing slash)
VITE_BASE_URL=http://localhost:3000
```

### Install Dependencies

Run in separate terminals (or sequentially):

```bash
cd backend && npm install
```

```bash
cd frontend && npm install
```

### Run in Development

Backend (http://localhost:3000):

```bash
cd backend
npm run dev
```

Frontend (http://localhost:5173):

```bash
cd frontend
npm run dev
```

### Production Build

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

---

## API Reference (Backend)

Base URL: `http://localhost:3000/api`

- POST `/get-data-from-text`

  - **Body**:
    ```json
    { "parsedText": "plain text extracted from resume" }
    ```
  - **Response** (`data.userDetails`):
    ```json
    {
      "userDetails": { "name": "...", "email": "...", "phone": "..." }
    }
    ```

- POST `/get-next-question`

  - Guides the interview. If required fields are missing, it asks for them; otherwise asks technical questions (2 easy → 2 medium → 2 hard).
  - **Body**:
    ```json
    {
      "missingFields": ["name", "email", "phone"],
      "chatHistory": [{ "role": "user", "text": "..." }],
      "currUserDetails": { "name": "...", "email": "...", "phone": "..." }
    }
    ```
  - **Response** (`data`):
    ```json
    {
      "currUserDetails": { "name": "..." },
      "chat": {
        "role": "assistant",
        "text": "...",
        "type": "easy|medium|hard"
      },
      "isCompleted": false
    }
    ```

- POST `/interview-evaluation`
  - Generates a summary evaluation of the interview.
  - **Body**:
    ```json
    {
      "chatHistory": [
        { "role": "user", "text": "...", "timestamp": 1720000000000 }
      ]
    }
    ```
  - **Response** (`data`):
    ```json
    {
      "pros": ["..."],
      "cons": ["..."],
      "summary": "...",
      "totalPoints": 8
    }
    ```

Notes:

- CORS origin is controlled by `CLIENT_URL`.
- The backend uses `@google/genai` with model `gemini-2.5-flash`.
- All responses are wrapped in a standard API response object.

---

## Frontend Integration

- Axios client base URL comes from `VITE_BASE_URL` (default: `http://localhost:3000`).
- API wrappers live in `frontend/src/lib/apis.ts`.
- Global error toasts and retry logic are handled in `frontend/src/lib/requestHandler.ts`.

---

## Available Scripts

Backend (`backend/package.json`):

- `npm run dev` – Start dev server with Nodemon
- `npm run build` – TypeScript build to `dist/`
- `npm start` – Build + run `dist/server.js`

Frontend (`frontend/package.json`):

- `npm run dev` – Vite dev server
- `npm run build` – Type-check and build
- `npm run preview` – Preview production build
- `npm run lint` – Lint sources

---

## Troubleshooting

- 401/403 from backend: verify `GEMINI_API_KEY` is valid and set on the backend.
- CORS errors: ensure `CLIENT_URL` matches the frontend origin and `VITE_BASE_URL` points to the backend.
- Empty or malformed AI responses: check model availability and token usage; logs are printed in the backend console.

---

