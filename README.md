# ApexTrack Enterprise — The Walking Skeleton (Sprint 14 MVP)
## Prodesk IT Associate Software Engineering — Sprint 14: Capstone Phase
**Author:** Himesh Singh (PDIT-FTE-11462)  
**Deliverable Status:** Complete (Phase 1, Phase 2, and Phase 3 Fully Executed)  
**Live Edge Deployment:** [https://timelineofficial.github.io/sprint-14/](https://timelineofficial.github.io/sprint-14/)  
**GitHub Repository:** [https://github.com/TimeLineOfficial/sprint-14](https://github.com/TimeLineOfficial/sprint-14)  
**Submission Code:** FTEWSVE | PDIT-FTE-11462 | Sprint 14 Submission  

---

## 🎯 Executive Summary

Sprint 14 fulfills the **Walking Skeleton (Minimum Viable Product)** phase of the Capstone project. The Walking Skeleton establishes the end-to-end architectural plumbing connecting frontend routes, backend controllers, data models, and an automated continuous integration/continuous deployment (CI/CD) pipeline.

---

## 🏗️ Phased Deliverables Breakdown

### Phase 1: Core Infrastructure Implementation (P0 - Mandatory)
* **Goal:** Connect frontend routes to backend controllers. Unstyled/brutalist UI where data flows end-to-end from client to database.
* **Implementation:**
  - **Controllers:** [`src/controllers/shipmentsController.js`](./src/controllers/shipmentsController.js) and [`src/controllers/telemetryController.js`](./src/controllers/telemetryController.js).
  - **Database Model:** [`src/models/db.js`](./src/models/db.js) simulating the 3NF relational layer.
  - **Data Flow:** Submitting the client form emits `POST /api/shipments`, validates inputs, commits the record to `db.shipments`, records an audit trail, and returns `HTTP 201 Created` with live UI record refresh.

### Phase 2: Secure Authentication Perimeter (P0 - Mandatory)
* **Goal:** Implement JWT authentication. Unauthenticated users must be violently rejected by route guards and backend middleware.
* **Implementation:**
  - **Backend Middleware:** [`src/middleware/authMiddleware.js`](./src/middleware/authMiddleware.js) intercepts incoming requests:
    - Missing/malformed token &rarr; `401 Unauthorized` (`AUTH_TOKEN_MISSING`).
    - Forged/tampered token &rarr; `403 Forbidden` (`AUTH_TOKEN_INVALID`).
  - **Client Route Guards:** Client router in [`public/app.js`](./public/app.js) blocks navigation to protected routes (`/shipments`, `/telemetry`) and displays a critical breach alert banner.
  - **Auth Controller:** [`src/controllers/authController.js`](./src/controllers/authController.js) handles login, signs RS256/HMAC JWTs with 15-minute expirations, and logs audit trails.

### Phase 3: Automated CI/CD Pipelines (GitHub Actions) (P0 - Mandatory)
* **Goal:** Comprehensive `.github/workflows/ci-cd.yml` YAML script. Every push to `main` must trigger a remote server that lints, tests, and deploys ONLY if tests pass.
* **Implementation:**
  - **Workflow Script:** [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml).
  - **Stage 1 (Lint):** Static code analysis via `npm run lint`.
  - **Stage 2 (Test Gate):** 11 automated unit tests across Auth, Route Guards, Shipments, and Telemetry via `npm test`.
  - **Stage 3 (Deploy):** Triggered strictly with `needs: [lint-and-code-quality, test-suite-execution]`. If any test fails, deployment is aborted immediately.

---

## 🧪 Automated Test Suite Results

```text
▶ === Phase 2: Secure Authentication Perimeter Unit Tests ===
  ✔ 1. POST /api/auth/login succeeds with valid credentials and issues signed JWT (3.9ms)
  ✔ 2. POST /api/auth/login violently rejects invalid credentials with 401 (0.1ms)
  ✔ 3. authMiddleware violently rejects requests with missing Authorization header (401) (0.2ms)
  ✔ 4. authMiddleware violently rejects requests with forged/tampered JWT (403) (0.3ms)
  ✔ 5. authMiddleware grants clearance and populates req.user when valid token is supplied (0.5ms)
✔ === Phase 2: Secure Authentication Perimeter Unit Tests === (6.3ms)

▶ === Phase 1: Core Infrastructure & Data Flow Unit Tests ===
  ✔ 1. GET /api/shipments retrieves list of shipments from database model (0.8ms)
  ✔ 2. POST /api/shipments rejects payload with missing mandatory fields (400) (0.2ms)
  ✔ 3. POST /api/shipments successfully commits record to database layer (201) (0.9ms)
✔ === Phase 1: Core Infrastructure & Data Flow Unit Tests === (3.3ms)

▶ === Telemetry Ingestion & Stream Buffer Unit Tests ===
  ✔ 1. POST /api/telemetry/ingest rejects payloads missing vehicleId or coordinates (400) (1.2ms)
  ✔ 2. POST /api/telemetry/ingest accepts valid sensor frames and buffers in data layer (202) (0.3ms)
  ✔ 3. GET /api/telemetry retrieves latest buffered sensor readings (200) (1.0ms)
✔ === Telemetry Ingestion & Stream Buffer Unit Tests === (4.2ms)

Total Tests: 11 | Passed: 11 | Failed: 0 | Execution Time: <200ms
```

---

## 🚀 Local Run Instructions

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/TimeLineOfficial/sprint-14.git
   cd sprint-14
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Run linter:
   ```bash
   npm run lint
   ```

4. Launch server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:3000` to interact with the Walking Skeleton.
