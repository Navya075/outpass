# Controlled Document Approval System

A full-stack role-based document workflow engine built for the ElevateBox Engineering Challenge.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> Engineered for the **ElevateBox Engineering Challenge** to satisfy strict regulatory workflow standards, role-based access controls, and data integrity guarantees.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Highlights](#-project-highlights)
- [System Modules](#-system-modules)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Setup](#-step-by-step-setup)
- [Application URLs](#-application-urls)
- [Seeded Accounts & Test Credentials](#-seeded-accounts--test-credentials)
- [High-Level System Workflow](#-high-level-system-workflow)
- [Workflow State Machine](#-workflow-state-machine)
- [Role Permissions Matrix](#-role-permissions-matrix)
- [API Endpoint Highlights](#-api-endpoint-highlights)
- [Evaluation Highlights](#-evaluation-highlights)
- [Evaluation Checklist](#-evaluation-checklist)
- [Available Scripts](#-available-scripts)
- [Design Notes](#-design-notes)

---

## 🔍 Overview

The Controlled Document Approval System is a full-stack controlled document management application designed for regulated engineering environments. It governs technical specifications through explicit lifecycle states (`DRAFT`, `SUBMITTED`, `APPROVED`, `PUBLISHED`, `REJECTED`, `ARCHIVED`), ensuring that only verified documents reach consumers while maintaining a complete, immutable audit history.

---

## ⭐ Project Highlights

| Feature | Status |
| :--- | :---: |
| **Role-Based Access Control (RBAC)** | ✅ |
| **JWT Authentication** | ✅ |
| **Controlled Document Workflow** | ✅ |
| **Separation of Duties (SoD)** | ✅ |
| **Optimistic Concurrency Control (OCC)** | ✅ |
| **Immutable Audit Trail** | ✅ |
| **Prisma ORM + SQLite Database** | ✅ |
| **Responsive Monochrome User Interface** | ✅ |
| **TypeScript Frontend & Backend** | ✅ |

---

## 🧩 System Modules

| Module | Description |
| :--- | :--- |
| **Authentication** | JWT login, session persistence, role-based route guards |
| **Document Repository** | Create, edit, search, filter, and browse technical specifications |
| **Review Queue** | Dedicated reviewer interface for approving or rejecting submitted specifications |
| **Published Specifications** | Read-only catalogue for verified policies and active specifications |
| **Audit Trail** | Immutable chronological record of all document actions and state transitions |
| **Archive** | Terminal read-only storage for soft-deleted documents (Admin only) |
| **Prisma Studio** | Embedded graphical browser for SQLite database inspection |

---

## ✨ Key Features

### 🔒 Security & Access Control
* **Role-Based Access Control (RBAC)**: Four distinct roles (`AUTHOR`, `REVIEWER`, `ADMIN`, `VIEWER`) enforced at both server route handlers and client UI views.
* **Separation of Duties (SoD)**: Strict self-approval guard preventing authors from approving or rejecting their own submissions.
* **JWT Authentication**: Secure Bearer token authentication flow.

### 🔄 ISO Workflow Engine
* **Declarative State Machine**: Deterministic state transitions managed via a centralized transition map (`WORKFLOW_TRANSITION_MAP`).
* **Mandatory Rejection Auditing**: Transitioning to `REJECTED` strictly requires an explanatory comment.
* **Terminal Soft Archive**: Soft-deleted documents enter a permanent read-only archive state.

### 🛡️ Reliability & Data Integrity
* **Optimistic Concurrency Control (OCC)**: Version matching (`expectedVersion`) prevents stale client overwrites (`HTTP 409 Conflict`).
* **Atomic Audit Logging**: Document state mutations and audit trail log creations execute together inside database transactions (`prisma.$transaction`).

### 🎨 Enterprise UI Design System
* **Monochrome Interactive Elements**: All active, selected, focused, or toggled UI controls (sidebar links, active tabs, filters, view mode buttons, dropdown options, focus rings) use a clean monochrome black theme (`#111111` / `zinc-900`).
* **Semantic Workflow Color Language**: Standardized soft pastel badges convey document lifecycle states and audit log actions (`DRAFT` gray, `SUBMIT` amber, `REVIEW` violet, `APPROVE` green, `PUBLISH` emerald, `REJECT` red, `ARCHIVE` zinc, `REOPEN` cyan, `CREATE`/`EDIT` slate).

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, TypeScript | Single-page application UI |
| **Build Tool** | Vite 6 | Fast HMR & production bundle build |
| **Backend Framework** | Node.js, Express 4 | REST API, RBAC middleware & workflow engine |
| **Database** | SQLite (`dev.db`) | Local embedded database storage |
| **ORM & Seeding** | Prisma ORM 6, `ts-node` | Type-safe schema migrations & data seeding |
| **Styling** | TailwindCSS | Utility-first monochrome design system |
| **Animations & Icons** | Framer Motion, Lucide React | Micro-animations & component iconography |
| **Validation** | Zod | Runtime request schema & environment validation |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Bearer token authorization flow |
| **State Management** | TanStack Query v5 (React Query) | Server state caching, background refetching |

---

## 🏗️ Architecture Overview

```text
[ React 18 SPA Frontend ]
           │
           │ HTTP / REST API (Bearer JWT Auth)
           ▼
[ Node.js + Express REST API ]
           │
           ├─► Middleware: JWT Authentication & Zod Schema Validation
           ├─► Security: Separation of Duties & RBAC Role Enforcement
           ├─► Engine: State Machine & OCC Version Validation
           ▼
[ Prisma ORM (Interactive Transactions) ]
           │
           ▼
[ SQLite Database (dev.db) ]
```

---

## 📁 Project Structure

```text
.
├── backend/                  # Node.js + Express REST API Server
│   ├── prisma/               # Prisma schema & seed script (schema.prisma, seed.ts, dev.db)
│   └── src/                  # Controllers, middleware, routes, services, workflow engine
├── src/                      # React + TypeScript SPA Client
│   ├── components/           # Reusable UI components, sidebars, tables, tooltips
│   ├── features/             # Feature views (Auth, Dashboard, Documents, Review, Audit)
│   ├── hooks/                # React Query hooks (useDocuments.ts)
│   └── services/             # HTTP API client (apiClient.ts)
├── README.md                 # Primary setup & project documentation
└── DESIGN.md                 # Technical architecture & design decisions
```

---

## ⚙️ Prerequisites

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

---

## 🚀 Step-by-Step Setup

Follow these numbered steps to configure, seed, and run the application locally:

### Step 1 — Clone Repository
```bash
git clone https://github.com/Navya075/ElevateBox.git
cd ElevateBox
```

### Step 2 — Backend Dependencies Setup
```bash
cd backend
npm install
```

### Step 3 — Environment Configuration
Create a `.env` file in the `backend/` directory by copying `.env.example`:
```bash
cp .env.example .env
```
*(No additional environment configuration is required for local development; default variables configure SQLite at `file:./dev.db` and API on port `5000`)*.

### Step 4 — Database Initialization
Inside the `backend/` directory:
```bash
npx prisma generate
npx prisma db push
```

### Step 5 — Seed Evaluation Accounts & Sample Data
Inside the `backend/` directory:
```bash
npm run prisma:seed
```

### Step 6 — Frontend Dependencies Setup
Open a second terminal window in the workspace root:
```bash
npm install
```

### Step 7 — Start Backend & Frontend Servers
1. Inside the `backend/` directory:
```bash
npm run dev
```
2. In the workspace root terminal:
```bash
npm run dev
```

### Step 8 — Verify the Application
Open your web browser and verify the running application:
- **Frontend Web Application**: `http://localhost:5173`
- **Backend Health Check**: `http://localhost:5000/health`

Evaluators can immediately explore the application by logging in with any of the four pre-seeded evaluation accounts listed below.

### Step 9 — (Optional) Open Prisma Studio

Prisma Studio provides a visual, browser-based graphical interface for inspecting and verifying data stored in the local SQLite database (`dev.db`). It allows evaluators to browse and inspect the application's database tables, including Users, Documents, and Audit Logs, without writing SQL queries.

To launch Prisma Studio, run the following commands inside the `backend/` directory:

```bash
cd backend
npx prisma studio
```

Once started, Prisma Studio will open automatically in your browser at `http://localhost:5555`.

---

## 🌐 Application URLs

| Service | URL | Note |
| :--- | :--- | :--- |
| **GitHub Repository** | `https://github.com/Navya075/ElevateBox` | Source code repository |
| **Frontend Web Application** | `http://localhost:5173` | Open in web browser |
| **Backend REST API Base** | `http://localhost:5000/api` | API Endpoints |
| **Backend Health Check** | `http://localhost:5000/health` | Health Check Endpoint |
| **Prisma Studio** | `http://localhost:5555` | Graphical Database Interface |

---

## 🔑 Seeded Accounts & Test Credentials

> **Note for Evaluators**: Registration is disabled by design. You can directly log in using any of the four pre-seeded accounts below:

| Role | Seeded Email | Display Name | Role Capabilities |
| :--- | :--- | :--- | :--- |
| **Author** | `alice@example.com` | Alice Thorne | Create, edit, and submit own drafts. Cannot review or approve. |
| **Reviewer** | `bob@example.com` | Bob Jenkins | Access Review Queue. Approve, reject (with comment), publish. |
| **Admin** | `admin@example.com` | Charlie Admin | Publish approved specs, soft-delete archive, view full audit history. |
| **Viewer** | `viewer@example.com` | Diana Reader | Read-only consumer of published specifications. |

---

## 🔄 High-Level System Workflow

```text
Author
  │
Create Draft
  │
Submit
  ▼
Reviewer
  │
Approve / Reject
  │
  ├── Reject ──► Author edits ──► Submit again
  │
  └── Approve
        │
        ▼
Published Specification
        │
        ▼
Admin Archive
```

---

## 🔄 Workflow State Machine

```text
              ┌──────────────┐
              │    DRAFT     │◄────────┐
              └──────┬───────┘         │ (Reopen by Author)
                     │ (Submit)        │
                     ▼                 │
              ┌──────────────┐         │
              │  SUBMITTED   ├─────────┴────────┐
              └──────┬───────┘                  │ (Reject with Comment)
                     │ (Approve)                │
                     ▼                          │
              ┌──────────────┐                  │
              │   APPROVED   │                  │
              └──────┬───────┘                  │
                     │ (Publish)                │
                     ▼                          │
              ┌──────────────┐                  │
              │  PUBLISHED   │                  │
              └──────┬───────┘                  │
                     │                          │
                     ▼                          ▼
              ┌──────────────────────────────────┐
              │    ARCHIVED (Terminal State)     │
              └──────────────────────────────────┘
```

### Transition Rules

1. **`DRAFT` → `SUBMITTED`**: Executed by document `Author`.
2. **`SUBMITTED` → `APPROVED`**: Executed by `Reviewer` (prohibits self-approval).
3. **`SUBMITTED` → `REJECTED`**: Executed by `Reviewer` (requires mandatory rejection comment).
4. **`REJECTED` → `DRAFT`**: Executed by document `Author` (reopens document for edits).
5. **`APPROVED` → `PUBLISHED`**: Executed by `Reviewer` or `Admin`.
6. **`ANY` → `ARCHIVED`**: Executed by `Admin` (soft-delete compliance state).

---

## 📊 Role Permissions Matrix

| Capability / Action | Author | Reviewer | Admin | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Create & Edit Drafts** | ✓ | ✗ | ✗ | ✗ |
| **Submit Draft for Review** | ✓ | ✗ | ✗ | ✗ |
| **Reopen Rejected Draft** | ✓ | ✗ | ✗ | ✗ |
| **Approve / Reject Submissions** | ✗ | ✓ | ✗ | ✗ |
| **Publish Approved Specifications** | ✗ | ✓ | ✓ | ✗ |
| **Archive Documents (Soft Delete)** | ✗ | ✗ | ✓ | ✗ |
| **Browse Review Queue** | ✗ | ✓ | ✗ | ✗ |
| **View Audit Trail** | ✗ | ✓ | ✓ | ✗ |
| **View Archived Files** | ✗ | ✗ | ✓ | ✗ |
| **Browse Published Specifications** | ✓ | ✓ | ✓ | ✓ |

---

## 🔌 API Endpoint Highlights

| Endpoint Route | Method | Access | Purpose |
| :--- | :---: | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticate user and issue Bearer JWT |
| `/api/auth/me` | `GET` | Authenticated | Retrieve active session details |
| `/api/documents` | `GET` / `POST` | Role-filtered | List documents / Create new draft specification |
| `/api/documents/:id` | `GET` / `PATCH` | Role-filtered | Fetch document details / Edit draft specification |
| `/api/documents/:id/submit` | `POST` | Author | Submit draft document for peer review |
| `/api/documents/:id/approve` | `POST` | Reviewer | Approve submitted specification (SoD enforced) |
| `/api/documents/:id/reject` | `POST` | Reviewer | Reject document (requires comment) |
| `/api/documents/:id/reopen` | `POST` | Author | Reopen rejected document back to draft |
| `/api/documents/:id/publish` | `POST` | Reviewer / Admin | Publish approved document specification |
| `/api/documents/:id/archive` | `POST` | Admin | Soft-delete document to permanent archive |
| `/api/audit/logs` | `GET` | Reviewer / Admin | Fetch system audit trail with filtering |

---

## 🏆 Evaluation Highlights

* **Role-Based Access Control**: Strict role boundary checks enforced on both server endpoints and UI components.
* **ISO Workflow Engine**: Declarative state transitions enforcing valid document pathways.
* **Separation of Duties**: Author self-approval guard preventing self-reviews.
* **Optimistic Concurrency Control**: Versioning mechanism preventing stale data overwrites (`HTTP 409 Conflict`).
* **Atomic Audit Logging**: Append-only log entries committed inside `prisma.$transaction`.
* **REST API Architecture**: Clean separation between React SPA and Express API.
* **Zero Compilation Warnings**: Both frontend and backend compile with 0 TypeScript errors.

---

## ✅ Evaluation Checklist

| Challenge Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Authentication System** | JWT Bearer token authentication & pre-seeded accounts | ✅ |
| **Role-Based Access Control** | 4 distinct roles (`AUTHOR`, `REVIEWER`, `ADMIN`, `VIEWER`) | ✅ |
| **ISO Workflow Engine** | Declarative state machine (`DRAFT` → `SUBMITTED` → `APPROVED` → `PUBLISHED`) | ✅ |
| **Separation of Duties** | Self-approval guard prohibiting authors from reviewing own docs | ✅ |
| **Immutable Audit Trail** | Atomic event logging via Prisma `$transaction` | ✅ |
| **Optimistic Concurrency Control** | Version matching (`expectedVersion`) preventing stale overwrites (`409`) | ✅ |
| **Prisma ORM & SQLite** | Type-safe ORM schema, migrations & seed script | ✅ |
| **Responsive Monochrome UI** | TailwindCSS monochrome black theme with soft workflow badges | ✅ |
| **Zero Compilation Errors** | 0 TypeScript errors across frontend and backend builds | ✅ |

---

## 📜 Available Scripts

### Root Workspace Scripts

| Script | Command | Action |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Vite frontend dev server on port 5173 |
| `build` | `npm run build` | Runs `tsc -b` and builds production frontend bundle |
| `preview` | `npm run preview` | Previews production frontend build locally |

### Backend Workspace Scripts (`cd backend`)

| Script | Command | Action |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Express server with hot-reload (`tsx watch src/server.ts`) |
| `build` | `npm run build` | Compiles backend TypeScript (`tsc`) to `dist/server.js` |
| `prisma:seed` | `npm run prisma:seed` | Seeds SQLite database with test accounts and documents |
| `db push` | `npx prisma db push` | Pushes Prisma schema directly to SQLite database |
| `generate` | `npx prisma generate` | Generates TypeScript Prisma Client bindings |

---

## 📝 Design Notes

Detailed explanations of system invariants, database vs. application enforcement, OCC conflict handling, audit log transaction atomicity, failure modes, and production scaling recommendations are documented in **[DESIGN.md](DESIGN.md)**.
