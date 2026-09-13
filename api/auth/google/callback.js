const { COOKIE, STATE_COOKIE, env, unseal, cookies, setCookie, clearCookie, baseUrl, safeReturnTo } = require('../_lib');
module.exports = async (req, res) => {
  try {
    const jar = cookies(req); const stateCookie = jar[STATE_COOKIE];
    if (!req.query.state || !stateCookie || req.query.state !== stateCookie) return res.status(400).send('Invalid OAuth state.');
    const state = unseal(stateCookie);
    if (!state || Date.now() - state.createdAt > 10 * 60 * 1000) return res.status(400).send('OAuth state expired.');
    if (req.query.error) return res.status(400).send(`Google authorization failed: ${req.query.error}`);
    const body = new URLSearchParams({
      code: req.query.code, client_id: env('GOOGLE_CLIENT_ID'), client_secret: env('GOOGLE_CLIENT_SECRET'),
      redirect_uri: `${baseUrl(req)}/api/auth/google/callback`, grant_type: 'authorization_code'
    });
    const r = await fetch('https://oauth2.googleapis.com/token', { method:'POST', headers:{'content-type':'application/x-www-form-urlencoded'}, body });
    const token = await r.json();
    if (!r.ok) return res.status(400).send(`Token exchange failed: ${token.error_description || token.error}`);
    if (!token.refresh_token) return res.status(400).send('Google did not return a refresh token. Reconnect with consent, or revoke the app once in your Google Account and try again.');
    setCookie(res, COOKIE, require('../_lib').seal({ refresh_token: token.refresh_token, scope: token.scope || '', createdAt: Date.now() }));
    // Append clearing cookie without overwriting session cookie.
    const current = res.getHeader('Set-Cookie');
    res.setHeader('Set-Cookie', [current, `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`]);
    res.redirect(302, safeReturnTo(state.returnTo));
  } catch (e) { res.status(500).send(`OAuth callback error: ${e.message}`); }
};
