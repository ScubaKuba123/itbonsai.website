# BonsAI Architecture Contract

Status: Phase 1 contract, before source moves or backend architecture changes.

This document defines the target ownership model for the BonsAI Ecosystem. It is authoritative for future refactors, migrations, routing work, and agent integration. Current files may still violate this contract; those violations are migration inputs, not permission to refactor in Phase 1.

## Core Rule

Agent != Product.

Ygrassil is an agent. Ygrassil is not Forest.

Forest is the integration and automation product/layer. Forest does not own sales, lead, client, proposal, or conversation domain data.

## Layer 1: Product Layer

Products are user-facing or system-facing bounded applications. Products own product-specific workflows and, where applicable, domain data.

- BonsAI Garden: customer-facing website discovery, website configuration, and website brief creation.
- BonsAI Office: operational system for clients, leads, projects, conversations, meetings, decisions, requirements, proposals, campaigns, opportunities, and business work.
- BonsAI Forest: integration and automation layer for connections, workflows, triggers, automation runs, execution logs, failures, and system health.
- BonsAI City: visual company overview and read model. City reads derived business metrics; it does not own source business data.

## Layer 2: Agent Layer

Agents perform bounded work for products or shared workflows. Agents may read and write only through explicit product/core permissions.

- Lupus: lead discovery.
- Ygrassil: outbound sales and prospecting agent.
- Ninja: conversation and client intelligence.
- Odyseusz: high-level coordination.
- Sokrates: architecture and system integrity.

Agents must not become hidden product owners. If an agent creates or updates business data, the destination owner is the relevant product or Shared Core, not the agent itself.

## Layer 3: Shared Core

Shared Core must remain small. It exists only for cross-product identity, access, eventing, and audit primitives that cannot belong to one product.

Shared Core owns:

- auth
- organizations
- memberships
- roles
- permissions
- agent permissions
- events
- notifications
- audit log

Shared Core must not absorb product domain models such as leads, website briefs, projects, workflow definitions, proposals, conversations, or business metrics unless they are genuinely cross-product primitives.

## Dependency Direction

- Products may depend on Shared Core.
- Agents may depend on Shared Core and explicit product APIs/contracts.
- City may consume derived read models and events.
- Forest may consume events and product API contracts to execute workflows.
- Products must not depend on agent-internal state for source-of-truth data.
- Agents must not directly own product tables.

## Current Implementation Reality

The current workspace is a mixed Vite/Next project with shared source under `src/`, API routes under `api/`, and Supabase migrations under `supabase/migrations/`. Product and agent boundaries are currently represented by file naming, route branching, and UI composition rather than package-level isolation.

This contract is intended to guide later phases that split runtime applications, agents, shared packages, and database ownership without changing behavior prematurely.

