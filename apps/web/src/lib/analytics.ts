export const PHASE0_EVENT_DICTIONARY = {
  sign_up_started: "User started sign-up",
  sign_up_succeeded: "User account created",
  listing_create_started: "Landlord started listing creation",
  listing_create_succeeded: "Listing published successfully",
  listing_create_failed: "Listing publish failed",
  listing_list_viewed: "Listings browse screen loaded",
  listing_detail_viewed: "Listing detail page opened",
  inquiry_cta_clicked: "User tapped inquiry action",
  inquiry_submitted: "Inquiry saved successfully",
  inquiry_submit_failed: "Inquiry submit failed",
  contact_whatsapp_clicked: "User clicked WhatsApp CTA",
  contact_call_clicked: "User clicked call CTA",
  request_details_submitted: "User submitted request details form",
} as const;

export type Phase0EventName = keyof typeof PHASE0_EVENT_DICTIONARY;

export type Phase0EventPayload = {
  event: Phase0EventName;
  timestamp: string;
  context?: Record<string, unknown>;
};

export function trackPhase0Event(
  event: Phase0EventName,
  context?: Record<string, unknown>,
) {
  const payload: Phase0EventPayload = {
    event,
    timestamp: new Date().toISOString(),
    context,
  };

  if (globalThis.window !== undefined) {
    globalThis.dispatchEvent(
      new CustomEvent("phase0_event_tracked", {
        detail: payload,
      }),
    );
  }

  console.info("[phase0_event]", payload);
  return payload;
}
