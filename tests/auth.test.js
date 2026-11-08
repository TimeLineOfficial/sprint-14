/**
 * Automated Unit Test Suite: Auth Perimeter & JWT Route Guard
 * Sprint 14 Phase 2 & Phase 3 Verification
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const { authMiddleware, JWT_SECRET } = require('../src/middleware/authMiddleware');
const authController = require('../src/controllers/authController');

describe('=== Phase 2: Secure Authentication Perimeter Unit Tests ===', () => {

  it('1. POST /api/auth/login succeeds with valid credentials and issues signed JWT', () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        username: 'dispatcher_elena',
        password: 'admin123'
      }
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      }
    };

    authController.login(req, res);

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.status, 'AUTHENTICATED');
    assert.ok(responseData.token, 'Token must be present in response');
    
    // Verify token can be decoded with JWT_SECRET
    const decoded = jwt.verify(responseData.token, JWT_SECRET);
    assert.strictEqual(decoded.username, 'dispatcher_elena');
    assert.strictEqual(decoded.role, 'FLEET_DISPATCHER');
  });

  it('2. POST /api/auth/login violently rejects invalid credentials with 401', () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        username: 'dispatcher_elena',
        password: 'wrong_password_attack'
      }
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      }
    };

    authController.login(req, res);

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseData.status, 'REJECTED');
    assert.strictEqual(responseData.code, 'AUTH_INVALID_CREDENTIALS');
  });

  it('3. authMiddleware violently rejects requests with missing Authorization header (401)', () => {
    let responseData = null;
    let statusCode = null;
    let nextCalled = false;

    const req = {
      headers: {}
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      }
    };

    const next = () => { nextCalled = true; };

    authMiddleware(req, res, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseData.code, 'AUTH_TOKEN_MISSING');
  });

  it('4. authMiddleware violently rejects requests with forged/tampered JWT (403)', () => {
    let responseData = null;
    let statusCode = null;
    let nextCalled = false;

    const req = {
      headers: {
        authorization: 'Bearer forged.tampered.signature'
      }
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      }
    };

    const next = () => { nextCalled = true; };

    authMiddleware(req, res, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(responseData.code, 'AUTH_TOKEN_INVALID');
  });

  it('5. authMiddleware grants clearance and populates req.user when valid token is supplied', () => {
    const validToken = jwt.sign({ id: 'usr_001', username: 'dispatcher_elena' }, JWT_SECRET, { expiresIn: '15m' });
    let nextCalled = false;

    const req = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };

    const res = {};
    const next = () => { nextCalled = true; };

    authMiddleware(req, res, next);

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.username, 'dispatcher_elena');
  });

});
