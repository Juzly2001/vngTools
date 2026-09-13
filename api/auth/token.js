const { COOKIE, cookies, unseal, refreshAccessToken, clearCookie } = require('./_lib');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const session = unseal(cookies(req)[COOKIE]);
  if (!session?.refresh_token) return res.status(401).json({ connected:false });
  try {
    const t = await refreshAccessToken(session);
    res.status(200).json({ connected:true, access_token:t.access_token, expires_in:t.expires_in, token_type:t.token_type || 'Bearer', scope:t.scope || session.scope });
  } catch (e) {
    if (/invalid_grant/i.test(e.message)) clearCookie(res, COOKIE);
    res.status(401).json({ connected:false, error:'reauth_required' });
  }
};
