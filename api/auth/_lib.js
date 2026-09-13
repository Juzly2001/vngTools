const crypto = require('crypto');

const COOKIE = 'workspace_google_session';
const STATE_COOKIE = 'workspace_google_oauth_state';
const MAX_AGE = 60 * 60 * 24 * 180;
const SCOPES = [
  'openid', 'email', 'profile',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata'
].join(' ');

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}
function key() { return crypto.createHash('sha256').update(env('SESSION_SECRET')).digest(); }
function seal(obj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64url');
}
function unseal(value) {
  if (!value) return null;
  try {
    const b = Buffer.from(value, 'base64url');
    const iv = b.subarray(0, 12), tag = b.subarray(12, 28), enc = b.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
    decipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8'));
  } catch (_) { return null; }
}
function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf('='); return [decodeURIComponent(x.slice(0,i)), decodeURIComponent(x.slice(i+1))];
  }));
}
function setCookie(res, name, value, maxAge = MAX_AGE) {
  res.setHeader('Set-Cookie', `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
}
function clearCookie(res, name) { setCookie(res, name, '', 0); }
function baseUrl(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}
function safeReturnTo(v) { return typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') ? v : '/'; }
async function refreshAccessToken(session) {
  const body = new URLSearchParams({
    client_id: env('GOOGLE_CLIENT_ID'), client_secret: env('GOOGLE_CLIENT_SECRET'),
    refresh_token: session.refresh_token, grant_type: 'refresh_token'
  });
  const r = await fetch('https://oauth2.googleapis.com/token', { method:'POST', headers:{'content-type':'application/x-www-form-urlencoded'}, body });
  const data = await r.json();
  if (!r.ok) throw Object.assign(new Error(data.error_description || data.error || 'Token refresh failed'), { status:r.status });
  return data;
}
module.exports = { COOKIE, STATE_COOKIE, SCOPES, env, seal, unseal, cookies, setCookie, clearCookie, baseUrl, safeReturnTo, refreshAccessToken };
