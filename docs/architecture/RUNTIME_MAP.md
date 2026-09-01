# Runtime Map

Status: Phase 1 contract and current runtime inventory.

## Current Route Map

| Route | Entry File | Product | Current Server | Current Port | Build System | Shared Dependencies | Backend Dependencies | Target Runtime |
|---|---|---|---|---|---|---|---|---|
| `/` | `index.html` -> `src/main.tsx` -> `AppShell` | City | Vite dev script | `3000` configured; also available under active Vite ports | Vite | React, React DOM, lucide-react, shared CSS/components | none direct | `apps/city` |
| `/garden` | `vercel.json` rewrite -> `garden.html` -> `src/workshop-main.tsx` | Garden | Vite / Vercel rewrite | Vite configured `3000`; deployment rewrite currently configured | Vite | React, shared task/storage/data modules | `api/send-order.js` through legacy Garden flow | `apps/garden` |
| `/office` | `src/main.tsx` route branch | Office | Vite active workspace server | `5174` observed live; `3000` configured by script | Vite | React, Office components, shared CSS/assets | none direct in route branch | `apps/office` |
| `/bonsai-office` | `src/main.tsx` route branch | Office | Vite active workspace server | `5174` observed live; `3000` configured by script | Vite | React, Office components, shared CSS/assets | none direct in route branch | `apps/office` |
| `/ygrassil` | `vercel.json` rewrite -> `index.html`; `src/main.tsx` route branch -> `YgrassilPremiumHost` | Ygrassil agent UI | Vite active workspace server | `5174` observed live; `3000` configured by script | Vite | React, lucide-react, Ygrassil CSS/scenes | `api/ygrassil/*`, `api/_ygrassil/*`, Supabase/email/IMAP helpers | `agents/ygrassil` UI/admin surface plus Office-owned data APIs |
| `/prototype` | `vercel.json` rewrite -> `prototype.html` -> `src/prototype-main.tsx` | Prototype / unknown future owner | Vite / Vercel rewrite | Vite configured `3000`; deployment rewrite currently configured | Vite | React, prototype CSS/assets | none identified | `archive` or assigned app after decision |
| Next `/` | `src/app/page.tsx` -> `OfficeShell` | Office | Next dev script | default Next port when `npm run dev:next` | Next.js App Router | React, Office components, `src/app/globals.css` | Next/Vercel runtime only; no route handlers found under `src/app` | `apps/office` or remove duplicate path after migration |

## Current Dev Commands

- `npm run dev`: `vite --host localhost --port 3000`
- `npm run dev:next`: `next dev`
- `start-bonsai-office.bat`: `npm.cmd run dev -- --port 5174`
- `start-ygrassil-android.bat`: `npm.cmd run dev -- --host 0.0.0.0 --port 5173`
- `share-ygrassil-phone.bat`: Vite on host `0.0.0.0`, port `5173`, plus localtunnel.

## Current Build Systems

- Vite builds `index.html`, `garden.html`, and `prototype.html` from one config.
- Next.js App Router exists in the same source tree and renders Office at `src/app/page.tsx`.
- Vercel rewrites route multiple product paths into the same Vite HTML files.

## Duplicate Vite/Next Execution Paths

- Office currently has a Vite path (`/office`, `/bonsai-office`, hash `#office`) and a Next App Router path (`src/app/page.tsx`).
- Shared CSS overlaps: Vite imports `src/app/globals.css`, while Next also imports `src/app/globals.css` through `src/app/layout.tsx`.
- Vercel routing and Vite route branching both participate in `/ygrassil`.
- Vite build inputs include multiple products/prototypes in one bundle configuration.

## Backend Runtime Dependencies

- `api/send-order.js`: nodemailer SMTP order/contact handler.
- `api/ygrassil/status.js`: public Ygrassil system status.
- `api/ygrassil/test-smtp.js`: SMTP test endpoint.
- `api/ygrassil/test-imap.js`: IMAP test endpoint.
- `api/ygrassil/send-test.js`: guarded email test endpoint.
- `api/_ygrassil/*`: shared Ygrassil env, email, IMAP, Supabase, and HTTP helpers.
- `vite.config.ts`: local middleware mirrors selected Ygrassil API endpoints in Vite dev.

## Runtime Freeze

Phase 1 does not change routing, build commands, Vercel rewrites, Supabase, SMTP, IMAP, or outbound settings.

