# CoHire rebuild: progress log

The owner is rebuilding CoHire by hand to learn it. The finished original is in `D:\projects\refer\CoHire` (the answer key). Read this file at the start of every session, and update it at the end of each work session.

## How to teach

- One small step at a time. Don't show the whole plan again.
- Explain and review. Don't write the code for the owner; short snippets to type by hand are fine, and when asked for code per step, give it.
- Simple, short English. Explain each new term the first time it appears.
- Keep everything in one file (`backend/index.js`) until it gets long, then split into folders.
- Add a library only when the owner hits the problem it solves.
- Give one small experiment per step.
- The owner tests the backend with the browser and Thunder Client before touching the frontend.
- The owner stops sessions on purpose to avoid over-learning. Don't push on.

## The plan

1. Express server with `GET /api/health`
2. A `POST` route that accepts data
3. Connect to MongoDB
4. `User` model
5. Auth: hash passwords (bcryptjs), JWT in an httpOnly cookie, `requireAuth`
6. Validation with zod, `HttpError`, one error middleware
7. Frontend basics (Vite, React, router, login and register, axios proxy, `["me"]` query)
8. Spaces, companies, three roles, approval flow
9. Jobs, filtered by the user's space
10. Requests (referral or interview), privacy rule, chat
11. File uploads (multer), hardening (helmet, cors, rate limit, morgan), seed and smoke scripts
12. Styling with Tailwind and shadcn

## Done

- **Steps 1 to 4:** server, POST route, MongoDB connection (database `cohire_learn` on a new Atlas cluster `cohire-learn`, user `cohire_app`), `User` model (`testUserSchema`).
- **Step 5, so far:**
  - `bcryptjs` hashing with cost 10; the schema field is `passwordHash` with `select: false`.
  - `email` is `unique`, `lowercase`, `trim`.
  - `POST /api/user` replies with `_id`, `name`, `email` only. `GET /api/users` hides the hash.
  - `POST /api/login` finds the user with `.select("+passwordHash")`, compares with `bcrypt.compare`, and gives the same 401 message for an unknown email and a wrong password. The typed email is lowercased first.

## Next

0. `jsonwebtoken`, `cookie-parser`, `helmet` and `morgan` are not installed (removed from `package.json` on purpose). Install each one only when its step needs it: `npm install jsonwebtoken` for the experiment, `npm install cookie-parser` for the cookie step.
1. Run the `jsonwebtoken` tamper experiment (`backend/try-jwt.js`, sign a token, change one character, `verify` fails); then delete that file.
2. Sign a token on successful login and set it in an httpOnly cookie (needs `cookie-parser`).
3. Write `requireAuth` middleware that reads the cookie, and protect `GET /api/users` with it.
4. Finish step 5, then step 6.

## Open items

- The unfinished doubts and steps are in Notion: CoHire / Backend / Steps and CoHire / Backend / Doubts. Step 5's page says "in progress"; update it as parts are finished, and when step 5 is done also add a doubt note on encryption vs hashing (the owner asked for this).
- Unique-email errors currently show the raw `E11000` message; step 6 replaces it.
- The POST route can crash on a missing `password` (`bcrypt.hash(undefined)`); step 6 (zod) fixes it.

## Facts that are easy to forget

- The Atlas free cluster only accepts allow-listed IPs. If the server prints `connection failed`, check Network Access first.
- `mongosh` needs the full `MONGO_URI` in quotes; without it, it looks for a local MongoDB.
- `.env` is never committed. Check `.gitignore` before the first commit.
