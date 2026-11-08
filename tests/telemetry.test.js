/**
 * Automated Unit Test Suite: Telemetry Controller
 * Sprint 14 Walking Skeleton
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const telemetryController = require('../src/controllers/telemetryController');
const db = require('../src/models/db');

describe('=== Telemetry Ingestion & Stream Buffer Unit Tests ===', () => {

  it('1. POST /api/telemetry/ingest rejects payloads missing vehicleId or coordinates (400)', () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        speedKmh: 95
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

    telemetryController.ingestTelemetry(req, res);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.status, 'ERROR');
  });

  it('2. POST /api/telemetry/ingest accepts valid sensor frames and buffers in data layer (202)', () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        vehicleId: 'veh_8805',
        latitude: 41.8781,
        longitude: -87.6298,
        speedKmh: 92,
        cargoTempC: -12.4,
        batteryPct: 68
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

    telemetryController.ingestTelemetry(req, res);

    assert.strictEqual(statusCode, 202);
    assert.strictEqual(responseData.status, 'ACCEPTED');
    assert.strictEqual(responseData.data.vehicleId, 'veh_8805');
    assert.strictEqual(responseData.data.cargoTempC, -12.4);

    // Verify buffered in db
    assert.ok(db.telemetry.length > 0);
    assert.strictEqual(db.telemetry[0].vehicleId, 'veh_8805');
  });

  it('3. GET /api/telemetry retrieves latest buffered sensor readings (200)', () => {
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

    telemetryController.getLatestTelemetry(req, res);

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.status, 'SUCCESS');
    assert.ok(Array.isArray(responseData.data));
  });

});
