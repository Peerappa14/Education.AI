# AI Tutor India - Readme.ed

## Project Overview

AI Tutor India is a full-stack educational chatbot application built to help Indian students prepare for board exams and competitive exams like JEE, NEET, PUC, and SSLC. The application combines:
- A React + Vite frontend for interactive student chat and category selection
- An Express backend that connects to AI providers and PostgreSQL
- Retrieval-Augmented Generation (RAG) to search educational content before answering student questions

## Repository Structure

- `frontend/` - React app using Vite, Tailwind CSS, and Axios
- `backend/` - Express server with AI provider logic and PostgreSQL support
- `backend/database_setup.sql` - PostgreSQL schema for users, resources, chats, and messages
- `backend/seed_data.sql` - Sample educational knowledge base entries
- `backend/setup_instructions.md` - Database setup guide
- `backend/gemini.js` - Gemini multi-turn chat helper

## Logic and Implementation

### 1. User Flow Logic

1. User lands on the landing page and can start a free chat or log in.
2. If the user is not logged in, they get a limited free question quota (`3` free questions).
3. The user selects:
   - A category (JEE, NEET, SSLC, PUC, BE, Languages, Competitive Exams)
   - A subject subcategory
   - A language (`English`, `Kannada`, or `Hindi`)
4. The user types a question and sends it.
5. The frontend sends a POST request to `/api/chat` with:
   - `message`
   - `language`
   - `category`
   - `history`
   - `model`
6. The backend returns the AI answer and provider metadata.

### 2. Backend Provider Selection Logic

The backend loads provider credentials from environment variables:
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `HUGGINGFACE_TOKEN`
- Optional `PREFERRED_PROVIDER`

It uses the following logic:
- Try Gemini first when requested or preferred.
- If Gemini fails, fallback to Groq if available.
- If Groq fails, fallback to Hugging Face.
- If no provider is configured, it throws an error.

The provider code path is:
- `gemini.js` for Gemini multi-turn chat
- `groq-sdk` for Groq text completion
- `@huggingface/inference` for Mistral text generation

### 3. Retrieval-Augmented Generation (RAG)

The backend performs a database search before generating the AI response. This is important for exam accuracy.

Steps:
1. Query `educational_resources` using:
   - `stream` from selected category
   - `category` from selected subcategory
   - text search against `content`
2. Combine the top results into a `context` string.
3. Create a system prompt that includes:
   - A professional Indian AI tutor persona
   - Emotional tone rules for different user states
   - Selected language of response
   - Educational context from the search results
4. Send the full prompt plus the student message to the AI provider.

### 4. Prompt Engineering Logic

The system prompt in `server.js` is designed to:
- Enforce syllabus focus (NCERT / board-specific material)
- Adapt tone with emojis based on student behavior
- Use the requested language
- Mention the selected board and subject
- Guide the AI to answer clearly, step-by-step, and exam-oriented

This helps the AI remain relevant for Indian academic exams.

## Data and Database Logic

### Database schema in `backend/database_setup.sql`

- `users`
  - Stores signed-in users and subscription type
- `educational_resources`
  - Stores text content for syllabus, PYQs, notes, and exam patterns
- `chats`
  - Stores chat metadata if chat persistence is extended
- `messages`
  - Stores individual user/bot messages if chat persistence is extended

### Seed data logic in `backend/seed_data.sql`

The seed file demonstrates how to insert educational content for topics like:
- SSLC Science and Math
- BE Computer Science notes
- Competitive exam patterns and shortcuts

This sample data enables the app to search relevant knowledge before generating answers.

## Frontend Implementation Logic

### Main components

- `frontend/src/App.jsx`
  - Maintains login state, free question count, and view switching
  - Persists `user` and `freeQuestions` in `localStorage`
- `frontend/src/components/LandingPage.jsx`
  - Displays the hero section, app benefits, and CTA buttons
- `frontend/src/components/ChatTutor.jsx`
  - Renders chat interface, category selection, language selection, and message list
  - Implements free-question gating for unauthenticated users
  - Sends the chat request and displays AI response
  - Supports message copy, edit state, and chat history preview

### Key UI/UX logic

- If the user is not logged in and free questions reach `0`, the app opens the auth modal.
- Category change resets the chat to a fresh greeting message.
- Messages scroll to the bottom automatically.
- The chat uses icons and subject categories to create an exam-focused experience.

## Requirements

### Software requirements

- Node.js 18+ (for backend and frontend)
- PostgreSQL database
- npm installed
- Environment variables configured

### Required environment variables for backend

Create `.env` in `backend/` with:

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=ai_tutor_db
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GROQ_API_KEY=YOUR_GROQ_API_KEY
HUGGINGFACE_TOKEN=YOUR_HUGGINGFACE_TOKEN
PREFERRED_PROVIDER=gemini
```

### Optional frontend environment

In `frontend/`, you can set `VITE_API_BASE_URL` in a `.env` file if the backend URL differs from `http://localhost:5000`.

## Setup and Run Steps

1. Install backend dependencies:
   - `cd ai-edu-agent/backend`
   - `npm install`
2. Create PostgreSQL database:
   - `createdb ai_tutor_db` or use pgAdmin
3. Execute `backend/database_setup.sql` in PostgreSQL.
4. Insert sample data using `backend/seed_data.sql` or your own educational content.
5. Create backend `.env` with database creds and API keys.
6. Start backend server:
   - `npm run dev`
7. Install frontend dependencies:
   - `cd ../frontend`
   - `npm install`
8. Start frontend app:
   - `npm run dev`
9. Open the Vite URL shown in the console.

## How the Logic Works Step by Step

1. Student enters a question and chooses subject + language.
2. Frontend sends the question and metadata to `/api/chat`.
3. Backend checks if Gemini should be used first.
4. Backend queries PostgreSQL for relevant syllabus/text resources.
5. Backend builds an instruction-rich system prompt.
6. Backend sends the prompt and question to the AI provider.
7. AI provider returns a response.
8. Backend returns the response to the frontend.
9. Frontend displays the answer and model provider name.

## Notes and Future Improvements

- The current frontend stores chat state locally and does not persist full chat history to the backend yet.
- The backend supports provider fallback logic and can be extended to support more guardrails or more precise RAG retrieval.
- You can expand `educational_resources` with more NCERT, PYQ, and board-specific notes for better accuracy.

## Summary of the Core Logic

- Provider selection and fallback ensures the app keeps working even if one AI provider fails.
- RAG search improves answer accuracy by grounding the AI in real educational content.
- Prompt engineering focuses the AI on Indian exams and user-selected subjects.
- Free user gating provides trial usage before login or upgrade.
- Category + language selection customizes the response style and content.

---

This `Readme.ed` is designed to explain the implementation clearly for GitHub and to help you add the project documentation in the repo root.
