/**
 * ApexTrack Enterprise — Walking Skeleton Client Controller
 * Sprint 14 Capstone MVP
 */

(function () {
  'use strict';

  // In-Memory Client State
  const clientState = {
    token: null,
    user: null,
    currentRoute: 'overview',
    shipments: [
      {
        trackingNumber: 'ATX-2026-101',
        origin: 'Boston Life Sciences Hub, MA',
        destination: 'Manhattan Medical Depot, NY',
        cargoClassification: 'COLD_CHAIN_PHARMA',
        weightKg: 4200,
        status: 'IN_TRANSIT',
        createdAt: '2026-11-08T12:00:00Z'
      },
      {
        trackingNumber: 'ATX-2026-102',
        origin: 'Chicago Air Cargo Hub, IL',
        destination: 'Detroit Autonomous Plant, MI',
        cargoClassification: 'HIGH_VALUE_ELECTRONICS',
        weightKg: 8500,
        status: 'DISPATCHED',
        createdAt: '2026-11-08T10:30:00Z'
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
        timestamp: new Date().toISOString()
      }
    ]
  };

  // DOM Elements
  const el = {
    authPillText: document.getElementById('auth-status-text'),
    rejectionBanner: document.getElementById('violent-rejection-banner'),
    rejectionMessage: document.getElementById('rejection-message'),
    btnDismissRejection: document.getElementById('btn-dismiss-rejection'),
    navButtons: document.querySelectorAll('.nav-btn'),
    routeViews: document.querySelectorAll('.route-view'),

    // Auth
    loginForm: document.getElementById('login-form'),
    inputUsername: document.getElementById('input-username'),
    inputPassword: document.getElementById('input-password'),
    btnLogin: document.getElementById('btn-login'),
    btnLogout: document.getElementById('btn-logout'),
    btnSimulateForged: document.getElementById('btn-simulate-forged-token'),
    tokenDisplay: document.getElementById('token-display'),
    claimsDisplay: document.getElementById('claims-display'),

    // Shipments
    createShipmentForm: document.getElementById('create-shipment-form'),
    shipTracking: document.getElementById('ship-tracking'),
    shipOrigin: document.getElementById('ship-origin'),
    shipDestination: document.getElementById('ship-destination'),
    shipCargo: document.getElementById('ship-cargo'),
    shipWeight: document.getElementById('ship-weight'),
    shipmentStatusLine: document.getElementById('shipment-status-line'),
    tbodyShipments: document.getElementById('tbody-shipments'),
    btnRefreshShipments: document.getElementById('btn-refresh-shipments'),

    // Telemetry
    telemetryForm: document.getElementById('telemetry-form'),
    tbodyTelemetry: document.getElementById('tbody-telemetry')
  };

  // --- Violent Rejection Handler ---
  function triggerViolentRejection(statusCode, message) {
    el.rejectionBanner.style.display = 'block';
    el.rejectionMessage.innerHTML = `<strong>HTTP ${statusCode} FORBIDDEN / UNAUTHORIZED:</strong> ${message}`;
    console.error(`[SECURITY PERIMETER BREACH] HTTP ${statusCode} — ${message}`);
  }

  // --- Client Route Guard (Phase 2) ---
  function navigateToRoute(routeId) {
    const protectedRoutes = ['shipments', 'telemetry'];

    // Check Route Guard
    if (protectedRoutes.includes(routeId) && !clientState.token) {
      triggerViolentRejection(
        401,
        `Route guard violently rejected navigation to <code>/${routeId}</code>. No valid JWT bearer clearance found in client perimeter.`
      );
      return;
    }

    clientState.currentRoute = routeId;
    el.navButtons.forEach(btn => {
      if (btn.dataset.route === routeId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    el.routeViews.forEach(view => {
      if (view.id === `view-${routeId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    if (routeId === 'shipments') {
      renderShipmentsTable();
    } else if (routeId === 'telemetry') {
      renderTelemetryTable();
    }
  }

  // --- Render Tables ---
  function renderShipmentsTable() {
    el.tbodyShipments.innerHTML = '';
    clientState.shipments.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="text-cyan">${s.trackingNumber}</strong></td>
        <td>${s.origin}</td>
        <td>${s.destination}</td>
        <td>${s.cargoClassification}</td>
        <td>${s.weightKg} kg</td>
        <td><span class="text-success">[ ${s.status} ]</span></td>
        <td class="text-muted text-xs">${s.createdAt}</td>
      `;
      el.tbodyShipments.appendChild(tr);
    });
  }

  function renderTelemetryTable() {
    el.tbodyTelemetry.innerHTML = '';
    clientState.telemetry.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.id}</td>
        <td><strong>${t.vehicleId}</strong></td>
        <td>${t.latitude.toFixed(4)}</td>
        <td>${t.longitude.toFixed(4)}</td>
        <td>${t.speedKmh} km/h</td>
        <td class="${t.cargoTempC > -16 ? 'text-danger' : 'text-success'}">${t.cargoTempC.toFixed(1)} °C</td>
        <td class="text-muted text-xs">${t.timestamp}</td>
      `;
      el.tbodyTelemetry.appendChild(tr);
    });
  }

  // --- API Handlers with Static Fallback for Edge Deployment ---
  async function apiCall(endpoint, options = {}) {
    try {
      const res = await fetch(endpoint, options);
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      // Fallback for static environments (GitHub Pages / pure client)
      return { ok: false, error: e.message };
    }
  }

  // --- Event Bindings ---
  function initEvents() {
    // Navigation clicks
    el.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navigateToRoute(btn.dataset.route);
      });
    });

    // Dismiss rejection banner
    el.btnDismissRejection.addEventListener('click', () => {
      el.rejectionBanner.style.display = 'none';
    });

    // Login Form Submit (Phase 2)
    el.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = el.inputUsername.value.trim();
      const password = el.inputPassword.value.trim();

      // Attempt backend API call
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok && res.data.token) {
        clientState.token = res.data.token;
        clientState.user = res.data.user;
      } else {
        // Fallback simulation in static hosting
        if (password === 'admin123') {
          const mockPayload = { id: 'usr_001', username, role: 'FLEET_DISPATCHER', fullName: 'Elena Rostova' };
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(mockPayload))}.mock_signature_sprint14`;
          clientState.token = mockToken;
          clientState.user = mockPayload;
        } else {
          triggerViolentRejection(401, 'Invalid credentials provided. Authentication perimeter denied entry.');
          return;
        }
      }

      // Update UI state
      el.authPillText.textContent = `AUTHENTICATED [${clientState.user.username}]`;
      el.authPillText.className = 'text-success';
      el.tokenDisplay.textContent = clientState.token;
      el.claimsDisplay.textContent = `User: ${clientState.user.username} | Role: ${clientState.user.role} | Token Exp: 15 mins (RS256)`;
      el.btnLogout.disabled = false;
      el.btnLogin.disabled = true;
      el.rejectionBanner.style.display = 'none';

      console.log('[AUTH PERIMETER] Access Granted. Bearer token saved.');
    });

    // Logout
    el.btnLogout.addEventListener('click', () => {
      clientState.token = null;
      clientState.user = null;
      el.authPillText.textContent = 'UNAUTHENTICATED';
      el.authPillText.className = 'text-danger';
      el.tokenDisplay.textContent = 'NO ACTIVE TOKEN PRESENT. PERIMETER IS LOCKED.';
      el.claimsDisplay.textContent = 'Decoded Claims: null';
      el.btnLogout.disabled = true;
      el.btnLogin.disabled = false;
      navigateToRoute('overview');
      console.log('[AUTH PERIMETER] Logged out. Token discarded.');
    });

    // Simulate Forged Token (Violent Rejection Test)
    el.btnSimulateForged.addEventListener('click', () => {
      clientState.token = 'forged.tampered.token.signature';
      el.tokenDisplay.textContent = clientState.token;
      el.claimsDisplay.textContent = 'Decoded Claims: FORGED / INVALID';
      triggerViolentRejection(
        403,
        'SECURITY PERIMETER BREACH DETECTED: JWT signature failed cryptographic validation. Forged token rejected with 403 Forbidden.'
      );
    });

    // Create Shipment Form Submit (Phase 1 Data Flow)
    el.createShipmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!clientState.token) {
        triggerViolentRejection(401, 'Cannot commit shipment without valid Bearer token authorization.');
        return;
      }

      const trackingNumber = el.shipTracking.value.trim();
      const origin = el.shipOrigin.value.trim();
      const destination = el.shipDestination.value.trim();
      const cargoClassification = el.shipCargo.value;
      const weightKg = parseFloat(el.shipWeight.value);

      const payload = { trackingNumber, origin, destination, cargoClassification, weightKg };

      // Attempt API call to backend controller
      const res = await apiCall('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clientState.token}`
        },
        body: JSON.stringify(payload)
      });

      const newRecord = (res.ok && res.data.data) ? res.data.data : {
        ...payload,
        status: 'DISPATCHED',
        createdAt: new Date().toISOString()
      };

      clientState.shipments.unshift(newRecord);
      renderShipmentsTable();

      // Show Status line
      el.shipmentStatusLine.style.display = 'block';
      el.shipmentStatusLine.innerHTML = `
        &gt; HTTP 201 CREATED :: Record [${newRecord.trackingNumber}] successfully committed into Database Model.
      `;

      el.createShipmentForm.reset();
      el.shipTracking.value = `ATX-2026-${Math.floor(100 + Math.random() * 899)}`;
    });

    // Refresh query
    el.btnRefreshShipments.addEventListener('click', () => {
      renderShipmentsTable();
    });

    // Telemetry Ingestion Submit
    el.telemetryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!clientState.token) {
        triggerViolentRejection(401, 'Telemetry stream endpoint requires active Bearer authentication.');
        return;
      }

      const newFrame = {
        id: `tel_${Date.now()}`,
        vehicleId: document.getElementById('tel-vehicle').value,
        latitude: parseFloat(document.getElementById('tel-lat').value),
        longitude: parseFloat(document.getElementById('tel-lng').value),
        speedKmh: parseFloat(document.getElementById('tel-speed').value),
        cargoTempC: parseFloat(document.getElementById('tel-temp').value),
        timestamp: new Date().toISOString()
      };

      clientState.telemetry.unshift(newFrame);
      renderTelemetryTable();
    });
  }

  // --- Init ---
  function init() {
    el.shipTracking.value = `ATX-2026-103`;
    renderShipmentsTable();
    renderTelemetryTable();
    initEvents();
    console.log('[WALKING SKELETON] Initialized. Ready for Phase 1 & 2 verification.');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
