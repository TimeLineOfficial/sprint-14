/**
 * Automated Unit Test Suite: Core Infrastructure & Data Flow
 * Sprint 14 Phase 1 Verification
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const shipmentsController = require('../src/controllers/shipmentsController');
const db = require('../src/models/db');

describe('=== Phase 1: Core Infrastructure & Data Flow Unit Tests ===', () => {

  it('1. GET /api/shipments retrieves list of shipments from database model', () => {
    let responseData = null;
    let statusCode = null;

    const req = {};
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

    shipmentsController.getShipments(req, res);

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.status, 'SUCCESS');
    assert.ok(Array.isArray(responseData.data), 'Data must be an array');
    assert.ok(responseData.data.length >= 2, 'Initial seeded shipments must be present');
  });

  it('2. POST /api/shipments rejects payload with missing mandatory fields (400)', () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        trackingNumber: 'ATX-TEST-INCOMPLETE'
        // Missing origin & destination
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

    shipmentsController.createShipment(req, res);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.status, 'ERROR');
  });

  it('3. POST /api/shipments successfully commits record to database layer (201)', () => {
    let responseData = null;
    let statusCode = null;
    const testTracking = `ATX-TEST-${Date.now()}`;

    const req = {
      body: {
        trackingNumber: testTracking,
        origin: 'Seattle Distribution Terminal, WA',
        destination: 'San Francisco Hub, CA',
        cargoClassification: 'HAZARDOUS_MATERIALS',
        weightKg: 3600,
        assignedVehicleId: 'veh_8812'
      },
      user: {
        username: 'dispatcher_elena'
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

    shipmentsController.createShipment(req, res);

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(responseData.status, 'CREATED');
    assert.strictEqual(responseData.data.trackingNumber, testTracking);

    // Verify record exists in database
    const saved = db.shipments.find(s => s.trackingNumber === testTracking);
    assert.ok(saved, 'Shipment record must be persisted in database model');
    assert.strictEqual(saved.origin, 'Seattle Distribution Terminal, WA');
    assert.strictEqual(saved.createdBy, 'dispatcher_elena');
  });

});
