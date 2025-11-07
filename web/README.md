# Web

Next.js App Router project scaffolded by Codex.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## Getting Started

1. Install dependencies

   npm install

2. Run the dev server

   npm run dev

3. Open the app at

   http://localhost:3000

## Environment

- Create a local env file by copying the example:

  cp .env.example .env.local

- Variables:
  - `ADMIN_TOKEN`: Optional. When set, API mutations (POST/PUT/PATCH/DELETE under `/api/jobs`) require header `x-admin-token: <ADMIN_TOKEN>`. Leave empty to keep endpoints open in dev.
  - `SITE_URL`: Used by the jobs RSS feed to produce absolute links (defaults to `http://localhost:3000`). Set to your production domain when deploying.

Next.js automatically loads variables from `.env.local`.

### Useful Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – start production server (after build)
- `npm run lint` – run ESLint

### Notes

- API example: `GET /api/hello`
- Global styles live in `app/globals.css` with Tailwind enabled.
