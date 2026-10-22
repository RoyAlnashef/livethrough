# LiveThrough — Survival course marketplace

LiveThrough is a marketplace that connects outdoor enthusiasts with certified survival schools and instructors. Students browse and compare courses, save bookmarks, and manage their account; schools use an admin dashboard to manage courses, schools, students, and related content.

**Stack:** Next.js 15, React 19, TypeScript, Supabase, Tailwind CSS 4.

## Who it's for

- **Students:** Public marketplace (`/marketplace`), course detail pages, bookmarks, and account settings (`/account/*`).
- **Admins (schools/instructors):** Dashboard for courses, schools, students, ads, and settings (`/dashboard/*`).

## Prerequisites

- [Node.js](https://nodejs.org/) 22.23.4+ (22.x; includes [October 2026 security fixes](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)). Use [`.nvmrc`](.nvmrc): `nvm install && nvm use`.
- npm
- A [Supabase](https://supabase.com/) project

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd livethrough
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values from your Supabase project (Settings → API). See [Environment variables](#environment-variables).

4. Apply database migrations:

   - **Supabase CLI (recommended):** Link the project, then run migrations from [`supabase/migrations/`](supabase/migrations/):

     ```bash
     supabase db push
     ```

   - **Manual:** Run each SQL file in `supabase/migrations/` in filename order via the Supabase SQL editor.

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

6. **First admin:** Create the initial admin at [`/admin-setup`](http://localhost:3000/admin-setup). Later sign-ins use [`/admin-login`](http://localhost:3000/admin-login). Middleware protects `/account/*` (signed-in users) and `/dashboard/*` (admin role).

## Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (server-side admin actions; never expose to the client) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | No | Google AdSense client ID (production ads only; omit for local dev) |

## Development

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check (optional)
```

## Repository layout

```
app/                 # Next.js App Router (marketplace, dashboard, account, API routes)
components/          # UI and feature components
lib/                 # Supabase clients, server actions, types, utilities
hooks/               # React hooks
supabase/migrations/ # PostgreSQL migrations
```

## Contributing

1. Create a feature branch, make changes, and run `npm run lint` (and `npx tsc --noEmit` when you touch types).
2. Follow project workflow and standards in [CLAUDE.md](CLAUDE.md).
3. For product context and architecture, see [agent-os/product/mission.md](agent-os/product/mission.md), [agent-os/product/tech-stack.md](agent-os/product/tech-stack.md), and [agent-os/product/roadmap.md](agent-os/product/roadmap.md).
4. Domain-specific conventions live under [.claude/skills/](.claude/skills/) when relevant.

Use [Conventional Commits](https://www.conventionalcommits.org/) where practical (`feat:`, `fix:`, `docs:`, `refactor:`, etc.).

## Further documentation

- [Product mission](agent-os/product/mission.md)
- [Tech stack](agent-os/product/tech-stack.md)
- [Roadmap](agent-os/product/roadmap.md)

## License

This project is private and proprietary. All rights reserved.
