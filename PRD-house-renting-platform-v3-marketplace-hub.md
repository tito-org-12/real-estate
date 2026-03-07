# Nestora PRD v3 - Marketplace Hub Expansion

## Document Control

- Product: Nestora - House Renting Marketplace
- Version: 3.0 (Comparison Draft)
- Owner: Product Management
- Date: March 7, 2026
- Status: Draft for review and scope lock
- Related docs:
  - `PRD-house-renting-platform.md`
  - `PROJECT-PHASE-BREAKDOWN.md`
  - `docs/event-dictionary-phase-0.md`

## Purpose

This PRD extends the current Nestora scope into a high-intent marketplace hub model inspired by successful regional aggregators. It is designed to keep the current execution discipline while adding trust, communication, professional listing workflows, and conversion tools needed for stronger growth.

## Product Vision

Nestora becomes the centralized, trusted hub for rental discovery where seekers find verified homes quickly and owners or agents receive qualified leads through multiple contact channels.

## Strategic Positioning

- For seekers: one searchable source of verified listings with rich media and clear next actions.
- For owners and brokers: a professional demand-generation channel with visibility controls and measurable lead outcomes.
- For Nestora: liquidity-first marketplace that scales from aggregator to transaction-enabler.

## Target Outcomes

- Improve speed from search to first contact.
- Increase trust through listing verification and quality guardrails.
- Support both individual owners and professional advertisers.
- Create monetization paths without hurting listing supply.

## Market Assumptions (Locked)

- Primary market: Rwanda
- Default currency: Rwandan Franc (`RWF`)
- Seeker/buyer access policy: no authentication required for browse, detail view, and contact actions

## Users and Segments

1. Seekers (renters and buyers if sale mode is enabled)
2. Individual property owners
3. Brokers and agencies (multi-listing operators)
4. Admin and moderation teams

## Core Product Scope

### 1. Marketplace Discovery

- Advanced search and filtering with:
  - `advert_type` (rent, sale, auction)
  - `property_type` (house, apartment, land, commercial, office, room)
  - `price_min`, `price_max`
  - `location`, `neighborhood`
  - bedrooms, bathrooms, furnished, availability
- Dedicated navigation entry points:
  - Home
  - For Rent
  - For Sale
  - Auction

### 2. Listing Lifecycle and Management

- Multi-tier listing plans:
  - Free
  - Standard
  - Premium (featured placement)
  - Professional Broker
  - Institutional
- Listing status model:
  - draft, pending_review, active, expired, rejected, archived
- Listing metadata:
  - reference number
  - publish date
  - expiry date
  - owner/agency profile
- Professional dashboard capabilities:
  - bulk listing management (target support 40+ adverts per account)
  - performance overview
  - support and issue tracking

### 3. Contact and Lead Generation

- Multi-channel conversion actions on listing detail:
  - WhatsApp CTA
  - Click-to-call CTA
  - Request Details form
- Guest-access policy:
  - seekers and buyers can contact advertisers without login
  - optional account creation is shown only as a secondary action after contact
- Lead handling requirements:
  - route inquiry to advertiser inbox/dashboard
  - capture lead source and channel
  - track response status and time-to-first-response

### 4. Trust and Quality Controls

- Ad verification workflow:
  - manual review and optional automated checks
  - stale listing detection and re-validation prompts
- Quality publishing guardrails:
  - required fields
  - minimum photo threshold
  - pricing and location completeness checks
- Anti-spam controls for forms and account abuse

### 5. Media and Location Enrichment

- Photo gallery support with ordering and cover image
- Optional video attachment/request workflow
- Geolocation and map display on listing pages

### 6. Content and Education Hub

- News/blog module with categories:
  - market trends
  - legal and compliance guidance
  - investment and renting tips
- Newsletter subscription for retention and nurturing

### 7. Advertiser Ecosystem

- Advertisers directory page for verified agencies and independent agents
- Agency profile pages with active listings and trust signals

### 8. Utility and Compliance

- FAQ/help center
- Privacy policy and terms
- Contact and support pages
- Mobile app download links (if app exists in market)

## End-to-End User Flow (Landing to Conversion)

1. User lands on home page from search, social, or referral.
2. User applies search filters and browses listing cards.
3. User opens listing detail to evaluate media, details, and trust signals.
4. User converts using WhatsApp, call, or request form.
5. User enters nurturing path through account signup or newsletter subscription.

## Functional Requirements

### FR-01 Search and Discovery

- System shall provide server-side searchable and filterable listing index.
- System shall support filter combinations without full page reload on web.
- System shall expose SEO-friendly category pages for rent, sale, and auction.
- System shall allow guest users to browse and view property details without authentication.

### FR-02 Listing Creation and Plans

- System shall enforce plan-based limits and visibility rules.
- System shall support free and paid listing tiers with entitlement checks.
- System shall generate unique listing reference numbers.

### FR-03 Listing Detail

- System shall display key specs, media, map, ref number, publish date, and expiry date.
- System shall show advertiser profile and verification state.

### FR-04 Contact Channels

- System shall allow configurable WhatsApp number per advertiser.
- System shall support click-to-call links on mobile and desktop compatible flows.
- System shall store request-form submissions with listing and advertiser references.
- System shall allow guest users to submit request-details forms without login.

### FR-05 Verification and Moderation

- System shall support moderation queue for pending and flagged listings.
- System shall notify advertisers when listing verification expires.
- System shall prevent publishing if minimum quality policy fails.

### FR-06 Professional Dashboard

- System shall provide bulk operations for brokers (edit status, renew, archive).
- System shall surface listing and lead metrics by date range.

### FR-07 Content Hub

- System shall allow publishing and managing blog/news articles.
- System shall support SEO metadata and category taxonomy for content pages.

### FR-08 Directory and Profiles

- System shall provide searchable advertiser directory.
- System shall expose profile trust indicators (verified status, responsiveness, active listings).

### FR-09 Growth Features (Transaction-Enabler)

- Online viewing booking calendar and scheduling workflow.
- Mortgage calculator module with configurable local bank assumptions.
- Agent review and rating system with moderation controls.

## Non-Functional Requirements

- Performance:
  - listing search response `p95 <= 500ms`
  - largest contentful paint on listing pages `<= 2.5s` on target networks
- Availability: `99.9%` monthly uptime for core marketplace paths
- Security: secure advertiser/admin auth/session handling, abuse protections, and input validation
- Accessibility: WCAG 2.1 AA on core browse/detail/contact flows
- SEO: crawlable listing pages, structured metadata, canonical handling
- Observability: complete funnel instrumentation with `snake_case` events

## Event and KPI Framework

### Primary KPIs

- listing activation rate
- search-to-detail CTR
- detail-to-contact conversion rate by channel
- time-to-first-response by advertiser segment
- stale listing rate
- paid plan conversion rate

### Required Event Set (Minimum)

- `listing_search_performed`
- `listing_filter_applied`
- `listing_card_clicked`
- `listing_detail_viewed`
- `contact_whatsapp_clicked`
- `contact_call_clicked`
- `request_details_submitted`
- `listing_submitted_for_review`
- `listing_verified`
- `listing_expired`
- `listing_renewed`
- `newsletter_subscribed`
- `viewing_booking_created`
- `mortgage_calculator_used`
- `agent_review_submitted`

## Sitemap (Target Visible Structure)

### Header Navigation

- Home
- For Rent
- For Sale
- Auction
- Services (Pricing Plans)
- News/Blog
- About Us
- Contact

### User and Professional Portals

- Login/Register (advertisers, brokers, agencies, admin)
- Submit Property
- Dashboard (owner, broker, agency)
- Advertisers Directory

### Footer

- Help/FAQ
- Privacy Policy
- Terms
- Mobile App Download
- Newsletter Subscription

## Phase Plan (Updated)

## Phase 0 - Foundation Hardening (Weeks 1-2)

### Objective

Stabilize existing core flows and align taxonomy for multi-advert marketplace scope.

### Deliverables

- Keep current create/list/detail flow stability goals and advertiser/admin auth stability.
- Introduce advert and property taxonomy model (`rent/sale/auction`, property types).
- Finalize event dictionary extension for new contact channels.

### Exit Criteria

- 0 critical blockers in browse, detail, create, inquiry.
- Taxonomy and event schema approved.

## Phase 1 - MVP Launch+ (Weeks 3-6)

### Objective

Launch high-intent discovery and multi-channel lead conversion.

### Deliverables

- Advanced search and filters.
- Listing detail with ref number and publish/expiry dates.
- WhatsApp/call/request-details CTAs.
- Basic free vs premium visibility controls.
- News/blog baseline and newsletter capture.

### Exit Criteria

- channel-level conversion tracking active end-to-end.
- support runbook and moderation SOP available.
- no P0/P1 defects at launch gate.

## Phase 2 - Trust and Professionalization (Weeks 7-10)

### Objective

Increase trust and operational maturity for scale.

### Deliverables

- Verification and stale-listing revalidation workflows.
- Professional dashboard bulk actions for brokers and agencies.
- Advertisers directory and profile trust signals.
- Media enrichment (video request flow, map polish).

### Exit Criteria

- publish quality policy enforced.
- stale listing rate reduced versus phase 1 baseline.
- broker workflows usable on desktop and mobile.

## Phase 3 - Monetization and Enablers (Weeks 11-14)

### Objective

Monetize visibility and add transaction-enabler tools.

### Deliverables

- Paid plans and entitlements (standard, premium, professional, institutional).
- Featured placement and reporting.
- Online viewing booking.
- Mortgage calculator.
- Agent review and rating system.

### Exit Criteria

- billing and entitlement reconciliation passes.
- feature flags and rollback plans validated.
- no material liquidity drop after monetization rollout.

## Phase 4 - Scale and Expansion (Quarter 2+)

### Objective

Expand geography, channels, and ecosystem defensibility.

### Candidate Deliverables

- multi-city and multi-currency operations
- mobile app growth channel
- deeper CRM and lead routing integrations
- enterprise workflows and role-based permissions

## Success Targets by Stage

- Phase 1:
  - listing activation rate `>= 45%`
  - search-to-detail CTR `>= 18%`
  - detail-to-contact conversion `>= 8%`
- Phase 2:
  - time-to-first-inquiry reduced by `20%`
  - renter D30 retention `>= 20%`
  - stale listing rate reduced by `30%` from phase 1 baseline
- Phase 3:
  - paid conversion `5-10%` within 6 months
  - no significant drop in listing activation after paid rollout

## Open Decisions to Lock Before Build

1. Rwanda launch regions and neighborhood coverage priority.
2. Whether sale and auction are enabled at launch or feature-flagged post-launch.
3. Verification SLA and staffing model (manual-first vs hybrid automation).
4. Paid plan pricing and free-tier listing limits.
5. Local bank assumptions for mortgage calculator.

## Immediate Next Actions

1. Review this v3 PRD against `PRD-house-renting-platform.md` and lock scope deltas.
2. Finalize phase ownership across Product, Engineering, Ops, and Data.
3. Extend data model and API contracts for taxonomy, verification, and contact channels.
4. Define launch-quality checklist and defect policy for MVP Launch+ gate.
5. Convert phase deliverables into implementation epics and sprint tickets.
