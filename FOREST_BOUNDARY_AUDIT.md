# BonsAI Forest Boundary Audit

Date: 31 August 2026

## Product Boundary

Ygrassil is the agent. BonsAI Forest is the product experience for visualizing systems, connections, automation flow, execution state, and system health. Existing Ygrassil outbound and sales infrastructure is preserved as frozen legacy infrastructure and must not automatically become BonsAI Forest.

## Entry Points

CURRENT FOREST ENTRY POINT: NO DEDICATED FOREST ENTRY POINT

CURRENT YGRASSIL ENTRY POINT: `src/main.tsx` routes `/ygrassil` and `#ygrassil` to `src/YgrassilPremiumHost.tsx`; `vercel.json` rewrites `/ygrassil` and `/ygrassil/` to `index.html`.

CURRENT SHARED ENTRY POINTS: `src/main.tsx` currently owns the Vite `index.html` route selection between BonsAI City and Ygrassil. `vite.config.ts` owns shared Vite build inputs and also registers local Ygrassil API middleware. `garden.html` points to `src/workshop-main.tsx`; `prototype.html` points to `src/prototype-main.tsx`.

## Why the Ygrassil hardening migration exists here

`supabase/migrations/20260831180000_ygrassil_database_hardening.sql` was created during the previous Ygrassil infrastructure hardening phase, before the user stopped database work and clarified the BonsAI product boundaries. It belongs to frozen legacy Ygrassil database infrastructure, not BonsAI Forest. It has not been moved, deleted, or applied by this audit.

## Boundary Table

| FILE / AREA | CURRENT PURPOSE | CURRENT OWNER | IMPORTED BY | RUNTIME USAGE | SHARED WITH | FOREST NEEDS IT? | SAFE TO MOVE? | RISK | RECOMMENDATION |
|---|---|---|---|---|---|---|---|---|---|
| `src/main.tsx` | Vite SPA route selector for City and Ygrassil | Shared shell | `index.html` | Runs primary local app | City, Ygrassil | Yes, only for a minimal Forest route | No | TEMPORARY_SHARED_DEPENDENCY | Add the smallest Forest route only; avoid router rewrite. |
| `vite.config.ts` | Vite config, build inputs, local Ygrassil API middleware | Shared build config | Vite CLI | Build/dev server config | City, Garden, Prototype, Ygrassil | No for V1 | No | SHOULD_BE_SEPARATED_LATER | Keep unchanged in Forest V1; later extract Ygrassil dev API plugin. |
| `vercel.json` | Production rewrites for Garden, Prototype, Ygrassil | Shared deploy config | Vercel | Production routing only | Garden, Prototype, Ygrassil | Not for local V1 | No | TEMPORARY_SHARED_DEPENDENCY | Do not modify until deployment phase is approved. |
| `package.json` | Shared scripts and dependencies | Shared repo | npm | Install, lint, test, build | All products | Yes indirectly | No | SAFE_SHARED_DEPENDENCY | Use existing React/Vite/framer-motion/lucide stack. |
| `tsconfig.app.json` | TypeScript include list for Vite app | Shared build config | `npm run typecheck` | Typecheck target | City, Office, Ygrassil | Yes | No | TEMPORARY_SHARED_DEPENDENCY | Add `src/forest/**/*.ts(x)` only. |
| `src/Ygrassil*.tsx` | Ygrassil agent UI and visual sales organism | Legacy Ygrassil | `src/main.tsx`, Ygrassil components | `/ygrassil` | Ygrassil only | No | No | SHOULD_BE_SEPARATED_LATER | Preserve intact; do not reuse as Forest logic. |
| `src/ygrassil*.css` | Ygrassil agent styling and HUD | Legacy Ygrassil | Ygrassil components | `/ygrassil` | Ygrassil only | No | No | SHOULD_BE_SEPARATED_LATER | Preserve intact. |
| `public/ygrassil-*` | Ygrassil visual reference assets | Legacy Ygrassil | Ygrassil CSS/TSX, Office preview image | `/ygrassil`, Office project preview | Ygrassil, Office preview | No | No | SHOULD_BE_SEPARATED_LATER | Preserve; do not brand as Forest. |
| `api/_ygrassil/*` | Server-only Ygrassil env, SMTP, IMAP, Supabase helpers | Legacy Ygrassil backend | `vite.config.ts`, `api/ygrassil/*`, tests | Local/API routes when called | Ygrassil | No | No | CRITICAL_CONTAMINATION | Frozen; Forest must not import this. |
| `api/ygrassil/*` | Ygrassil status and connection-test API handlers | Legacy Ygrassil backend | Deployment/serverless runtime | Only if endpoints are called | Ygrassil | No | No | CRITICAL_CONTAMINATION | Frozen; do not call during Forest V1. |
| `supabase/migrations/*ygrassil*` | Ygrassil database schema and hardening SQL | Legacy Ygrassil database | Supabase tooling/tests | Not used by Forest UI | Ygrassil | No | No | CRITICAL_CONTAMINATION | Frozen; do not apply or edit. |
| `tests/ygrassil-*` | Ygrassil env/migration tests and manual E2E notes | Legacy Ygrassil | `npm test` | Local tests only | Ygrassil | No | No | TEMPORARY_SHARED_DEPENDENCY | Keep passing; do not expand for Forest database. |
| `YGRASSIL_ARCHITECTURE.md` | Ygrassil architecture notes | Legacy Ygrassil | Human docs | Documentation | Ygrassil | No | Yes later | SHOULD_BE_SEPARATED_LATER | Keep; later move to Ygrassil package/docs. |
| `.env.example` | Shared example env including Ygrassil/Supabase/mail keys | Shared/Ygrassil config | Humans, env validation | Documentation/config only | Ygrassil, repo | No | No | CRITICAL_CONTAMINATION | Forest V1 must not add env needs. |
| `src/components/*` | BonsAI City shell and Office component set | City/Office | `src/main.tsx`, Next page | Root app, possible Office surface | City, Office | No | No | TEMPORARY_SHARED_DEPENDENCY | Do not modify for Forest V1. |
| `src/app/*` | Next-style BonsAI City wrapper and global CSS | City | Next runtime if used | City build path | City | No | No | TEMPORARY_SHARED_DEPENDENCY | Do not modify for Forest V1. |
| `src/App.tsx`, `src/styles.css`, `src/workshop-main.tsx` | BonsAI Garden/workshop brief builder | BonsAI Garden / Workshop | `garden.html` | `/garden` build input | Garden, Workshop | No | No | TEMPORARY_SHARED_DEPENDENCY | Do not duplicate inside Forest. |
| `src/prototype-main.tsx`, `src/prototype.css` | BonsAI Garden visual prototype | BonsAI Garden | `prototype.html` | `/prototype` build input | Garden | No | No | SAFE_SHARED_DEPENDENCY | Keep separate. |
| `src/BonsaiLanding.tsx`, `src/bonsai-landing.css`, `src/bonsai-premium.css` | Studio/Garden-like interactive landing concept | Studio/Garden experiment | Not currently imported by route selector | Not active unless imported | Studio/Garden experiments | No | Unclear | SHOULD_BE_SEPARATED_LATER | Do not use as Forest entry; ownership is ambiguous. |
| `src/AppOS.tsx`, `src/os-styles.css`, `src/BonsaiTaskTree.tsx`, `src/useBonsaiTasks.ts`, `src/bonsai-data.ts` | Task tree / OS experiment | Workshop/OS experiment | Not current Vite main | Not active unless imported | Workshop experiments | No | Unclear | SHOULD_BE_SEPARATED_LATER | Preserve untouched. |
| `api/send-order.js` | Garden/workshop order email endpoint | BonsAI Garden/Workshop | Deployment/serverless runtime | Sends order email when called | Garden/Workshop | No | No | CRITICAL_CONTAMINATION | Do not call or reuse for Forest. |
| `public/concepts/*`, `public/garden-central.png`, `public/bonsai-*` | Visual assets for Garden, City, Office, Studio experiments | Mixed visual assets | CSS/TSX previews | Static assets | Multiple products | Maybe later as references only | No | TEMPORARY_SHARED_DEPENDENCY | Forest V1 should create code-native mock visuals and avoid rebranding existing product screenshots. |

## Audit Result

No production database, Supabase table, RLS policy, SMTP, IMAP, DNS, or outbound integration was modified during this audit.

The main contamination risk is that Ygrassil server helpers and Supabase/email dependencies live in the same repository and Vite config as visual frontend products. For Forest V1, the safe path is to add a new isolated frontend module that uses mock TypeScript data only, does not import Ygrassil backend/frontend modules, and only touches the shared route selector enough to expose `/forest`.
