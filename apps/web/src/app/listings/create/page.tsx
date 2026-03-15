"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateListingForm } from "@/components/create-listing-form";
import { authClient } from "@/lib/auth-client";

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading listing form...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      <CreateListingForm />
    </div>
  );
}
