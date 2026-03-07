# Product Requirements Document (PRD)

## Document Control

- Product: Nestora — House Renting Marketplace
- Version: 2.0 (Refined)
- Owner: Product Management
- Date: March 2, 2026
- Status: Draft for stakeholder alignment

## Executive Summary

Nestora is a two-sided rental marketplace focused on helping renters discover trusted homes quickly and helping landlords fill vacancies with qualified inquiries. The current product foundation already includes authentication, listing creation, listing browse/detail experiences, and a landlord dashboard baseline.

This refined PRD sharpens the strategy around a **single vertical: house renting**. It defines a practical MVP, measurable outcomes, risk controls, and a phased delivery plan to reach product-market fit and monetize responsibly.

## Project Overview

Nestora enables landlords to publish rental homes and manage listing inventory from one dashboard, while renters can search, filter, view property details, and submit interest in minutes. The product will launch as a responsive web app with PWA support and a type-safe API architecture.

Primary focus for this cycle:

- Increase quality listing supply.
- Improve renter conversion from browse to inquiry.
- Build trust through listing quality and operational controls.

## Problem Statement

Rental discovery is often fragmented, outdated, and low-trust. Renters waste time on stale or incomplete listings, while landlords struggle to attract serious leads and track inquiry outcomes. Nestora solves this by offering structured listing data, relevant search/filter tools, and a streamlined renter-to-landlord inquiry funnel.

## Product Goals

### Business Goals

- Achieve early market liquidity in pilot locations.
- Build a repeatable landlord acquisition and activation motion.
- Establish a monetization path without harming listing supply growth.

### User Goals

- Renters find relevant homes in less than 3 minutes.
- Landlords publish a complete rental listing in less than 10 minutes.
- Both sides experience transparent, trustworthy interactions.

## Success Metrics

### North Star Metric

- **Qualified inquiries per active listing per month**

### KPI Targets (MVP + first 90 days)

- Listing activation rate (new landlord publishes in 7 days): **≥45%**
- Search-to-detail click-through rate: **≥18%**
- Detail-to-inquiry conversion: **≥8%**
- Median time to first inquiry after publish: **<72 hours**
- Landlord D30 retention: **≥35%**
- Renter D30 retention: **≥20%**
- Paid conversion (if subscription rollout is enabled): **5–10% within 6 months**

## Target Users

### Primary

1. **Renters (22–45, urban/suburban, mobile-first)**
   - Goal: find reliable homes quickly with clear pricing and details.
2. **Independent Landlords (1–20 units)**
   - Goal: publish listings easily and receive qualified leads.

### Secondary

3. **Property Managers/Agencies (post-MVP)**
   - Goal: manage multi-listing workflows and team operations.
4. **Operations/Admin Team**
   - Goal: enforce listing quality, safety, and marketplace trust.

## User Personas

### Persona A — Amina (Renter)

- 29, relocating in 30 days.
- Needs trusted listings, clear location/rent, and fast landlord response.
- Frustration: fake/stale listings and poor listing quality.

### Persona B — Mr. Bello (Landlord)

- Owns 6 apartments.
- Needs easy publishing, visibility, and better lead quality.
- Frustration: fragmented channels and repetitive communication.

### Persona C — Grace (Property Manager, post-MVP)

- Manages 80 units.
- Needs bulk workflows, access control, and lead assignment tools.

## User Stories

### Renter

- As a renter, I want to search homes by location and budget so I can shortlist quickly.
- As a renter, I want detailed property pages with photos and attributes so I can make informed decisions.
- As a renter, I want to submit interest instantly so I can contact landlords with minimal friction.

### Landlord

- As a landlord, I want to create structured rental listings so my property is easy to evaluate.
- As a landlord, I want to manage listing status and visibility so I can reduce vacancy time.
- As a landlord, I want to receive inquiry notifications so I can respond quickly.

### Admin (post-MVP depth)

- As an admin, I want to review flagged listings so I can maintain marketplace trust.

## Core Features (Must-Have)

1. **Authentication and Session Management**
   - Secure sign-up/sign-in and protected landlord actions.

2. **Rental Listing Creation**
   - Required: title, monthly rent, location, description.
   - Attributes: bedrooms, bathrooms, square footage, availability status.
   - Images: MVP URL-based; native upload in next phase.

3. **Listing Discovery**
   - Public listing feed with keyword and location search.
   - Filters: price range, listing type, recency.

4. **Listing Detail Experience**
   - Full property profile, image gallery, location context, and inquiry CTA.

5. **Inquiry Capture**
   - “I’m Interested” action logs inquiry event and confirms submission.

6. **Landlord Dashboard (MVP)**
   - Listing overview and quick actions for create/edit/manage.

## Nice-to-Have Features (Post-MVP)

- Saved listings and saved searches.
- Map-based search and commute context.
- In-app messaging.
- Tour booking workflows.
- Verification badges and fraud prevention scoring.
- Agency teams and role-based access.
- AI-assisted listing enrichment.

## Functional Requirements

### FR-1 Authentication

- Users can register/login and maintain secure sessions.
- Protected actions require authenticated context.

### FR-2 Listing Creation

- Landlords can create listings with validated fields.
- Rent values are stored in minor currency units.
- Listing ownership and status are persisted.

### FR-3 Listing Browse

- Public endpoint returns published listings with pagination.
- Supports filters (type, min rent, max rent) and sort by recency.

### FR-4 Listing Details

- Public endpoint retrieves listing by ID with owner metadata.
- Gracefully handles not-found state.

### FR-5 Inquiry Flow

- Renter can submit an inquiry from listing detail.
- System records inquiry event with timestamp and listing reference.
- UI displays success/failure feedback.

### FR-6 Landlord Dashboard

- Landlord can view and manage listing inventory.
- Dashboard exposes account and listing status.

### FR-7 Subscription Readiness

- Paid plans can gate premium visibility and advanced tools.

## Non-Functional Requirements

- **Performance:** key listing pages load within 2.5s on standard broadband; API p95 under 400ms for core listing endpoints.
- **Reliability:** 99.9% monthly uptime target for auth and listing discovery.
- **Scalability:** support 100k listings and 10k DAU without re-platforming.
- **Security:** strong input validation, authenticated protected routes, secure session handling.
- **Accessibility:** WCAG 2.1 AA for primary user flows.
- **SEO:** crawlable listing pages with meaningful metadata.
- **Observability:** event instrumentation across activation and conversion funnel.

## Platform

- Web app (responsive, PWA-ready) as primary launch platform.
- Type-safe API layer for listing/auth/business workflows.
- Mobile applications deferred until post-PMF.

## Technical Constraints

- Must align with current TypeScript monorepo architecture.
- Must reuse current auth/session model and database schema compatibility.
- Must preserve listing schema support for dynamic attributes and image arrays.
- Must deliver MVP without major infrastructure rewrite.

## Design Requirements

- Premium, clean, trust-first interface.
- Mobile-first with clear visual hierarchy for rent, location, and essentials.
- Consistent design system usage across pages/components.
- Fast loading states for all listing-heavy views.
- Accessible forms, controls, and keyboard navigation.

## Monetization Strategy

### Primary Revenue

- Landlord subscription plans:
  - **Free:** baseline listing limits and standard distribution.
  - **Pro:** higher limits, priority placement, and advanced analytics.

### Secondary Revenue (Phase 2+)

- Featured listing boosts.
- Partner referral commissions (screening, insurance, moving services).

## Timeline and Priority

### Phase 0 (Weeks 1–2) — Scope Hardening

- Normalize all product language/UX to house renting.
- Stabilize auth, listing create/list/get, and dashboard basics.

### Phase 1 (Weeks 3–6) — MVP Launch

- Deliver rental-specific metadata and filter quality.
- Ship inquiry event logging and landlord notification baseline.
- Instrument activation and conversion analytics.
- Launch in one pilot geography.

### Phase 2 (Weeks 7–10) — Trust and Conversion

- Add saved listings/searches and listing quality controls.
- Introduce anti-spam and moderation baseline tools.

### Phase 3 (Weeks 11–14) — Monetization Expansion

- Enable paid tiers and premium placements.
- Add listing analytics for landlords.

## Assumptions

- Initial supply comes from independent landlords.
- Renters are willing to submit inquiry intent before full messaging support.
- Existing architecture can support MVP traffic.
- Pilot begins with one region/currency before expansion.

## Risks and Mitigations

- **Low listing supply:** run curated landlord onboarding and local partnerships.
- **Low trust from renters:** enforce quality thresholds and moderation.
- **Slow landlord response:** add response SLA nudges and notifications.
- **Scope drift:** enforce strict MVP boundary and phase gates.
- **Early monetization friction:** delay aggressive paywalls until liquidity targets are met.

## MVP Scope

### In Scope

- Secure auth and session flows.
- Rental listing creation with structured data.
- Public search/filter/browse experience.
- Listing detail pages with inquiry CTA.
- Inquiry event capture and basic landlord signal.
- Landlord dashboard baseline.
- Product analytics for funnel KPIs.

### Out of Scope

- Full in-app messaging suite.
- Tour scheduling orchestration.
- Advanced tenant screening workflows.
- Native mobile applications.
- Agency team management.

## Launch Readiness Checklist

- KPI dashboard configured and validated.
- Inquiry event pipeline tested end-to-end.
- Listing quality policy documented and enforced.
- Support/escalation playbook prepared.
- Pilot city acquisition plan confirmed.

## Open Decisions

1. Which pilot city/currency should be locked for launch?
2. Should inquiry require login in MVP, or allow guest submissions?
3. What minimum listing-quality threshold blocks publishing?
4. When should paid plans be enabled relative to liquidity milestones?

### Phase 0 Resolution Snapshot (March 2026)

- Pilot lock: Riyadh + SAR
- Inquiry policy: guest submissions allowed
- Event naming convention: `snake_case`

---

## Appendix — Alignment to Current Product Foundation

- Existing foundation already supports: authentication, listing create/list/get, and landlord dashboard shell.
- Immediate gap closure needed: inquiry persistence, rental-specific taxonomy hardening, and KPI instrumentation.
- Subscription capability should be feature-flagged and rolled out once liquidity KPIs are stable.
