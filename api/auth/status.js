const { COOKIE, cookies, unseal } = require('./_lib');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const s = unseal(cookies(req)[COOKIE]);
  res.status(200).json({ connected: !!s?.refresh_token });
};
