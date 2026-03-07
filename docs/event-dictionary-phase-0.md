# Event Dictionary — Phase 0

Naming convention: `snake_case`

## Activation Funnel

| Event                      | Trigger                          | Required Context   |
| -------------------------- | -------------------------------- | ------------------ |
| `sign_up_started`          | User submits sign-up form        | `role`             |
| `sign_up_succeeded`        | Account successfully created     | `role`             |
| `listing_create_started`   | User submits create listing form | `type`             |
| `listing_create_succeeded` | Listing publish succeeds         | `type`, `location` |
| `listing_create_failed`    | Listing publish fails            | `type`, `reason`   |

## Inquiry Funnel

| Event                   | Trigger                              | Required Context      |
| ----------------------- | ------------------------------------ | --------------------- |
| `listing_list_viewed`   | Listings browse page loads           | `search`              |
| `listing_detail_viewed` | Listing detail page loads            | `listingId`, `type`   |
| `inquiry_cta_clicked`   | Inquiry form submit action triggered | `listingId`           |
| `inquiry_submitted`     | Inquiry persisted successfully       | `listingId`           |
| `inquiry_submit_failed` | Inquiry persistence failed           | `listingId`, `reason` |

## KPI Mapping (Phase 0 Baseline)

| KPI                          | Event Logic                                    |
| ---------------------------- | ---------------------------------------------- |
| Listing activation rate      | `listing_create_succeeded / sign_up_succeeded` |
| Search-to-detail CTR         | `listing_detail_viewed / listing_list_viewed`  |
| Detail-to-inquiry conversion | `inquiry_submitted / listing_detail_viewed`    |
