# Ygrassil Manual End-to-End Test

Run this only after Supabase, AI, SMTP, IMAP, and `ADMIN_TEST_EMAIL` are configured.

Safety preconditions:

- `EMAIL_TEST_MODE=true`
- `OUTBOUND_ENABLED=false`
- `ADMIN_TEST_EMAIL` is your admin Gmail/test inbox
- No prospect address receives mail during this test

Flow:

1. Create one manual test lead with a safe prospect email you control.
2. Run Analyse and confirm a website audit/research record is created.
3. Run Score and confirm the lead score is saved.
4. Create Proposal and confirm a proposal row is linked to the lead.
5. Generate Email Draft and confirm the draft is awaiting approval.
6. Approve the draft as an authenticated admin user.
7. Click Send Test and confirm the server sends only to `ADMIN_TEST_EMAIL`.
8. Confirm the message arrives in the admin Gmail/test inbox.
9. Reply to the test message from the admin inbox.
10. Run IMAP Sync and confirm the reply is imported into `email_messages`.
11. Run Reply Classification and confirm `reply_classifications` is created.
12. Confirm the CRM lead status updates from the classified reply.

Pass criteria:

- No outbound prospect email is sent while `OUTBOUND_ENABLED=false`.
- Test-mode delivery is redirected to `ADMIN_TEST_EMAIL`.
- Each workflow step writes an auditable row in `activity_log`.
- Suppressed leads or contacts cannot be sent any message.
