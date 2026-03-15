"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orpc } from "@/utils/orpc";

interface InboxDashboardProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

type InquiryStatus = "new" | "responded" | "archived";

const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const ms = now.getTime() - d.getTime();
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hour < 24) return `${hour}h ago`;
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString();
};

export default function InboxDashboard({ session }: InboxDashboardProps) {
  const [activeStatus, setActiveStatus] = useState<InquiryStatus | undefined>(
    undefined
  );
  const queryClient = useQueryClient();

  const { data: inquiriesData, isLoading } = useQuery(
    orpc.inquiries.list.queryOptions({
      input: {
        status: activeStatus,
        limit: 100,
        offset: 0,
      },
    })
  );

  const updateStatusMutation = useMutation(
    orpc.inquiries.updateStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          orpc.inquiries.list.queryOptions({
            input: {
              status: activeStatus,
              limit: 100,
              offset: 0,
            },
          })
        );
        toast.success("Inquiry updated");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update inquiry");
      },
    })
  );

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            WhatsApp
          </Badge>
        );
      case "call":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Call
          </Badge>
        );
      case "form":
      default:
        return <Badge variant="secondary">Form</Badge>;
    }
  };

  const inquiries = inquiriesData?.inquiries ?? [];

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userName={session.user.name} />

      <main className="flex-1 overflow-auto ml-64">
        <div className="container max-w-6xl py-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-medium">Inquiries</h1>
            <p className="text-muted-foreground">
              Manage and respond to inquiries from renters
            </p>
          </div>

          <Tabs
            defaultValue="all"
            className="space-y-6"
            onValueChange={(value) => {
              if (value === "all") {
                setActiveStatus(undefined);
              } else {
                setActiveStatus(value as InquiryStatus);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="responded">Responded</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeStatus ?? "all"} className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading inquiries...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 rounded-lg border border-border/40 bg-card/30">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    {activeStatus === "new"
                      ? "No new inquiries yet"
                      : "No inquiries"}
                  </p>
                </div>
              ) : (
                inquiries.map((inquiry: any) => (
                  <div
                    key={inquiry.id}
                    className="rounded-lg border border-border/40 bg-card p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getChannelBadge(inquiry.channel)}
                          <h3 className="font-medium text-sm">
                            {inquiry.listingTitle}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          {inquiry.name && (
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Name
                              </p>
                              <p className="font-medium">{inquiry.name}</p>
                            </div>
                          )}
                          {inquiry.email && (
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Email
                              </p>
                              <p className="font-medium">{inquiry.email}</p>
                            </div>
                          )}
                          {inquiry.phone && (
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Phone
                              </p>
                              <p className="font-medium">{inquiry.phone}</p>
                            </div>
                          )}
                        </div>

                        {inquiry.message && (
                          <div className="mb-3">
                            <p className="text-muted-foreground text-xs mb-1">
                              Message
                            </p>
                            <p className="text-sm line-clamp-2">
                              {inquiry.message}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Received {formatRelativeTime(inquiry.createdAt)}
                          </span>
                          {inquiry.respondedAt && (
                            <span>
                              • Responded{" "}
                              {formatRelativeTime(inquiry.respondedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {inquiry.status !== "responded" && (
                          <Button
                            size="sm"
                            variant={
                              inquiry.status === "responded"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateStatusMutation.mutate({
                                inquiryId: inquiry.id,
                                status: "responded",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Mark Responded
                          </Button>
                        )}
                        {inquiry.status !== "archived" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                inquiryId: inquiry.id,
                                status: "archived",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <Archive className="mr-1 h-4 w-4" />
                            Archive
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
