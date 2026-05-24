
// ─────────────────────────────────────────
// ROLE GUARDS
// ─────────────────────────────────────────


const businessOnly = (req, res, next) => {
  if (req.user.role !== 'business')
    return res.status(403).json({ message: 'Only businesses can perform this action' });
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ message: 'Only students can perform this action' });
  next();
};

module.exports = {businessOnly,studentOnly}