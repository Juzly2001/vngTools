const { COOKIE, clearCookie } = require('./_lib');
module.exports = async (req, res) => { clearCookie(res, COOKIE); res.status(200).json({ ok:true }); };
