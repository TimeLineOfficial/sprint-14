# AI Prompts & Engineering Architecture Log
## Sprint 14: Capstone Phase — The Walking Skeleton (MVP)
**Engineer:** Himesh Singh (PDIT-FTE-11462)  
**Track:** Associate Software Engineering — Prodesk IT  
**Submission Protocol:** FTEWSVE | PDIT-FTE-11462 | Sprint 14 Submission  

---

### Prompt 1: Phase 1 — Core Infrastructure Implementation
* **Objective:** Establish the Walking Skeleton plumbing. Connect frontend routes to backend controllers. UI is brutalist/unstyled, but data must flow end-to-end from the client into the database.
* **Key Decisions:**
  - Designed clean Express controllers (`shipmentsController.js`, `telemetryController.js`) receiving REST payloads and committing records to an in-memory 3NF database model.
  - Built declarative forms in the client emitting JSON payloads to `POST /api/shipments` and updating live record tables upon HTTP 201 Created confirmation.

### Prompt 2: Phase 2 — Secure Authentication Perimeter
* **Objective:** Implement JWT authentication. Unauthenticated users must be violently rejected by route guards and backend middleware.
* **Key Decisions:**
  - Implemented `authMiddleware.js` verifying RS256/HMAC JWT signatures with 15-minute expirations.
  - Implemented violent 401 Unauthorized rejection on missing/malformed Bearer tokens and 403 Forbidden rejection on forged/tampered tokens.
  - Engineered client-side route guards in `app.js` blocking navigation to protected routes (`/shipments`, `/telemetry`) and displaying an alert banner on unauthorized access attempts.

### Prompt 3: Phase 3 — Automated CI/CD Pipelines (GitHub Actions)
* **Objective:** Write a comprehensive `.github/workflows/ci-cd.yml` script. Every push to `main` must trigger a remote server that lints code, executes the test suite, and deploys ONLY if tests pass.
* **Key Decisions:**
  - Structured multi-job pipeline: `lint-and-code-quality` &rarr; `test-suite-execution` &rarr; `build-and-deploy`.
  - Enforced a strict test gate (`needs: [lint-and-code-quality, test-suite-execution]`) ensuring deployment aborts immediately if any of the 11 unit tests fail.
  - Configured caching and lightweight native testing with `node --test` for sub-200ms execution.
