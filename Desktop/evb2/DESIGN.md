# Controlled Document Approval System — Architectural Design Note

This document summarizes the architectural design, security invariants, transaction management, and concurrency patterns of the **Controlled Document Approval System**, built according to the official **ElevateBox Engineering Challenge** specification.

---

### 1. What are the most important invariants in your system?

* **Strict State Transition Pathway**: Documents must strictly follow the defined workflow lifecycle:
  * `DRAFT` ➔ `SUBMITTED`
  * `SUBMITTED` ➔ `APPROVED` or `REJECTED`
  * `REJECTED` ➔ `DRAFT` (requires manual reopening by document author)
  * `APPROVED` ➔ `PUBLISHED`
  * `ANY` ➔ `ARCHIVED` (terminal state)
* **Access Boundary Control**: Viewers can ONLY access documents in the `PUBLISHED` state. No path, query, or direct API endpoint will serve unpublished documents, internal comments, or audit logs to a Viewer.
* **Separation of Duties (SoD)**: An author can never review (approve or reject) their own document, even if they hold the Reviewer or Admin role.
* **Mandatory Rejection Comment**: A document cannot transition to the `REJECTED` state without a non-empty comment specifying the reason for rejection.
* **Atomic Append-Only Auditing**: Every document creation, update, or workflow state transition must atomically generate an audit log entry. Document states cannot change without producing an audit log, and audit logs cannot be generated without a corresponding document action.
* **Optimistic Concurrency Control (OCC)**: Stale client updates must never silently overwrite newer server updates.

---

### 2. Which invariants are enforced by the database, and which by application code?

* **Database (Prisma / SQLite) Level**:
  * **Relational Integrity**: Foreign key constraints linking documents and audit logs to `User` records (`authorId`, `lastUpdatedById`, `actorId`).
  * **Atomic Transactions**: Wrapped in `prisma.$transaction([...])` so document state mutations and audit log insertions commit or roll back as a single ACID unit.
  * **Unique Constraints**: Unique email enforcement on the `User` model.
  * **Version Integrity**: Incremental version updates (`vN` ➔ `vN+1`) executed within transactional updates.
* **Application (Express Backend & Service) Level**:
  * **State Machine Validation**: Validated via `WORKFLOW_TRANSITION_MAP` before attempting a database mutation.
  * **Role-Based Authorization**: Evaluated by the `authorize(...)` middleware.
  * **Self-Approval Guard**: Checks `doc.authorId !== currentUser.id` for approve/reject actions.
  * **Optimistic Concurrency Control**: Backend service method `validateOCC(doc, expectedVersion)` checks client version against database version, throwing `VersionConflictError` (`HTTP 409 Conflict`) on mismatch.
  * **Input Validation**: Zod schemas (`documentValidator.ts`, `workflowValidator.ts`) enforce string length, non-empty body, and required comment rules.
* **UI (React Frontend) Level**:
  * Action panel hides buttons for actions not permitted for the user's role or current document status.
  * Tab filtering limits views based on user role.

---

### 3. How do permissions work?

Permissions follow a strict Role-Based Access Control (RBAC) model implemented across both backend middleware and frontend route/view guards:

* **Read Permissions**:
  * `VIEWER`: Restricted to `PUBLISHED` documents.
  * `AUTHOR`: Can access `PUBLISHED` documents plus own `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, and `ARCHIVED` documents.
  * `REVIEWER`: Can access all active workspace documents, the `Review Queue` (`SUBMITTED`), `Published Specifications`, and the system `Audit Trail`.
  * `ADMIN`: Full visibility across all workspace documents, `Published Specifications`, system `Audit Trail`, and `Archived Files`.
* **Write & Workflow Permissions**:
  * Enforced at the Express router via `authorize(['ROLE'])` middleware and verified inside `workflowService.transitionDocument()`:
    * `DRAFT` / `EDIT` / `SUBMIT`: `AUTHOR` (owner only).
    * `APPROVE` / `REJECT`: `REVIEWER` (prohibits self-approval).
    * `PUBLISH`: `REVIEWER` and `ADMIN`.
    * `ARCHIVE`: `ADMIN` only.

---

### 4. How do you prevent stale or conflicting updates?

We implement **Optimistic Concurrency Control (OCC)** using document versioning:

1. Every document contains an integer `version` field (starts at `1`).
2. When the client loads a document, it receives the current `version`.
3. When sending a mutation request (`PATCH /api/documents/:id`, or workflow transitions like `/submit`, `/approve`, `/reject`, `/publish`, `/archive`), the client includes `expectedVersion` in the request body.
4. The backend service retrieves the live document from SQLite and invokes `validateOCC(doc, expectedVersion)`.
5. **Success Case**: If `doc.version === expectedVersion`, the operation proceeds, and `version` is incremented to `expectedVersion + 1`.
6. **Conflict Case**: If `doc.version !== expectedVersion` (e.g., another user published or updated the document concurrently), the server throws a `VersionConflictError`, returning `HTTP 409 Conflict` containing `clientVersion` and `serverVersion`.
7. The React frontend catches `HTTP 409 Conflict` and alerts the user via error toasts or redirects to a Version Conflict view.

---

### 5. How do you keep audit events consistent with document state changes?

To guarantee zero drift between document states and audit records:

1. Every state mutation in `workflowService.ts` and `documentService.ts` is executed inside a **Prisma Interactive Transaction** (`prisma.$transaction`).
2. Inside the transaction block:
   - The document record is updated with the new status, incremented version, and updated timestamp.
   - An `AuditLog` entry is created recording `documentId`, `actorId`, `actorName`, `action`, `previousStatus`, `newStatus`, `version`, `comment`, and `timestamp`.
3. If any step fails or an exception is thrown, the entire transaction rolls back automatically.
4. This ensures that document updates and audit log entries commit atomically.

---

### 6. What failure cases did you consider?

* **Authentication Failures**: Missing, invalid, or expired JWT tokens return `HTTP 401 Unauthorized`.
* **Authorization Violations**: Users attempting actions outside their role boundaries or authors attempting self-approval return `HTTP 403 Forbidden`.
* **Invalid Workflow State Transitions**: Submitting an approved document or publishing a draft returns `HTTP 400 Bad Request` via `InvalidTransitionError`.
* **Concurrent Race Conditions**: Concurrent edits or status changes are intercepted by OCC, returning `HTTP 409 Conflict`.
* **Schema & Validation Errors**: Missing rejection comments or empty titles return `HTTP 400 Bad Request` with structured error details.
* **Resource Non-Existence**: Requesting non-existent document IDs returns `HTTP 404 Not Found`.

---

### 7. What would you improve with more time?

* **Visual Diff Viewer**: Add a git-style line-by-line diff viewer inside the Version Conflict screen comparing stale client state against server state.
* **Real-time WebSockets**: Integrate Socket.io to push real-time document status changes and active editor presence to open browser tabs.
* **Automated End-to-End Test Suite**: Expand test coverage with Playwright/Cypress end-to-end tests verifying multi-role workflows.

---

### 8. What would need to change for a real production system?

* **Database Engine**: Transition from SQLite to a managed PostgreSQL cluster with read-replicas for high availability and concurrent write performance.
* **Distributed Caching & Session Storage**: Use Redis for JWT token revocation lists and query caching.
* **Security & Infrastructure**:
  * Run behind an Nginx reverse proxy terminating TLS/HTTPS.
  * Enable rate limiting (`express-rate-limit`) and security headers (`helmet`).
* **Containerization & CI/CD**: Package application components into Docker containers managed via Kubernetes or AWS ECS with automated GitHub Actions CI/CD pipelines.
* **Monitoring & Observability**: Integrate OpenTelemetry tracing, Prometheus metrics, and Sentry for error tracking.

---

### 9. Frontend UI Design System & Visual Palette

The user interface follows a modern monochrome design system paired with standard semantic colors for document lifecycle state indicators:

* **Monochrome Interactive Elements**: Every active, selected, focused, or clicked UI element uses a clean monochrome black theme (`#111111` / `zinc-900` background with `white` text):
  * Active navigation items & sidebar links
  * Selected tabs & segmented controls
  * Active filter pills & workspace section indicators
  * Table/Card view mode toggles
  * Active dropdown menu options & pagination items
  * Focus rings (`focus:ring-zinc-900/20`) & primary action buttons
* **Semantic Workflow Color Language**: Workflow states and audit trail actions strictly use soft pastel backgrounds with darker text and borders for high readability and instant visual recognition:
  * **`CREATE`**: Soft Slate (`bg-slate-100 border-slate-300 text-slate-700`)
  * **`DRAFT`**: Soft Gray (`bg-gray-100 border-gray-300 text-gray-700`)
  * **`EDIT` / `UPDATE`**: Soft Slate (`bg-slate-100 border-slate-300 text-slate-700`)
  * **`SUBMIT` / `SUBMITTED`**: Soft Amber (`bg-amber-50 border-amber-200 text-amber-800`)
  * **`REVIEW`**: Soft Violet (`bg-violet-50 border-violet-200 text-violet-700`)
  * **`APPROVE` / `APPROVED`**: Soft Green (`bg-green-50 border-green-200 text-green-700`)
  * **`PUBLISH` / `PUBLISHED`**: Soft Emerald (`bg-emerald-50 border-emerald-200 text-emerald-800`)
  * **`REJECT` / `REJECTED`**: Soft Red (`bg-red-50 border-red-200 text-red-700`)
  * **`ARCHIVE` / `ARCHIVED`**: Soft Zinc (`bg-zinc-100 border-zinc-300 text-zinc-700`)
  * **`RESTORE` / `REOPEN`**: Soft Cyan (`bg-cyan-50 border-cyan-200 text-cyan-700`)

