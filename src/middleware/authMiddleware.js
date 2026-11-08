/**
 * Secure Authentication Perimeter Middleware
 * Phase 2 Mandatory Deliverable - Sprint 14
 * Enforces strict JWT verification & violent rejection of unauthorized requests
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'apextrack_sprint14_walking_skeleton_jwt_secret_key_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Violent Rejection on missing or malformed header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'REJECTED',
      statusCode: 401,
      error: 'SECURITY PERIMETER BREACH: Missing or malformed Authorization header. Unauthenticated access strictly prohibited.',
      code: 'AUTH_TOKEN_MISSING',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1];

  // 2. Violent Rejection on invalid or expired token signature
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({
      status: 'REJECTED',
      statusCode: 403,
      error: 'SECURITY PERIMETER BREACH: Invalid token signature or expired credentials. Access violently denied.',
      code: 'AUTH_TOKEN_INVALID',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};
