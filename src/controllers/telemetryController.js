/**
 * Telemetry Controller
 * Sprint 14 Walking Skeleton
 * Handles IoT sensor frames and telemetry stream ingestion into data layer
 */

const db = require('../models/db');

function ingestTelemetry(req, res) {
  const { vehicleId, latitude, longitude, speedKmh, cargoTempC, batteryPct } = req.body;

  if (!vehicleId || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      status: 'ERROR',
      statusCode: 400,
      error: 'Missing required telemetry parameters (vehicleId, latitude, longitude).'
    });
  }

  const frame = {
    id: `tel_${Date.now()}`,
    vehicleId,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    speedKmh: parseFloat(speedKmh || 0),
    cargoTempC: parseFloat(cargoTempC || 0),
    batteryPct: parseFloat(batteryPct || 100),
    timestamp: new Date().toISOString()
  };

  db.telemetry.unshift(frame);
  if (db.telemetry.length > 50) {
    db.telemetry.pop();
  }

  return res.status(202).json({
    status: 'ACCEPTED',
    statusCode: 202,
    message: 'Telemetry frame ingested into data layer.',
    data: frame
  });
}

function getLatestTelemetry(req, res) {
  return res.status(200).json({
    status: 'SUCCESS',
    statusCode: 200,
    count: db.telemetry.length,
    data: db.telemetry.slice(0, 10)
  });
}

module.exports = {
  ingestTelemetry,
  getLatestTelemetry
};
