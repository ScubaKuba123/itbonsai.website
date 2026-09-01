# Product Boundaries

Status: Phase 1 contract. Do not treat current file placement as final ownership.

## BonsAI Garden

OWNS:

- Website briefs.
- Website preferences.
- Website assets.
- Customer-facing website discovery/configuration state.

READS:

- Shared Core auth, organization, membership, roles, permissions.
- Office client/project context only when a website brief is attached to business work.
- Derived status from Forest automation runs if a Garden workflow is automated.

WRITES:

- Website briefs.
- Website preferences.
- Website assets.
- Garden-specific UI preferences.

MUST NOT OWN:

- Leads/prospects.
- Clients.
- Projects.
- Campaigns.
- Opportunities.
- Proposals.
- Business conversations.
- Meetings.
- Automation execution logs.
- City metrics.

PRODUCES EVENTS:

- `garden.website_brief.created`
- `garden.website_brief.updated`
- `garden.website_asset.added`
- `garden.preferences.updated`

CONSUMES EVENTS:

- `office.project.created`
- `office.client.updated`
- `forest.workflow.completed`
- `forest.workflow.failed`

## BonsAI Office

OWNS:

- Leads/prospects.
- Clients.
- Projects.
- Campaigns.
- Opportunities.
- Proposals.
- Business conversations.
- Meetings.
- Decisions.
- Requirements.
- Business work records.

READS:

- Shared Core auth, organizations, memberships, roles, permissions.
- Garden website briefs and assets when linked to a project/client.
- Forest automation status, run summaries, and failure summaries.
- Agent outputs from Lupus, Ygrassil, Ninja, and Odyseusz through approved contracts.
- City read models only for overview context.

WRITES:

- Leads/prospects.
- Clients.
- Projects.
- Campaigns.
- Opportunities.
- Proposals.
- Conversations.
- Meetings.
- Decisions.
- Requirements.
- Human approvals for agent/automation actions.

MUST NOT OWN:

- Integration connection secrets.
- Workflow engine internals.
- Automation execution logs.
- City visual read-model cache.
- Agent internal planning state.

PRODUCES EVENTS:

- `office.lead.created`
- `office.lead.updated`
- `office.client.created`
- `office.project.created`
- `office.campaign.created`
- `office.opportunity.created`
- `office.proposal.created`
- `office.conversation.received`
- `office.meeting.recorded`
- `office.decision.recorded`
- `office.approval.granted`
- `office.approval.rejected`

CONSUMES EVENTS:

- `garden.website_brief.created`
- `lupus.lead.discovered`
- `ygrassil.prospect.reply_received`
- `ninja.conversation.insight_created`
- `forest.workflow.completed`
- `forest.workflow.failed`

## BonsAI Forest

OWNS:

- Connections.
- Integrations.
- Workflow definitions.
- Triggers.
- Automation runs.
- Execution logs.
- Failures.
- Automation health.

READS:

- Shared Core auth, organizations, memberships, roles, permissions, agent permissions.
- Product events from Garden, Office, and City.
- Product data only through explicit workflow inputs.
- Agent capability registrations.

WRITES:

- Integration connection metadata.
- Workflow definitions.
- Trigger definitions.
- Automation run records.
- Execution logs.
- Failure records.
- Workflow state transitions.

MUST NOT OWN:

- Leads/prospects.
- Clients.
- Projects.
- Campaigns.
- Opportunities.
- Proposals.
- Business conversations.
- Meetings.
- Website briefs.
- City business metrics source data.
- Agent-specific source-of-truth tables.

PRODUCES EVENTS:

- `forest.workflow.started`
- `forest.workflow.completed`
- `forest.workflow.failed`
- `forest.integration.connected`
- `forest.integration.disconnected`
- `forest.automation_run.logged`

CONSUMES EVENTS:

- `garden.website_brief.created`
- `office.approval.granted`
- `office.lead.updated`
- `office.project.updated`
- `shared.permission.changed`
- `agent.permission.changed`

## BonsAI City

OWNS:

- City-specific preferences.
- City-specific read-model/cache only where necessary.
- Visual company overview state.

READS:

- Derived metrics from Office.
- Derived workflow health from Forest.
- Derived website/project status from Garden and Office.
- Shared Core organization context.

WRITES:

- City UI preferences.
- City read-model refresh/cache records if needed.

MUST NOT OWN:

- Leads/prospects.
- Clients.
- Projects.
- Campaigns.
- Opportunities.
- Proposals.
- Business conversations.
- Meetings.
- Decisions.
- Website briefs.
- Automation execution logs.
- Integration credentials.

PRODUCES EVENTS:

- `city.view_preferences.updated`
- `city.read_model.refreshed`

CONSUMES EVENTS:

- `office.metric.changed`
- `office.project.updated`
- `garden.website_brief.updated`
- `forest.workflow.completed`
- `forest.workflow.failed`

## Agent Boundary Summary

- Lupus writes discovered lead candidates into Office-owned lead/prospect intake after permission checks.
- Ygrassil writes outbound/prospecting results into Office-owned sales/conversation records after permission checks.
- Ninja writes conversation/client intelligence into Office-owned conversation, client, project, meeting, decision, and requirement records after permission checks.
- Odyseusz coordinates across products but must not own their source data.
- Sokrates produces architecture findings and integrity checks; it must not mutate production domain data.

