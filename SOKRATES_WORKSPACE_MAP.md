# Sokrates Workspace Map

Prepared: 2026-08-31

Purpose: exact workspace snapshot map for an external architecture audit by Sokrates. This file records source layout and configuration only. It intentionally does not include environment variable values, credentials, API keys, access tokens, database passwords, service-role keys, or deployment actions.

## Workspace Root

`C:\Users\user\Documents\ChatGPT\BonsAi Studio Website`

This is the repository/workspace root containing the apps configured for:

- `http://localhost:3000/`
- `http://localhost:5174/ygrassil/`
- `http://localhost:5174/office`

Live listener check during preparation:

- `http://localhost:5174/ygrassil/`: HTTP 200
- `http://localhost:5174/office`: HTTP 200
- `http://localhost:3000/`: connection refused at the time of this snapshot, but the same workspace contains the configured Vite dev script for `localhost:3000`.

## Directory Tree

Filtered tree for the audit snapshot. Build output, dependencies, caches, `.env*`, `.git`, and generated zip archives are excluded.

```text
BonsAi Studio Website
+-- api
|   +-- _ygrassil
|   |   +-- email.js
|   |   +-- env.js
|   |   +-- http.js
|   |   +-- imap.js
|   |   +-- supabase.js
|   +-- ygrassil
|   |   +-- send-test.js
|   |   +-- status.js
|   |   +-- test-imap.js
|   |   +-- test-smtp.js
|   +-- send-order.js
+-- BonsAI-OS-source-20260825-071104
|   +-- public
|   |   +-- bonsai-os-concept.png
|   |   +-- garden-central.png
|   |   +-- style-grove.png
|   +-- src
|   |   +-- App.tsx
|   |   +-- AppOS.tsx
|   |   +-- BonsaiScene.tsx
|   |   +-- main.tsx
|   |   +-- os-styles.css
|   |   +-- storage.ts
|   |   +-- styles.css
|   |   +-- vite-env.d.ts
|   |   +-- workshop-main.tsx
|   |   +-- workshopData.ts
|   +-- .gitignore
|   +-- garden.html
|   +-- index.html
|   +-- package-lock.json
|   +-- package.json
|   +-- tsconfig.app.json
|   +-- tsconfig.json
|   +-- vercel.json
|   +-- verification.png
|   +-- vite.config.ts
+-- public
|   +-- bonsai-timelapse
|   |   +-- frame-1.png
|   |   +-- frame-2.png
|   |   +-- frame-3.png
|   |   +-- frame-4.png
|   |   +-- frame-5.png
|   |   +-- frame-6.png
|   |   +-- frame-7.png
|   |   +-- frame-8.png
|   +-- concepts
|   |   +-- content-garden.png
|   |   +-- effects-shrine.png
|   |   +-- review-bridge.png
|   |   +-- sections-path.png
|   |   +-- style-grove.png
|   +-- bonsai-city-central-v1.png
|   +-- bonsai-hero-foreground-v2.png
|   +-- bonsai-office-cyber-tree-v2.png
|   +-- bonsai-office-three-panel-concept.png
|   +-- bonsai-os-concept.png
|   +-- bonsai-task-tree-concept.png
|   +-- bonsai-timelapse-source.png
|   +-- bonsai-tree-base.png
|   +-- garden-central.png
|   +-- itbonsai-hero-bonsai-cyber.webp
|   +-- itbonsai-hero-bonsai-transparent.png
|   +-- style-grove.png
|   +-- ygrassil-firefly.png
|   +-- ygrassil-forest.png
|   +-- ygrassil-garden.jpg
|   +-- ygrassil-reference-v2.png
|   +-- ygrassil-reference.png
+-- src
|   +-- app
|   |   +-- globals.css
|   |   +-- layout.tsx
|   |   +-- page.tsx
|   +-- components
|   |   +-- AppShell.tsx
|   |   +-- BusinessSnapshot.tsx
|   |   +-- CityVisual.tsx
|   |   +-- office.css
|   |   +-- OfficeShell.tsx
|   |   +-- Sidebar.tsx
|   |   +-- TodayPreview.tsx
|   |   +-- TopStatus.tsx
|   +-- App.tsx
|   +-- AppOS.tsx
|   +-- bonsai-data.ts
|   +-- bonsai-landing.css
|   +-- bonsai-premium.css
|   +-- BonsaiLanding.tsx
|   +-- BonsaiScene.tsx
|   +-- BonsaiTaskTree.tsx
|   +-- i18n.ts
|   +-- lucide-react.d.ts
|   +-- main.tsx
|   +-- os-styles.css
|   +-- prototype-main.tsx
|   +-- prototype.css
|   +-- storage.ts
|   +-- styles.css
|   +-- useBonsaiTasks.ts
|   +-- vite-env.d.ts
|   +-- workshop-main.tsx
|   +-- workshopData.ts
|   +-- ygrassil-hud.css
|   +-- ygrassil.css
|   +-- YgrassilApp.tsx
|   +-- YgrassilPremiumHost.tsx
|   +-- YgrassilPremiumScene.tsx
|   +-- YgrassilRootScene.tsx
+-- supabase
|   +-- migrations
|       +-- 20260831135000_ygrassil_core.sql
|       +-- 20260831180000_ygrassil_database_hardening.sql
+-- tests
|   +-- ygrassil-e2e-manual.md
|   +-- ygrassil-env.test.mjs
|   +-- ygrassil-migration.test.mjs
+-- .gitignore
+-- bonsai-hero-mobile-verification.png
+-- bonsai-hero-verification.png
+-- bonsai-hero.html
+-- eslint.config.js
+-- garden.html
+-- index.html
+-- LICENSE
+-- next-env.d.ts
+-- next.config.mjs
+-- package-lock.json
+-- package.json
+-- postcss.config.mjs
+-- prototype-desktop-check.png
+-- prototype-mobile-check-2.png
+-- prototype-mobile-check.png
+-- prototype-react-desktop.png
+-- prototype-react-mobile.png
+-- prototype-real-desktop.png
+-- prototype-real-mobile.png
+-- prototype-studio-desktop.png
+-- prototype-studio-mobile.png
+-- prototype.html
+-- share-ygrassil-phone.bat
+-- SOKRATES_WORKSPACE_MAP.md
+-- start-bonsai-office.bat
+-- start-ygrassil-android.bat
+-- tailwind.config.ts
+-- tsconfig.app.json
+-- tsconfig.json
+-- vercel.json
+-- verification.png
+-- vite.config.ts
+-- YGRASSIL_ARCHITECTURE.md
```

## Applications Found

- BonsAI City: Vite single-page app default route. Entry files: `index.html`, `src/main.tsx`, `src/components/AppShell.tsx`, `src/components/CityVisual.tsx`, `src/components/BusinessSnapshot.tsx`, `src/components/TodayPreview.tsx`, `src/components/TopStatus.tsx`, `src/components/Sidebar.tsx`.
- BonsAI Garden: Vite workshop/garden entry. Entry files: `garden.html`, `src/workshop-main.tsx`, `src/AppOS.tsx`, `src/BonsaiTaskTree.tsx`, `src/bonsai-data.ts`, `src/useBonsaiTasks.ts`, `src/storage.ts`, `src/workshopData.ts`, `src/os-styles.css`, `src/styles.css`.
- BonsAI Office: Vite route branch and Next App Router entry. Vite files: `src/main.tsx`, `src/components/OfficeShell.tsx`, `src/components/office.css`. Next files: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `next.config.mjs`.
- BonsAI Forest: represented through Ygrassil/Office visual assets and references, especially `public/ygrassil-forest.png`, `public/ygrassil-garden.jpg`, `src/ygrassil.css`, and `src/components/OfficeShell.tsx`.
- Ygrassil: Vite route branch and API-backed command-center/forest interface. Frontend files: `src/YgrassilPremiumHost.tsx`, `src/YgrassilPremiumScene.tsx`, `src/YgrassilApp.tsx`, `src/YgrassilRootScene.tsx`, `src/ygrassil.css`, `src/ygrassil-hud.css`, `YGRASSIL_ARCHITECTURE.md`. Backend/API files: `api/_ygrassil/*`, `api/ygrassil/*`, `supabase/migrations/*`, `tests/ygrassil-*`.
- Lupus: agent references inside `src/components/OfficeShell.tsx`; no dedicated Lupus source directory found in this workspace snapshot.
- Ninja: agent references inside `src/components/OfficeShell.tsx`; no dedicated Ninja source directory found in this workspace snapshot.
- Odyseusz: agent/persona reference inside `src/components/Sidebar.tsx`; no dedicated Odyseusz source directory found in this workspace snapshot.
- Shared components/libraries: `src/components/*`, `src/i18n.ts`, `src/storage.ts`, `src/workshopData.ts`, shared CSS files, root package/config files, and assets under `public/`.

## Routes and Dev Servers

- `/`: Vite default path renders BonsAI City through `src/main.tsx` and `AppShell`. Configured by `package.json` script `dev` as `vite --host localhost --port 3000`; also served by the active Vite process on port 5174 when opened at root.
- `/ygrassil/`: Vite path branch in `src/main.tsx`; renders `YgrassilPremiumHost`. Active listener observed at `localhost:5174`, HTTP 200. `vercel.json` also rewrites `/ygrassil` and `/ygrassil/` to `/index.html`.
- `/office`: Vite path branch in `src/main.tsx`; renders `OfficeShell`. Active listener observed at `localhost:5174`, HTTP 200.
- `/bonsai-office`: Vite path branch in `src/main.tsx`; renders `OfficeShell`.
- `#ygrassil`: hash branch in `src/main.tsx`; renders `YgrassilPremiumHost`.
- `#office`: hash branch in `src/main.tsx`; renders `OfficeShell`.
- `/garden`: rewrite in `vercel.json` to `garden.html`; `garden.html` loads `src/workshop-main.tsx`.
- `/prototype`: rewrite in `vercel.json` to `prototype.html`; `prototype.html` loads `src/prototype-main.tsx`.
- Next App Router `/`: `src/app/page.tsx` renders `OfficeShell` when running `npm run dev:next`.

Observed active dev process:

- PID `10740`: `node ...\vite\bin\vite.js --host localhost --port 5173 --host 0.0.0.0 --port 5174`

Launch/config files:

- `package.json`: `dev`, `dev:next`, `build`, `build:next`, `typecheck`, `typecheck:next`, `lint`, `test`
- `vite.config.ts`: Vite React config; build entries for `index.html`, `garden.html`, `prototype.html`; local API middleware for Ygrassil status/SMTP/IMAP tests.
- `next.config.mjs`: Next config.
- `vercel.json`: route rewrites for `/garden`, `/prototype`, `/ygrassil`.
- `start-bonsai-office.bat`: starts Vite on port 5174.
- `start-ygrassil-android.bat`: starts Vite on host `0.0.0.0`, port 5173.
- `share-ygrassil-phone.bat`: starts Vite on host `0.0.0.0`, port 5173 and localtunnel sharing.

## Backend and API Directories

- `api/send-order.js`: order/contact email API using `nodemailer`.
- `api/_ygrassil/env.js`: Ygrassil server environment configuration names, defaults, public status projection, protected secret name list.
- `api/_ygrassil/email.js`: SMTP transport and test-email helper.
- `api/_ygrassil/imap.js`: IMAP connection test helper using `imapflow`.
- `api/_ygrassil/supabase.js`: Supabase admin client factory using server-side Supabase credentials.
- `api/_ygrassil/http.js`: JSON/body/method helper functions.
- `api/ygrassil/status.js`: Ygrassil status API route.
- `api/ygrassil/test-smtp.js`: SMTP test API route.
- `api/ygrassil/test-imap.js`: IMAP test API route.
- `api/ygrassil/send-test.js`: guarded test-send API route.
- `vite.config.ts`: local dev middleware mirrors selected `api/ygrassil/*` endpoints for Vite.

## Supabase and Database

Supabase directories:

- `supabase/migrations`

Database migrations:

- `supabase/migrations/20260831135000_ygrassil_core.sql`: creates Ygrassil core tables, indexes, triggers, RLS policies, and `pgcrypto` extension.
- `supabase/migrations/20260831180000_ygrassil_database_hardening.sql`: hardens trigger search path, recreates RLS policies, and adds missing foreign-key indexes.

Schemas/tables visible in migrations:

- `campaigns`
- `leads`
- `lead_contacts`
- `website_audits`
- `business_research`
- `opportunities`
- `proposals`
- `email_threads`
- `email_drafts`
- `email_messages`
- `reply_classifications`
- `followups`
- `suppression_list`
- `activity_log`
- `sending_events`
- `system_settings`

Authentication and authorization references:

- Supabase Auth user ownership appears through `auth.uid()` predicates in RLS policies.
- Frontend/client Supabase public keys are represented by environment variable names only.
- Server-side Supabase secret key use is isolated to backend helper code and excluded from browser-facing code by convention.

## Environment Variable Names

Collected from source/configuration references and `.env.example` keys only. Values were not read into this map.

- `ADMIN_TEST_EMAIL`
- `AI_API_KEY`
- `AI_PROVIDER`
- `DAILY_SEND_LIMIT`
- `EMAIL_TEST_MODE`
- `IMAP_HOST`
- `IMAP_PASSWORD`
- `IMAP_PORT`
- `IMAP_SECURE`
- `IMAP_USER`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `OUTBOUND_ENABLED`
- `SMTP_HOST`
- `SMTP_PASS`
- `SMTP_PASSWORD`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SUPABASE_SECRET_KEY`

Protected server-secret names listed by code:

- `SMTP_PASSWORD`
- `IMAP_PASSWORD`
- `SUPABASE_SECRET_KEY`
- `AI_API_KEY`

## Integrations

- Supabase: `@supabase/supabase-js`, Ygrassil admin client helper, migrations, RLS policies.
- Email sending: `nodemailer`, SMTP configuration variables, `api/send-order.js`, `api/_ygrassil/email.js`.
- Email inbox: `imapflow`, IMAP configuration variables, `api/_ygrassil/imap.js`.
- AI provider placeholder: `AI_PROVIDER`, `AI_API_KEY`, and Ygrassil architecture documentation.
- Vercel/serverless routing: `api/*`, `vercel.json`, `next.config.mjs`.
- Vite local middleware: `vite.config.ts`.
- Frontend 3D/animation: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `gsap`.

## Code Mixing Multiple BonsAI Products

Files that appear to combine or route multiple BonsAI products:

- `src/main.tsx`: single Vite entry point switches between BonsAI City, Ygrassil, and BonsAI Office based on path/hash.
- `src/components/OfficeShell.tsx`: Office dashboard includes product/project cards and agent entries for BonsAI Garden, BonsAI Office, Ygrassil, Lupus, and Ninja.
- `src/components/Sidebar.tsx`: shared sidebar includes an Odyseusz reference while being used by the City shell.
- `vite.config.ts`: one Vite project config serves multiple HTML entries and local Ygrassil API middleware.
- `vercel.json`: one deployment config rewrites Garden, Prototype, and Ygrassil routes into the same project.
- `package.json`: one package controls Vite, Next, tests, build commands, and dependencies for all products in this workspace.
- `YGRASSIL_ARCHITECTURE.md`: documents Ygrassil inside the BonsAI Studio ecosystem and references implementation state across frontend, backend, data model, and integrations.
- `BonsAI-OS-source-20260825-071104`: dated source snapshot embedded inside the current workspace and containing earlier BonsAI OS/Garden source files.

## Package Contents Policy

The audit archive should include the current source/config/documentation snapshot and exclude:

- `.git`
- `node_modules`
- `dist`
- `build`
- `.next`
- `coverage`
- `.vercel`
- `.codex-remote-attachments`
- `.tmp-public-preview-*`
- `supabase/.temp`
- `.env`
- `.env.*`
- secrets, credentials, API keys, access tokens, database passwords, service-role keys
- cache/temp files
- existing generated zip archives

