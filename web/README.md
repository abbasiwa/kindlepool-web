# KindlePool Web

Frontend PWA for KindlePool — micro-sponsor pools on Stellar Soroban.

## Stack

- Vite + React 19 + TypeScript
- `@stellar/freighter-api` — wallet
- `@mikwansa/kindlepool-sdk` — contract + indexer API client (from GitHub Packages)
- Tailwind CSS 4

## Architecture (Phase 1 — web uses contracts)

```
Browser (React PWA)
  │
  ├─ Writes ──► Freighter signs ──► @mikwansa/kindlepool-sdk KindlePoolContract
  │                                   (build → simulate → assemble → sign → submit)
  │
  └─ Reads ──► KindlePoolAPI (indexer backend, /api/v1)
```

- `src/lib/sdk.ts` — contract + API singletons from `VITE_*` env vars
- `src/lib/contract.ts` — `walletSigner()` bridges the wallet's `signAndSubmit` to the SDK
- `src/lib/relayer.ts` — gasless relay client (fee-bump via backend)
- Pages call `contract().create/deposit/vote/...` for writes and `getApi().listPools/getPool/...` for reads

## Env vars

See `.env.example`. Required: `VITE_KINDLEPOOL_CONTRACT_ID`, `VITE_INDEXER_URL`.

## Commands

```bash
npm install        # needs NODE_AUTH_TOKEN for the private SDK
npm run dev
npm run build
npm test           # vitest
npm run lint
```
