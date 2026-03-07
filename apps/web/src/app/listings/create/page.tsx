import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateListingForm } from "@/components/create-listing-form";
import { authClient } from "@/lib/auth-client";

export default async function CreateListingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      <CreateListingForm />
    </div>
  );
}
