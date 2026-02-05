# Governance & Power Hierarchy – Phase 1 (Initial Release)

This document defines the **roles, powers, scope, and intentional limitations** of the governance system for the application.  
It reflects **Phase 1 decisions only** and deliberately postpones advanced enforcement, AI agents, and voting mechanisms.

---

## Core Principles

- Everyone starts as a **User**
- Governance is **area-based**, managed by **NGOs**
- Power is **delegated**, not centralized
- Ownership ≠ execution
- Enforcement is **soft in Phase 1**, strictness comes later
- Auditability is mandatory from day one

---

## Entities (Conceptual)

- **User** – any person using the app
- **Area** – a geographic or logical region
- **NGO** – governing body responsible for an area
- **Domain** – functional responsibility (e.g., Events, Tasks)

---

## Domains (Phase 1 Set)

These represent **areas of responsibility**, not separate roles.

- `COMMUNITY_EVENTS`
- `INDIVIDUAL_TASKS`
- `REWARDS`
- `VERIFICATION`

> Domains are modeled early to enable clean permission expansion and future AI agents.

---

## Role Hierarchy

### 1. User

**Scope**
- Platform-wide (within assigned area)

**Powers**
- Participate in tasks and events
- Submit individual tasks or community events
- Earn rewards / scores
- View personal activity

**Limitations**
- No governance or moderation powers
- No verification authority

---

### 2. NGO (Entity)

**Scope**
- One NGO manages one area (policy-level rule)

**Responsibilities**
- Acts as the functional governing unit
- Owns area-level tasks, events, and moderation

**Status**
- `PENDING` → `APPROVED` → `SUSPENDED`
- Approval controlled by Platform Admin

---

### 3. NGO Owner

**Scope**
- Single NGO / Area

**Role Nature**
- Supervisory and analytical
- Accountable authority, not executor

**Powers**
- View NGO-level analytics and reports
- Invite NGO Admins via invite mechanism
- Assign and modify admin domains
- Request admin power escalation
- Recommend approvals/rejections (non-executing)

**Limitations**
- Cannot directly execute moderation actions
- Cannot verify tasks or events
- Cannot bypass Platform Admin decisions

---

### 4. NGO Admin

**Scope**
- Single NGO / Area

**Role Nature**
- Operational executor

**Powers**
- Execute actions within assigned domains
- Verify tasks and events
- Manage community events
- Moderate users (within domain scope)
- Handle reward-related actions

**Domain Assignment**
- Admins are assigned one or more **Domains**
- Phase 1 allows multiple domains per admin
- Domain specialization is **advisory**, not enforced strictly

**Limits**
- Maximum admins per NGO: **4 (soft limit)**
- Limit enforced at service level, not DB constraint
- Platform Admin can override limits

---

### 5. Platform Admin

**Scope**
- Platform-wide (all areas and NGOs)

**Role Nature**
- System-level authority

**Powers**
- Approve / reject NGO registration
- Suspend or delete NGOs
- Override NGO decisions
- Manage roles and permissions
- Assign or revoke Platform Admins
- Emergency intervention across all domains

**Operational Rules**
- Actions must be logged with reason and scope
- No domain restrictions
- No NGO binding

**Phase 1 Note**
- Platform Admin decisions are unilateral
- No voting or consensus required yet

---

## Platform Admin (Future Consideration – Not Implemented)

- Multiple Platform Admins
- Voting / consensus-based critical actions
- AI-assisted recommendations
- Abuse prevention via distributed authority

> These are explicitly **out of scope for Phase 1**.

---

## Invitations & Upgrades (Phase 1)

- All users start as `User`
- NGO registration requires Platform Admin approval
- NGO Owner invites Admins via invite flow
- Admin domain assignment decided by Owner
- Domain escalation requires Owner + Platform Admin approval

---

## What is Enforced in Phase 1

- Role hierarchy
- Area → NGO mapping
- NGO ownership
- Domain modeling
- Admin invitation flow
- Soft admin limits
- Audit logs for all admin actions

---

## What is NOT Enforced in Phase 1 (Intentionally)

- Admin voting systems
- AI agents
- Strict one-admin-per-domain rule
- Automated abuse detection
- Permission granularity enforcement
- Cross-NGO governance

---

## Non-Negotiables

- Every admin action must be logged
- Every action must have a clear scope (NGO / Area / Domain)
- Role upgrades and downgrades must be reversible
- Schema must remain flexible to future governance expansion

---

## Phase 1 Objective

> Establish **trust, clarity, and accountability**  
> Not automation, not optimization, not AI

This governance structure is designed to **scale without refactoring** as powers evolve.
