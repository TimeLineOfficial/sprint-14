/**
 * API Routes Definition
 * Sprint 14 Walking Skeleton
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const shipmentsController = require('../controllers/shipmentsController');
const telemetryController = require('../controllers/telemetryController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public Auth Endpoints
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Protected Auth Verification
router.get('/auth/verify', authMiddleware, authController.verify);

// Protected Core Infrastructure Routes (Phase 1 & Phase 2)
router.get('/shipments', authMiddleware, shipmentsController.getShipments);
router.post('/shipments', authMiddleware, shipmentsController.createShipment);

// Protected Telemetry Routes
router.get('/telemetry', authMiddleware, telemetryController.getLatestTelemetry);
router.post('/telemetry/ingest', authMiddleware, telemetryController.ingestTelemetry);

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'ApexTrack Walking Skeleton',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
