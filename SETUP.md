# Workspace Dashboard — durable Google login

1. Copy `index.html`, `dashboard/`, `api/`, `package.json`, `vercel.json` into the root of the existing `vngTools` repo. Keep all unrelated folders/files.
2. Import `vngTools` into Vercel. Framework Preset: Other. Root Directory: repository root.
3. Vercel Environment Variables (Production):
   - GOOGLE_CLIENT_ID = your existing Web OAuth client ID
   - GOOGLE_CLIENT_SECRET = the matching client secret
   - SESSION_SECRET = a long random secret (32+ random bytes; do not expose it in JS)
4. Deploy once and note the production URL, e.g. `https://your-project.vercel.app`.
5. Google Cloud > Google Auth Platform > Clients > your Web client:
   - Authorized JavaScript origin: `https://your-project.vercel.app`
   - Authorized redirect URI: `https://your-project.vercel.app/api/auth/google/callback`
6. Google Auth Platform > Audience: for long-lived refresh tokens, publish the app to Production when appropriate. In Testing, Google refresh tokens can expire after 7 days.
7. Open the Vercel URL, Account > Connect Google. The first durable connection may show consent so Google can issue a refresh token.
8. Test: create a small note, wait for autosave, close the tab, reopen. It should restore the Google session and load Drive before enabling autosave.

Recovery console helpers:
- `workspaceRecovery.status()`
- `workspaceRecovery.list()`
- `workspaceRecovery.backup('manual')`
- `workspaceRecovery.restore(0)` (restores local backup only; Drive autosave remains locked until a safe re-hydration)
