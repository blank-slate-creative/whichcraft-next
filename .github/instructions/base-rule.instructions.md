---
name: Base Rules
description: Core development guidelines for the whichcraft-next project
applyTo: '**'
---

# WhichCraft site

## Overview

This repository is the marketing website for the WhichCraft iOS app (whichcraft.beer): a landing page, About, Privacy, Terms, and the `/l` shared brew-list reader. It has no accounts, no database, and no backend. The web version of the app was removed and is not coming back; do not rebuild any of it.

## Stack

- Next.js with the App Router, React, TypeScript
- Tailwind CSS, with shadcn/ui components only where a page uses them (`components/ui/button.tsx` today)
- Lucide icons

## Development Guidelines

- Use TypeScript for all code
- Prefer server components; use client components only where a page needs them
- Write tests for logic, such as the share reader in `lib/share`
- Keep files under 500 lines of code
- Reuse existing components before creating new ones
- Get icons from Lucide
- Follow the existing code style and patterns
- Avoid making any major updates outside of the scope of the request
- Add no new service, tracker, or analytics without the owner's approval
- Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before opening a pull request

## Project Structure

```
whichcraft-next/
├── app/          # Pages: /, /about, /privacy-policy, /terms-of-service, /l
├── components/   # Navbar, Footer, landing and share components, ui/button
├── lib/          # constants (App Store URL), utils, share/ (brew-list decoder and fixtures)
└── public/       # Screenshots and the apple-app-site-association file
```
