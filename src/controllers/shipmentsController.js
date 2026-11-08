/**
 * Shipments Controller
 * Phase 1 Core Infrastructure Implementation - Sprint 14
 * Handles data flow from client requests into the database model
 */

const db = require('../models/db');

function getShipments(req, res) {
  return res.status(200).json({
    status: 'SUCCESS',
    statusCode: 200,
    count: db.shipments.length,
    data: db.shipments
  });
}

function createShipment(req, res) {
  const { trackingNumber, origin, destination, cargoClassification, weightKg, assignedVehicleId } = req.body;

  if (!trackingNumber || !origin || !destination) {
    return res.status(400).json({
      status: 'ERROR',
      statusCode: 400,
      error: 'Missing required shipment parameters (trackingNumber, origin, destination).'
    });
  }

  // Prevent duplicate tracking numbers
  const existing = db.shipments.find(s => s.trackingNumber === trackingNumber);
  if (existing) {
    return res.status(409).json({
      status: 'CONFLICT',
      statusCode: 409,
      error: `Shipment with tracking number ${trackingNumber} already exists in database.`
    });
  }

  const newRecord = {
    id: `shp_${Date.now()}`,
    trackingNumber: String(trackingNumber).trim(),
    origin: String(origin).trim(),
    destination: String(destination).trim(),
    cargoClassification: cargoClassification || 'DRY_GOODS',
    weightKg: parseFloat(weightKg || 1000),
    assignedVehicleId: assignedVehicleId || 'veh_8802',
    status: 'DISPATCHED',
    createdBy: req.user ? req.user.username : 'system_agent',
    createdAt: new Date().toISOString()
  };

  // Commit to database
  db.shipments.unshift(newRecord);

  // Record Audit Trail
  db.auditLogs.push({
    action: 'SHIPMENT_CREATED',
    trackingNumber: newRecord.trackingNumber,
    timestamp: newRecord.createdAt
  });

  return res.status(201).json({
    status: 'CREATED',
    statusCode: 201,
    message: 'Shipment record successfully committed to database.',
    data: newRecord
  });
}

module.exports = {
  getShipments,
  createShipment
};
