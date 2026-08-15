# KindlePool Web

The frontend for [KindlePool](https://kindlepool.app) — micro-sponsor pools for creators on Stellar Soroban. **Fund the work, not the creator.**

Users browse pools, create pools, fund them, vote on delivered work, and resolve disputes — all with their own Stellar wallet. An email login provides account-level features.

> Backend, contract, and SDK live in [`abbasiwa/kindlepool-api`](https://github.com/abbasiwa/kindlepool-api).

---

## Overview

- **Browse** — explore pools, filters, search, sort
- **Create** — multi-step pool creation with templates and milestones
- **Fund & vote** — deposit, approve/reject work, finalize, cancel, claim refunds
- **Disputes** — raise, arbitrate, appeal
- **Dashboard** — pools you created or funded
- **Email login** — magic-link sign-in with wallet-linking
- **Docs** — contract spec, security, legal pages
- **PWA** — installable, offline-first
- **i18n** — English, Spanish, French

---

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4 (design tokens)
- Stellar wallet integration (Freighter)
- `@abbasiwa/kindlepool-sdk` — contract + API client
- react-router, framer-motion, react-i18next, vitest

---

## Repository layout

```
web/            # the PWA app (pages, components, layouts, lib, design, i18n)
widget/         # embeddable pool widget
vercel.json     # Vercel build + routing config
```

---

## Getting started

```bash
npm install              # workspace install (web + widget)
cp .env.example .env.local
npm run dev
```

Set `VITE_KINDLEPOOL_CONTRACT_ID` and `VITE_INDEXER_URL` in `.env.local`. The example file documents every variable.

---

## Build & test

```bash
npm run build   # docs fetch + sitemap + typecheck + build
npm test        # vitest
npm run lint    # oxlint
```

---

## Deployment

Hosted on Vercel. `vercel.json` sets the build command and output directory.

```bash
vercel link --yes
vercel --prod --yes
```

Build-time variables (e.g. `NODE_AUTH_TOKEN`, `GITHUB_TOKEN`, and the `VITE_*` set) are configured in the Vercel project settings, not committed.

---

## Design system

The UI uses a two-layer design-token system in `src/design/tokens.ts` (primitives + semantic roles), with a single accent color, a fixed spatial scale, and Plus Jakarta Sans typography. Mobile and desktop get distinct layouts via `useLayout()`.

---

## License

MIT
