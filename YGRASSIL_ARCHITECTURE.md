# Ygrassil architecture workshop

This repository currently contains the Ygrassil command-center frontend slice plus a Living Cyber Roots WebGL interface at `/ygrassil`. It is intentionally safe to run without external credentials: campaigns and leads persist in browser local state, outbound is visibly locked, and no email is sent from the browser.

## Product layers

### Frontend

- Vite + React + TypeScript
- `src/YgrassilApp.tsx` owns the local interaction shell and view state
- `src/ygrassil.css` contains the Ygrassil design system and responsive rules
- `src/YgrassilRootScene.tsx` renders the central organism with React Three Fiber, `TubeGeometry`, instanced flow particles, a breathing core, pointer-aware camera damping, and state/autonomy controls
- Existing BonsAI experiences remain available at `/bonsai` or `#bonsai`

### Backend target

- Server-side API routes or server actions
- Zod validation at every input boundary
- Supabase Auth for the single administrator in v1
- Supabase service-role access only on the server
- Nodemailer for SMTP and ImapFlow for scheduled IMAP sync

### Database target

The first migration should create: `users`, `campaigns`, `leads`, `lead_contacts`, `website_audits`, `business_research`, `opportunities`, `proposals`, `email_drafts`, `email_messages`, `email_threads`, `reply_classifications`, `followups`, `activity_log`, `suppression_list`, `sending_events`, and `system_settings`.

Important indexes: normalized domain, email, status, country, campaign id, created at, next follow-up at, sent at, and reply status. Enable RLS on every lead, email, and intelligence table.

### AI layer

Introduce an `AIProvider` interface with `analyseBusiness`, `analyseWebsite`, `detectOpportunities`, `scoreLead`, `generateProposal`, `generateEmail`, and `classifyReply`. Persist provider, model, generation time, prompt version, and output. Unknowns must remain explicitly marked as unknown or inferred.

### Lead discovery layer

Introduce a `LeadDiscoveryProvider` interface. v1 ingestion methods are already represented in the UI as manual business entry and CSV import. Search APIs, Places providers, and manual URL imports can plug into the same normalized lead pipeline later.

### Email and safety layer

- All SMTP/IMAP work must remain server-side.
- `OUTBOUND_ENABLED=false` is the production lock.
- `EMAIL_TEST_MODE=true` redirects outgoing prospect messages to the administrator test inbox.
- Approval is required even when outbound is enabled.
- Enforce the 10-new-prospects-per-24-hours limit and five-minute delay on the server.
- Check email and domain suppression immediately before every send.

## Current workshop scope

Implemented: dashboard shell, zero-state metrics, navigation, safety status, campaign creation, manual lead entry, domain normalization and duplicate protection, CSV template download, CSV import, lead search, lead detail drawer, local persistence, and responsive mobile behavior.

The Living Cyber Roots surface adds: genuine WebGL root geometry, continuous instanced particle flow, core heartbeat, state-driven IDLE/WORKING/PROCESSING/WAITING/BLOCKED/SUCCESSFUL modes, ROOT/BRANCH/LEAF autonomy propagation, hover throughput readout, and clickable workflow stages.

Opera note: direct `/ygrassil` requests are rewritten to the Vite entry page, and the scene performs a WebGL capability probe before mounting React Three Fiber. If Opera has hardware acceleration disabled, the interface stays usable and explains how to re-enable it instead of failing to a blank surface.

Not yet provider-backed: authentication, Supabase persistence, website crawling, measured audits, AI generation, SMTP/IMAP, reply matching, automated jobs, and production email sending. These should be added in the phase order from the master build prompt.

## Phase handoff

1. Add Supabase schema, Auth, RLS, and server-side repositories.
2. Move campaign/lead mutations behind validated API routes.
3. Add the audit and research job model with cooldown/caching.
4. Add AI provider adapters and traceability records.
5. Add draft/approval queue and real test-mode SMTP.
6. Add suppression, rate limits, sending windows, and outbound lock enforcement.
7. Add IMAP polling, reply classification, follow-ups, CRM pipeline, and analytics.
