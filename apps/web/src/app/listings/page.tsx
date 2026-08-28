import { Suspense } from "react";

import { ListingsBrowser } from "@/components/listings/listings-browser";

export default function ListingsPage() {
  return (
    <Suspense fallback={null}>
      <ListingsBrowser />
    </Suspense>
  );
}
