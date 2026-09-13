const crypto = require('crypto');
const { STATE_COOKIE, SCOPES, env, seal, setCookie, baseUrl, safeReturnTo } = require('../_lib');
module.exports = async (req, res) => {
  try {
    const nonce = crypto.randomBytes(24).toString('base64url');
    const state = seal({ nonce, returnTo: safeReturnTo(req.query.returnTo), createdAt: Date.now() });
    setCookie(res, STATE_COOKIE, state, 600);
    const p = new URLSearchParams({
      client_id: env('GOOGLE_CLIENT_ID'), redirect_uri: `${baseUrl(req)}/api/auth/google/callback`,
      response_type: 'code', access_type: 'offline', include_granted_scopes: 'true', scope: SCOPES, state
    });
    // Every explicit connection must return a refresh token for the durable
    // backend session. Page reloads do not come through this route, so this
    // consent screen is shown only when the user intentionally connects again.
    p.set('prompt', req.query.selectAccount === '1' ? 'select_account consent' : 'consent');
    res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
