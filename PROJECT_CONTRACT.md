# PROJECT_CONTRACT.md

# TransitOps
### Fleet Management ERP
### Odoo × Adamas University Hackathon 2026

---
# AI EXECUTION RULES

You are an implementation engineer.

You are NOT allowed to:

- Redesign the architecture.
- Introduce new libraries.
- Rename folders.
- Rename APIs.
- Modify database schema.
- Add features not listed.
- Remove validations.
- Change business logic.
- Refactor unrelated code.

You are ONLY allowed to:

- Implement the assigned task.
- Fix compilation errors.
- Fix integration issues.
- Improve code readability without changing behavior.

If you believe a design should change,
STOP and explain the issue instead of implementing the change.

---

# PROJECT STATUS

**Status:** ARCHITECTURE LOCKED

This document is the **single source of truth** for the entire project.

Every implementation decision MUST follow this document.

No AI assistant, developer, or contributor may redesign the architecture unless explicitly approved by **Shubham (Team Lead)**.

---

# PROJECT GOAL

Build a clean, production-quality Fleet Management ERP that maximizes the Odoo judging criteria.

The objective is NOT to build the biggest application.

The objective is to build the BEST ENGINEERED application.

Priority Order

1. Database Design
2. Business Logic
3. Clean Architecture
4. Maintainability
5. Validation
6. Security
7. Performance
8. Professional UI
9. Scalability
10. Documentation

---

# TEAM

## Shubham

Role

- Solution Architect
- Team Lead
- Backend
- Database
- Business Logic
- Integration
- QA
- Git
- Deployment

---

## Priya

Role

- Frontend
- UI/UX
- React
- Components
- Routing
- Presentation

---

# AI ROLE ASSIGNMENT

## ChatGPT

Responsible For

- Architecture
- Planning
- Database Design
- API Design
- Technical Decisions
- QA
- Review

Must NOT generate conflicting architecture.

---

## Antigravity (Shubham)

Responsible ONLY for

- Backend implementation

Must NOT

- Change architecture
- Change APIs
- Change database
- Change folder structure

---

## Antigravity (Priya)

Responsible ONLY for

- Frontend implementation

Must NOT

- Change UI hierarchy
- Change routes
- Change APIs
- Change business logic

---

# TECHNOLOGY STACK (LOCKED)

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- Lucide React

---

## Backend

- Node.js
- Express.js
- JWT
- bcrypt
- multer
- mysql2

---

## Database

MySQL

---

# STRICTLY PROHIBITED

Do NOT introduce

- Prisma
- PostgreSQL
- MongoDB
- Firebase
- Supabase
- GraphQL
- Redux
- Zustand
- React Query
- CQRS
- Event Bus
- Microservices
- Dependency Injection Containers
- Clean Architecture redesign
- DDD

unless explicitly approved.

---

# ARCHITECTURE (LOCKED)

Pattern

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

MySQL

Controllers contain NO business logic.

Repositories contain NO business logic.

Services contain ALL business logic.

---

# BACKEND FOLDER STRUCTURE

src/

- config/
- routes/
- controllers/
- services/
- repositories/
- middleware/
- validators/
- utils/
- types/
- app.ts
- server.ts

No additional architectural folders.

---

# FRONTEND FOLDER STRUCTURE

src/

- assets/
- components/
- features/
- hooks/
- layouts/
- pages/
- routes/
- services/
- context/
- constants/
- utils/
- types/
- styles/

No redesign.

---

# DATABASE (LOCKED)

Exactly 10 tables.

1. roles
2. users
3. vehicles
4. drivers
5. trips
6. maintenance_logs
7. fuel_logs
8. expenses
9. activity_logs
10. trip_status_history

No additional tables.

---

# BUSINESS MODULES

1. Authentication
2. Dashboard
3. Vehicles
4. Drivers
5. Trips
6. Maintenance
7. Fuel
8. Expenses
9. Analytics
10. Settings

No extra modules.

---

# UI CONTRACT

Follow the official TransitOps mockups.

Must keep

- Sidebar
- Header
- Dashboard
- CRUD Layout
- Cards
- Tables
- Forms

No redesign.

No AI generated fancy dashboard.

No gradients.

No glassmorphism.

No animated dashboards.

Professional ERP only.

---

# DESIGN SYSTEM

Shared Components

- Button
- Card
- Input
- Modal
- Select
- SearchBar
- DataTable
- Badge
- Loader
- EmptyState
- Pagination
- ConfirmDialog

Reuse components.

Never duplicate.

---

# THEME

Support

- Light
- Dark

Using Tailwind dark mode.

Do NOT create separate UIs.

---

# API CONTRACT

Every endpoint returns

Success

```json
{
    "success": true,
    "message": "",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "",
    "errors": []
}
```

Never return inconsistent response formats.

---

# AUTHENTICATION

JWT

bcrypt

Role Based Access Control

Roles

- Admin
- Fleet Manager
- Dispatcher
- Safety Officer
- Financial Analyst

---

# BUSINESS RULES

Vehicle

- Registration Unique
- Capacity > 0

Driver

- License Unique
- License Valid

Trips

Dispatch only if

- Driver Available
- Vehicle Available
- License Valid
- Capacity Valid

Completion

Automatically

- Vehicle Available
- Driver Available
- History Recorded

Maintenance

Opening

↓

Vehicle In Shop

Closing

↓

Vehicle Available

No manual status changes that violate workflow.

---

# TRANSACTION RULES

Must use database transactions.

Operations

- Dispatch Trip
- Complete Trip
- Cancel Trip
- Open Maintenance
- Close Maintenance

Never partially update multiple tables.

---

# VALIDATION

Frontend

React Hook Form

+

Zod

Backend

Validation Middleware

+

Service Validation

Backend is the final authority.

---

# TYPESCRIPT

Use strict typing.

Create shared types.

Never use

```typescript
any
```

unless absolutely unavoidable.

---

# ERROR HANDLING

Centralized middleware.

Never duplicate try/catch logic unnecessarily.

---

# RESPONSE HELPER

Use shared response helper.

Never manually return JSON.

---

# CODE STYLE

Prefer

Small functions

Readable code

Meaningful variable names

Single responsibility

Reusable utilities

Avoid

Nested logic

Duplicate code

Magic strings

Large controllers

Large React components

---

# GIT WORKFLOW

Branches

main

backend-dev

frontend-dev

Workflow

Pull

↓

Implement

↓

Test

↓

Commit

↓

Push

↓

Pull Latest

↓

Merge

Never overwrite another developer's work.

---

# IMPLEMENTATION ORDER

1. Project Setup
2. Database
3. Authentication
4. Vehicles
5. Drivers
6. Trips
7. Maintenance
8. Fuel
9. Expenses
10. Dashboard
11. Analytics
12. QA
13. Documentation
14. Submission

Do NOT change this order.

---

# DEFINITION OF DONE

A feature is complete ONLY IF

✓ Database implemented

✓ Repository complete

✓ Service complete

✓ Controller complete

✓ Route complete

✓ Validation complete

✓ Frontend page complete

✓ API connected

✓ UI tested

✓ Business rules verified

✓ Responsive

✓ Dark mode verified

---

# PERFORMANCE RULES

Avoid

Unnecessary database queries

Duplicate API calls

Duplicate rendering

Optimize for simplicity.

---

# SECURITY

Always

JWT

bcrypt

Parameterized SQL

Role Validation

Input Validation

Never trust frontend input.

---

# DOCUMENTATION

Every module should include

Purpose

Business rules

API

Validation

---

# IMPORTANT

Do NOT invent features.

Do NOT redesign.

Do NOT over engineer.

If something is unclear,

follow this priority:

1. PROJECT_CONTRACT.md
2. Official Problem Statement
3. Official UI Mockups
4. Shubham's instructions

---

# FINAL RULE

This document is the constitution of TransitOps.

Every implementation must follow it.

Architecture is frozen.

Scope is frozen.

Database is frozen.

API contracts are frozen.

Business rules are frozen.

Frontend hierarchy is frozen.

Only implementation is allowed.
