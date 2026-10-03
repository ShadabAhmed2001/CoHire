# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

CoHire is a monorepo with two independent npm packages (no root `package.json`; run npm commands inside each folder):

- `frontend/` — Vite + React 19 (JavaScript, ESM). Linted with oxlint.
- `backend/` — Node.js (ESM: use `import`/`export`, include `.js` extensions in local imports) with Express 5 + Mongoose (MongoDB). Auth-related deps (bcryptjs, jsonwebtoken, cookie-parser) are installed. Entry point is `backend/index.js` (middleware setup, `/api/health`, connects to MongoDB via `MONGO_URI` before listening). Copy `backend/.env.example` to `.env` to configure.

## Commands

Frontend (run from `frontend/`):

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run lint` — oxlint
- `npm run preview` — serve the production build

Backend (run from `backend/`):

- `npm run dev` — `node --watch index.js` (built-in watch; nodemon was deliberately avoided due to audit vulnerabilities)
- `npm start` — `node index.js`

There is no test runner configured in either package.
