/**
 * In-Memory Database Model (3NF Relational Layer Simulation)
 * Sprint 14 Walking Skeleton Persistence
 */

const db = {
  users: [
    {
      id: 'usr_001',
      username: 'dispatcher_elena',
      email: 'elena@apextrack.internal',
      passwordHash: 'sha256_elena_pass_2026',
      role: 'FLEET_DISPATCHER',
      fullName: 'Elena Rostova',
      isActive: true
    },
    {
      id: 'usr_002',
      username: 'auditor_marcus',
      email: 'marcus@apextrack.internal',
      passwordHash: 'sha256_marcus_pass_2026',
      role: 'COMPLIANCE_AUDITOR',
      fullName: 'Marcus Vance',
      isActive: true
    }
  ],

  shipments: [
    {
      id: 'shp_101',
      trackingNumber: 'ATX-2026-101',
      origin: 'Boston Life Sciences Hub, MA',
      destination: 'Manhattan Medical Depot, NY',
      cargoClassification: 'COLD_CHAIN_PHARMA',
      weightKg: 4200,
      assignedVehicleId: 'veh_8802',
      status: 'IN_TRANSIT',
      createdAt: new Date().toISOString()
    },
    {
      id: 'shp_102',
      trackingNumber: 'ATX-2026-102',
      origin: 'Chicago Air Cargo Hub, IL',
      destination: 'Detroit Autonomous Plant, MI',
      cargoClassification: 'HIGH_VALUE_ELECTRONICS',
      weightKg: 8500,
      assignedVehicleId: 'veh_8805',
      status: 'DISPATCHED',
      createdAt: new Date().toISOString()
    }
  ],

  telemetry: [
    {
      id: 'tel_001',
      vehicleId: 'veh_8802',
      latitude: 42.3601,
      longitude: -71.0589,
      speedKmh: 88,
      cargoTempC: -18.4,
      batteryPct: 82,
      timestamp: new Date().toISOString()
    }
  ],

  auditLogs: []
};

module.exports = db;
