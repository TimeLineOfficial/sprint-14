/**
 * Auth Controller
 * Sprint 14 Walking Skeleton
 */

const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'ERROR',
      statusCode: 400,
      error: 'Missing username or password in payload'
    });
  }

  // Find user in database
  const user = db.users.find(u => u.username === username);

  // In Walking Skeleton, accept matching user with valid password check
  if (!user || password !== 'admin123') {
    return res.status(401).json({
      status: 'REJECTED',
      statusCode: 401,
      error: 'SECURITY PERIMETER BREACH: Invalid credentials provided. Access denied.',
      code: 'AUTH_INVALID_CREDENTIALS'
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

  // Audit Log Entry
  db.auditLogs.push({
    action: 'USER_LOGIN_SUCCESS',
    userId: user.id,
    timestamp: new Date().toISOString()
  });

  return res.status(200).json({
    status: 'AUTHENTICATED',
    statusCode: 200,
    message: 'Authentication successful. Perimeter clearance granted.',
    token,
    user: payload
  });
}

function verify(req, res) {
  return res.status(200).json({
    status: 'ACTIVE',
    statusCode: 200,
    message: 'Token signature valid. User verified.',
    user: req.user
  });
}

function logout(req, res) {
  return res.status(200).json({
    status: 'LOGGED_OUT',
    statusCode: 200,
    message: 'Session cleared. Token discarded.'
  });
}

module.exports = {
  login,
  verify,
  logout
};
