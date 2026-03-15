import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  try {
    console.log("[Dashboard] Page loading...");

    const session = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
        throw: true,
      },
    });

    console.log("[Dashboard] Session retrieved:", session?.user?.id);

    if (!session?.user) {
      console.log("[Dashboard] No user in session, redirecting to login");
      redirect("/login");
    }

    console.log("[Dashboard] Rendering with user:", session.user.id);
    return <Dashboard session={session} />;
  } catch (error) {
    console.error("[Dashboard] Error:", error);
    throw error;
  }
}
