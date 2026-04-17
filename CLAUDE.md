# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation supports all 11 document types via AI chat with document-type detection and routing. Users can sign up, sign in, save documents to their account, and reload them later.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
The frontend is statically built (`output: "export"`) and served by FastAPI from `backend/frontend_static/`.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Completed (PL-4)
- Docker multi-stage build (Node frontend + Python backend)
- FastAPI backend with SQLite (fresh DB each container start)
- Next.js static export served by FastAPI at localhost:8000
- Auth routes: POST /api/auth/signup, POST /api/auth/signin, POST /api/auth/signout, GET /api/auth/me
- Start/stop scripts for Mac, Linux, Windows
- Mutual NDA form with live preview and PDF download

### Completed (PL-5)
- AI chat interface replaces manual form for NDA creation
- Uses LiteLLM via OpenRouter with Cerebras inference (gpt-oss-120b model)
- Structured outputs for reliable field extraction from conversation
- Live preview updates as AI extracts fields from chat
- AI greets user, asks questions conversationally, and confirms when complete
- Download button appears when all required fields are gathered

### Completed (PL-6)
- Support for all 11 document types from catalog.json
- AI detects document type from user requests and routes accordingly
- Document registry (`frontend/lib/documentRegistry.ts`) maps catalog entries to field schemas
- Dedicated preview/PDF components for Mutual NDA, Cloud Service Agreement, Pilot Agreement
- Generic preview/PDF component for remaining 8 types (Design Partner, SLA, Professional Services, Partnership, Software License, DPA, BAA, AI Addendum)
- `DocumentCreator` orchestrator and `DocChat` AI chat panel components
- Shared `SignatureSection` component
- Auto-focus chat input after sending messages
- AI always asks follow-on questions when more information is needed

### Completed (PL-7)
- Functional user authentication with JWT tokens in HttpOnly cookies
- User signup and signin with email/password (bcrypt password hashing)
- `AuthContext` provider bootstrapped from `GET /api/auth/me` on mount
- `AuthModal` component — combined sign-in/sign-up with tab switcher
- `UserMenu` dropdown — shows email, My Documents, Sign Out when authenticated; Sign In button when not
- Document persistence — users can save completed documents to their account (auto-named by type + date)
- `documents` SQLite table with user FK, doc_type, fields (JSON), and timestamps
- Protected CRUD endpoints: save, list, get, delete documents
- `MyDocumentsModal` — lists saved documents; click to load (restores doc type + fields), delete button per row
- New Document button in preview toolbar to reset the current session
- Save button appears alongside Download PDF when a document is complete

### Current API Endpoints (live)
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in and receive JWT cookie
- `POST /api/auth/signout` - Clear auth cookie
- `GET /api/auth/me` - Get current user info
- `GET /api/health` - Health check
- `POST /api/chat` - AI chat for all document types — detects type, extracts fields via structured outputs (LiteLLM/OpenRouter/Cerebras)
- `POST /api/documents` - Save a document (auth required)
- `GET /api/documents` - List current user's documents (auth required)
- `GET /api/documents/{id}` - Get a single document (auth required, owner only)
- `DELETE /api/documents/{id}` - Delete a document (auth required, owner only)

## Docker / Corporate Network Notes
The build works on corporate networks with TLS-intercepting proxies:
- Python packages: installed via `pip --trusted-host` (see `backend/requirements.txt`)
- npm packages: `npm config set strict-ssl false` before `npm ci`
- Google Fonts: replaced with the `geist` npm package (`next/font/local`) — no external font downloads at build time
- A `.dockerignore` excludes `frontend/node_modules` so the Linux build isn't overwritten by Windows binaries
