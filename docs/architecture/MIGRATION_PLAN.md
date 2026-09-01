# Migration Plan

Status: design only. Do not execute in Phase 1.

## Target Structure

```text
apps/
  city/
  garden/
  office/
  forest/

agents/
  lupus/
  ninja/
  ygrassil/
  odyseusz/
  sokrates/

packages/
  core/
  auth/
  database/
  events/
  ui/
  types/

docs/
supabase/
archive/
```

## Classification Legend

- KEEP: remain where it is for now.
- MOVE: move to a target app/agent/package later.
- MERGE: combine with another implementation later.
- REFACTOR LATER: keep behavior now, redesign internals later.
- ARCHIVE: preserve outside active runtime later.
- DELETE LATER: remove only after replacement and verification.
- UNKNOWN: needs owner decision.

## Current Source File and Directory Classification

| Current Path | Classification | Target | Notes |
|---|---|---|---|
| `api/` | MOVE | `packages/database` or app/agent API layer | Split Office-owned domain APIs from Ygrassil agent helpers later. |
| `api/send-order.js` | MOVE | `apps/garden` or `apps/office` API | Current website/order email handler; owner depends on product flow. |
| `api/_ygrassil/` | REFACTOR LATER | `agents/ygrassil` plus shared packages | Contains env/email/IMAP/Supabase helpers; must not own Office data. |
| `api/ygrassil/` | REFACTOR LATER | `agents/ygrassil` API surface | Keep outbound gated; connect to Office-owned data later. |
| `src/main.tsx` | REFACTOR LATER | app router/bootstrap split | Currently routes City, Office, Forest, and Ygrassil in one Vite entry. |
| `src/App.tsx` | MOVE | `apps/garden` or archive after owner review | Legacy website discovery/configuration flow. |
| `src/AppOS.tsx` | MOVE | `apps/garden` | BonsAI Garden/task-tree app shell. |
| `src/BonsaiLanding.tsx` | MOVE | `apps/garden` or marketing/site archive | Landing/visual website flow. |
| `src/BonsaiScene.tsx` | MOVE | `packages/ui` or owning app | Shared visual component candidate. |
| `src/BonsaiTaskTree.tsx` | MOVE | `apps/garden` | Garden task-tree UI. |
| `src/bonsai-data.ts` | MOVE | `apps/garden` or `packages/types` | Garden task-tree domain data. |
| `src/useBonsaiTasks.ts` | MOVE | `apps/garden` | Garden local task state. |
| `src/storage.ts` | REFACTOR LATER | `packages/core` or app-local storage | Used by Garden-like flows; clarify browser storage ownership. |
| `src/workshop-main.tsx` | MOVE | `apps/garden` | Garden Vite entry. |
| `src/workshopData.ts` | MOVE | `apps/garden` | Garden website brief/preference data. |
| `src/i18n.ts` | REFACTOR LATER | `packages/ui` or app-local i18n | Shared translation currently tied to Garden copy. |
| `src/components/` | REFACTOR LATER | `packages/ui` plus app components | Split product shells from reusable UI primitives. |
| `src/components/AppShell.tsx` | MOVE | `apps/city` | City shell. |
| `src/components/BusinessSnapshot.tsx` | MOVE | `apps/city` | City read-model UI. |
| `src/components/CityPulse.tsx` | MOVE | `apps/city` | City visual/status UI. |
| `src/components/CityVisual.tsx` | MOVE | `apps/city` | City visual component. |
| `src/components/ProgressControl.tsx` | MOVE | `apps/city` or `packages/ui` | Current owner appears City. |
| `src/components/ProjectInfoPanel.tsx` | MOVE | `apps/city` or `apps/office` | Clarify whether this is City read model or Office project detail. |
| `src/components/Sidebar.tsx` | REFACTOR LATER | `packages/ui` plus product nav | Contains Odyseusz reference mixed into shared sidebar. |
| `src/components/TodayPreview.tsx` | MOVE | `apps/city` or `apps/office` | Clarify product owner. |
| `src/components/TopStatus.tsx` | MOVE | `apps/city` or `packages/ui` | Shared status UI candidate. |
| `src/components/OfficeShell.tsx` | MOVE | `apps/office` | Office product shell; includes cross-product cards/agents. |
| `src/components/OfficeSunsetShell.tsx` | UNKNOWN | `apps/office` or archive | Present as untracked Phase 1 workspace drift; not part of baseline commit. |
| `src/components/office.css` | MOVE | `apps/office` | Office styles. |
| `src/components/office-sunset.css` | UNKNOWN | `apps/office` or archive | Present as untracked Phase 1 workspace drift; not part of baseline commit. |
| `src/components/projectVisualState.ts` | MOVE | `apps/city` or `packages/ui` | Visual state helper; owner depends on City/Office split. |
| `src/forest/` | MOVE | `apps/forest` | Forest product source. |
| `src/forest/ForestPage.tsx` | MOVE | `apps/forest` | Forest app page. |
| `src/forest/ForestScene.tsx` | MOVE | `apps/forest` | Forest visualization. |
| `src/forest/ForestInspector.tsx` | MOVE | `apps/forest` | Forest inspection UI. |
| `src/forest/ForestHealth.tsx` | MOVE | `apps/forest` | Forest health UI. |
| `src/forest/forest.mock.ts` | REFACTOR LATER | `apps/forest` fixture or tests | Mock data must not become source-of-truth business data. |
| `src/forest/forest.types.ts` | MOVE | `apps/forest` or `packages/types` | Forest types. |
| `src/forest/forest.css` | MOVE | `apps/forest` | Forest styles. |
| `src/YgrassilApp.tsx` | MERGE | `agents/ygrassil` | Local command-center implementation with local persistence. Merge conceptually with Premium Host later. |
| `src/YgrassilPremiumHost.tsx` | MERGE | `agents/ygrassil` | API-backed status/test surface. Should become the primary Ygrassil host or be merged into one Ygrassil app. |
| `src/YgrassilPremiumScene.tsx` | MERGE | `agents/ygrassil` or `packages/ui` | Premium scene implementation; reconcile with root scene. |
| `src/YgrassilRootScene.tsx` | MERGE | `agents/ygrassil` or archive | Earlier root scene implementation; compare behavior/assets before merging. |
| `src/ygrassil.css` | MERGE | `agents/ygrassil` | Styles for Ygrassil implementations. |
| `src/ygrassil-hud.css` | MERGE | `agents/ygrassil` | HUD styles; confirm whether still used. |
| `src/app/` | REFACTOR LATER | `apps/office` or remove duplicate Next runtime | Next App Router duplicate for Office. |
| `src/app/page.tsx` | REFACTOR LATER | `apps/office` | Duplicates Vite Office route. |
| `src/app/layout.tsx` | REFACTOR LATER | `apps/office` | Next layout. |
| `src/app/globals.css` | REFACTOR LATER | `packages/ui` or app styles | Shared by Vite and Next; too broad. |
| `src/prototype-main.tsx` | UNKNOWN | `archive` or assigned app | Prototype entry needs owner decision. |
| `src/prototype.css` | UNKNOWN | `archive` or assigned app | Prototype styles. |
| `src/lucide-react.d.ts` | KEEP | root or `packages/types` | Type shim; move when packages exist. |
| `src/vite-env.d.ts` | KEEP | root or app package | Move when apps split. |
| `index.html` | MOVE | `apps/city` | City Vite entry. |
| `garden.html` | MOVE | `apps/garden` | Garden Vite entry. |
| `prototype.html` | UNKNOWN | `archive` or assigned app | Prototype entry. |
| `bonsai-hero.html` | ARCHIVE | `archive` or Garden marketing | Standalone visual artifact. |
| `public/` | REFACTOR LATER | app assets plus `packages/ui` assets | Split City/Garden/Office/Forest/Ygrassil assets by owner. |
| `public/concepts/` | ARCHIVE | `archive` or Garden docs/assets | Concept images. |
| `supabase/` | KEEP | `supabase/` | Do not modify migrations in Phase 1. Later split logical ownership in schema docs. |
| `supabase/migrations/*ygrassil*.sql` | REFACTOR LATER | `supabase/migrations` | Existing migration names are historical; many tables are Office-owned. |
| `tests/` | REFACTOR LATER | app/agent/package test locations | Current Ygrassil tests stay until split. |
| `package.json` | REFACTOR LATER | workspace root package | Later convert to workspace scripts. |
| `package-lock.json` | REFACTOR LATER | workspace root lockfile | Keep one lockfile until workspace migration. |
| `vite.config.ts` | REFACTOR LATER | per-app Vite config or root tooling | Current config mixes products and Ygrassil dev API middleware. |
| `next.config.mjs` | REFACTOR LATER | `apps/office` if Next retained | Decide whether Office target runtime is Vite or Next. |
| `vercel.json` | REFACTOR LATER | root deployment routing | Do not change production routing in Phase 1. |
| `eslint.config.js` | KEEP | root tooling | Later workspace-aware lint config. |
| `tsconfig.json` | KEEP | root tooling | Later references/packages. |
| `tsconfig.app.json` | KEEP | root tooling | Later per-app configs. |
| `tailwind.config.ts` | KEEP | root tooling | Later shared UI package/app configs. |
| `postcss.config.mjs` | KEEP | root tooling | Later root/app split. |
| `FOREST_BOUNDARY_AUDIT.md` | KEEP | `docs/architecture` eventually | Could be moved into docs later. |
| `SOKRATES_WORKSPACE_MAP.md` | KEEP | `docs/architecture` eventually | Audit artifact from Phase 0. |
| `YGRASSIL_ARCHITECTURE.md` | KEEP | `docs/architecture` eventually | Current Ygrassil architecture note. |
| `BonsAI-OS-source-20260825-071104` | ARCHIVE | `archive/` | Embedded dated source snapshot must not remain mixed with live source indefinitely. |
| `.env.example` | UNKNOWN | root sample env | Currently untracked and excluded from Phase 0 commit; decide later whether sanitized sample should be tracked. |
| `.tmp-public-preview-*` | DELETE LATER | none | Temporary preview output. |
| `*.zip` audit/source archives | ARCHIVE or DELETE LATER | external artifact storage | Generated archives should not live in source tree long term. |
| `supabase/.temp/` | DELETE LATER | none | Supabase CLI cache/temp. |

## Ygrassil UI Merge Plan

Do not merge in Phase 1.

- Treat `YgrassilPremiumHost.tsx` as the likely integration/status host because it already calls backend status/test endpoints.
- Treat `YgrassilApp.tsx` as the richer local command-center workflow reference because it contains campaign/lead UI, local persistence, CSV import, lead detail, and approval/inbox placeholders.
- Compare `YgrassilPremiumScene.tsx` and `YgrassilRootScene.tsx` for visual/state overlap before choosing one scene API.
- Move Ygrassil UI under `agents/ygrassil` only after Office-owned data APIs are defined.
- Ensure Ygrassil writes lead/campaign/opportunity/conversation outputs to Office-owned contracts, not Ygrassil-owned tables.

## Non-Goals For Phase 1

- No source file moves.
- No runtime refactors.
- No Supabase migration edits.
- No RLS edits.
- No Vercel production routing changes.
- No deployment.
- No outbound email changes.

