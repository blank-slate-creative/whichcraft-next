# WhichCraft site

The public website for the WhichCraft iPhone app, live at [whichcraft.beer](https://whichcraft.beer).
It is a small marketing site. It has no accounts, no database, and no server-side secrets.

## What is on it

| Path | What it is |
| --- | --- |
| `/` | Landing page, with the App Store link |
| `/about` | About WhichCraft |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |
| `/l` | Reader for a brew list shared from the app (see below) |

The App Store link lives in one place, `lib/constants.ts`. Every download button imports it.

## Run it

You need Node.js 20 or newer and npm 11.2.0 or newer. No environment variables are required
(`.env.example` says so).

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build   # production build
npm start       # serve the build
```

Other scripts:

- `npm run typecheck` runs TypeScript.
- `npm run lint` runs ESLint. `npm run lint:fix` fixes what it can.
- `npm test` runs the Vitest suite (the share reader's tests).
- `npm run format` runs Prettier.

## What it is built with

Next.js (App Router), React, TypeScript, and Tailwind CSS. The one shadcn/ui piece in use is
`components/ui/button.tsx`; add others only when a page needs them. Icons come from Lucide, and
the light and dark themes follow the visitor's system setting.

## Shared brew lists

`/l` opens a brew list shared from the app. The list travels in the link itself
(`https://whichcraft.beer/l#<payload>`); the part after the `#` is never sent to a server, so the
site stores nothing. The page shows the title and each beer's name and producer as plain text, is
`noindex`, and carries a "not verified by WhichCraft" line.

- Format and limits: `lib/share/brewlist.ts`.
- Shared test data, the contract with the iOS app: `lib/share/fixtures/shared-brewlist-v1.json` is
  copied byte for byte from WhichCraft-iOS (`WhichCraftTests/Fixtures/shared-brewlist-v1.json`),
  which owns it. Change it there first, then copy it here; never edit this copy. Its `contract`
  array lists the rules the reader enforces, and the tests read its `valid` and `invalid` cases.
- Tests: `npm test`.
- Universal links: `public/.well-known/apple-app-site-association` (served as `application/json`
  from `next.config.ts`) hands `/l` and `/l/` to the app (the only paths the app accepts as share links).

## Deploys

The site deploys from `main` on Vercel. Merging to `main` changes whichcraft.beer, so work goes
through a pull request.

## History

This repository once also held a web version of the app, with Supabase accounts and beer
collections. It was removed in commit `cb9b4a1` and is not coming back; the iOS app is the product.
The code, dependencies, and assets it left behind were deleted afterward.
