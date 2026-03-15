"use client";

import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileDashboardProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      whatsapp?: string | null;
    } & Record<string, any>;
  };
}

const whatsappSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{6,14}$/,
    "Enter a valid international number (e.g. +250780000000)"
  )
  .optional()
  .or(z.literal(""));

export default function ProfileDashboard({ session }: ProfileDashboardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: session.user.name,
    whatsapp: (session.user as any).whatsapp ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationResult = whatsappSchema.safeParse(formData.whatsapp);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid WhatsApp number";
      toast.error(firstError);
      return;
    }

    setIsSaving(true);

    try {
      await authClient.updateUser({
        name: formData.name,
        whatsapp: formData.whatsapp || undefined,
      } as any);

      toast.success("Profile updated successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userName={session.user.name} />

      <main className="flex-1 overflow-auto ml-64">
        <div className="container max-w-2xl py-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-medium">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-border/40 bg-card p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 h-11"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={session.user.email}
                    disabled
                    className="mt-2 h-11 bg-muted/50"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-sm font-medium">
                    WhatsApp Number (Optional)
                  </Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="+250780000000"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="mt-2 h-11"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Used for automatic fill-in on property listings
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 font-semibold"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
