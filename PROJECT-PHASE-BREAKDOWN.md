# Nestora Project Phase Breakdown

## Purpose

This document breaks the Nestora house-renting project into execution phases so the team can build, validate, and launch in controlled steps.

## Planning Principles

- Build in small, testable increments.
- Validate marketplace liquidity before scaling features.
- Prioritize trust, listing quality, and inquiry conversion.
- Gate each phase with measurable exit criteria.

---

## Phase 0 — Foundation Hardening (Weeks 1–2)

### Objective

Lock product scope to house-renting and stabilize core technical flows.

### Key Deliverables

- Unified product language (remove non-rental concepts from UX/content).
- Stable auth/session behavior for renter and landlord actions.
- Reliable listing CRUD baseline (create/list/get; edit optional if already present).
- Tracking baseline for core events.

### Workstreams

- **Product:** finalize pilot geography, currency, and listing quality baseline.
- **Design:** align all key screens to rental-specific taxonomy.
- **Engineering:** stabilize API and UI for listing browse/detail/create and dashboard shell.
- **Data:** define event naming convention and KPI data dictionary.

### Exit Criteria (Definition of Done)

- 0 critical blockers in create/list/detail flows.
- Event schema approved for activation + inquiry funnel.
- Pilot city and launch assumptions signed off.

### Phase 0 Signed Assumptions (March 2026)

- Pilot city: Riyadh
- Currency: SAR
- Inquiry policy: guest inquiries are allowed
- Event naming convention: `snake_case`
- Event/KPI dictionary: `docs/event-dictionary-phase-0.md`

### Owner

Product + Engineering Lead

---

## Phase 1 — MVP Launch (Weeks 3–6)

### Objective

Ship an end-to-end rental marketplace MVP that generates qualified landlord inquiries.

### Key Deliverables

- Rental listing creation with required fields and attributes.
- Public listing browse with search + filters.
- Listing detail page with inquiry CTA.
- Inquiry event capture and confirmation UX.
- Basic landlord dashboard for listing oversight.

### Workstreams

- **Product:** finalize MVP acceptance criteria and launch checklist.
- **Design:** complete responsive UX for list/detail/create funnel.
- **Engineering:** implement inquiry flow persistence and instrumentation.
- **QA:** test happy paths + top failure scenarios.
- **Go-to-market:** prepare pilot landlord onboarding playbook.

### Exit Criteria (Definition of Done)

- Search-to-detail and detail-to-inquiry tracking works end-to-end.
- Inquiry events are visible in analytics dashboard.
- MVP supports pilot launch with no P0/P1 defects.
- Support runbook available for launch week.

### Success Targets (First 30 Days Post-Launch)

- Listing activation rate ≥ 45%
- Search-to-detail CTR ≥ 18%
- Detail-to-inquiry conversion ≥ 8%

### Owner

Product Manager (Phase Lead) + Tech Lead

---

## Phase 2 — Trust & Conversion Optimization (Weeks 7–10)

### Objective

Increase conversion and trust signals after MVP launch.

### Key Deliverables

- Saved listings and saved searches.
- Listing quality guardrails (required photos/fields threshold).
- Anti-spam and moderation baseline.
- Improved search relevance and filtering polish.

### Workstreams

- **Product/Data:** identify funnel drop-offs and prioritize improvements.
- **Engineering:** implement trust controls and saved-state features.
- **Ops:** establish moderation workflow and escalation path.

### Exit Criteria (Definition of Done)

- Quality policy is enforced at publish time.
- Spam/abuse detection flow operational.
- Saved listings and saved searches usable on mobile and desktop.

### Success Targets

- Time to first inquiry reduced by 20% from MVP baseline.
- D30 renter retention ≥ 20%.
- Landlord response time improves week over week.

### Owner

Growth PM + Ops Lead

---

## Phase 3 — Monetization Activation (Weeks 11–14)

### Objective

Activate revenue features without reducing listing supply growth.

### Key Deliverables

- Subscription plans (Free, Pro) with clear feature gating.
- Premium placement/boost options.
- Landlord analytics dashboard (views, inquiries, conversion snapshot).
- Monetization experiment framework (pricing and packaging tests).

### Workstreams

- **Product:** packaging, pricing, and rollout strategy.
- **Engineering:** payment provider integration and entitlement logic.
- **Data:** monetization dashboard and experiment reporting.
- **Customer Success:** migration and communication plan for landlords.

### Exit Criteria (Definition of Done)

- Subscription and entitlement flows are production-ready.
- Billing events reconcile correctly with user entitlements.
- Monetization rollout uses feature flags and rollback plan.

### Success Targets

- Paid conversion reaches 5–10% within 6 months.
- No significant drop in listing activation after paywall introduction.

### Owner

Monetization PM + Billing Engineer

---

## Phase 4 — Scale & Expansion (Post-Launch Quarter 2+)

### Objective

Scale to additional markets and deepen platform defensibility.

### Candidate Deliverables

- Multi-city and multi-currency support.
- In-app messaging and tour booking.
- Agency/team workflows with role-based permissions.
- Native mobile app feasibility and rollout plan.

### Entry Criteria

- Marketplace liquidity stable in pilot geography.
- Unit economics and retention trends are positive.

### Owner

Head of Product + Expansion Team

---

## Cross-Phase Governance

### Weekly Cadence

- Product-Engineering planning sync (60 min).
- KPI review (activation, inquiry conversion, retention).
- Risk review with action owners.

### Decision Gates

- **Go/No-Go after Phase 1:** launch readiness + support preparedness.
- **Go/No-Go after Phase 2:** trust KPIs and abuse control maturity.
- **Go/No-Go after Phase 3:** monetization impact on liquidity.

### Core Artifacts to Maintain

- PRD (source of truth)
- Prioritized backlog by phase
- KPI dashboard and event dictionary
- Launch runbook and incident playbook

---

## Suggested Sprint-to-Phase Mapping

- Sprint 1: Phase 0 hardening
- Sprints 2–3: Phase 1 MVP launch
- Sprints 4–5: Phase 2 trust & conversion
- Sprints 6–7: Phase 3 monetization

---

## Immediate Next Actions (This Week)

1. Confirm pilot city, currency, and inquiry login policy.
2. Freeze Phase 1 scope and mark out-of-scope items.
3. Finalize event tracking schema for funnel KPIs.
4. Create implementation tickets grouped by phase and owner.
5. Set Phase 1 go-live quality threshold (P0/P1 defect policy).
