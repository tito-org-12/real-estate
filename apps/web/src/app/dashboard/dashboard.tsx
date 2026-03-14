"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Eye,
  LayoutDashboard,
  Package,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const privateData = useQuery(orpc.privateData.queryOptions());
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);

  const myListingsQuery = useQuery(
    orpc.listings.mine.queryOptions({
      input: {},
    }),
  );

  const listings = myListingsQuery.data ?? [];

  const bulkStatusMutation = useMutation(
    orpc.listings.bulkUpdateStatus.mutationOptions({
      onSuccess: (result) => {
        toast.success(`Updated ${result.updatedCount} listing(s).`);
        setSelectedListingIds([]);
        queryClient.invalidateQueries({
          queryKey: orpc.listings.mine.queryKey({ input: {} }),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Bulk update failed.");
      },
    }),
  );

  const revalidateMutation = useMutation(
    orpc.listings.revalidate.mutationOptions({
      onSuccess: () => {
        toast.success("Listing revalidated.");
        queryClient.invalidateQueries({
          queryKey: orpc.listings.mine.queryKey({ input: {} }),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Revalidation failed.");
      },
    }),
  );

  const stats = useMemo(() => {
    const activeListings = listings.filter(
      (item) => item.status === "published",
    ).length;
    const staleListings = listings.filter((item) => item.trust.isStale).length;
    const verifiedListings = listings.filter(
      (item) => item.trust.verificationStatus === "verified",
    ).length;

    return [
      {
        label: "Active Listings",
        value: String(activeListings),
        icon: Package,
      },
      {
        label: "Verified Listings",
        value: String(verifiedListings),
        icon: Eye,
      },
      {
        label: "Stale Listings",
        value: String(staleListings),
        icon: TrendingUp,
      },
    ];
  }, [listings]);

  const toggleListingSelection = (listingId: string) => {
    setSelectedListingIds((current) =>
      current.includes(listingId)
        ? current.filter((id) => id !== listingId)
        : [...current, listingId],
    );
  };

  const runBulkStatusUpdate = (status: "draft" | "published" | "rented") => {
    if (!selectedListingIds.length) {
      toast.info("Select at least one listing first.");
      return;
    }

    bulkStatusMutation.mutate({
      listingIds: selectedListingIds,
      status,
    });
  };

  return (
    <div className='flex min-h-[calc(100vh-4rem)]'>
      {/* Sidebar */}
      <DashboardSidebar userName={session.user.name || "User"} />

      {/* Main Content */}
      <main className='ml-64 flex-1 bg-background'>
        <div className='max-w-[1200px] p-8'>
          {/* Page Header */}
          <div className='mb-8'>
            <h1 className='mb-2 font-serif text-3xl text-foreground md:text-4xl'>
              Welcome back, {session.user.name?.split(" ")[0] || "User"}
            </h1>
            <p className='text-muted-foreground'>
              Here's an overview of your rental account.
            </p>
          </div>

          {/* Stats Grid */}
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className='rounded-xl border border-border/40 bg-card p-6 shadow-sm transition-shadow hover:shadow-md'
                >
                  <div className='mb-4 flex items-center justify-between'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                  </div>
                  <p className='mb-1 font-medium font-serif text-3xl text-foreground'>
                    {stat.value}
                  </p>
                  <p className='text-muted-foreground text-sm'>{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Status */}
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Main Content Area */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Empty State */}
              <div className='rounded-xl border border-dashed bg-card/50 p-8 text-center'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                  <LayoutDashboard className='h-6 w-6 text-muted-foreground' />
                </div>
                <h3 className='mb-2 font-medium text-lg'>No Active Listings</h3>
                <p className='mx-auto mb-6 max-w-sm text-muted-foreground'>
                  You haven't published any rental homes yet. Start by creating
                  a listing.
                </p>
                <Link href='/listings/create'>
                  <Button>Create Your First Listing</Button>
                </Link>
              </div>

              {listings.length > 0 && (
                <div className='rounded-xl border bg-card p-6 shadow-sm'>
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='font-serif text-lg'>Manage Listings</h3>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => runBulkStatusUpdate("published")}
                        disabled={bulkStatusMutation.isPending}
                      >
                        Publish
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => runBulkStatusUpdate("draft")}
                        disabled={bulkStatusMutation.isPending}
                      >
                        Move to Draft
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => runBulkStatusUpdate("rented")}
                        disabled={bulkStatusMutation.isPending}
                      >
                        Mark Rented
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className='flex flex-wrap items-center gap-3 rounded-lg border border-border/40 px-3 py-2'
                      >
                        <input
                          type='checkbox'
                          checked={selectedListingIds.includes(listing.id)}
                          onChange={() => toggleListingSelection(listing.id)}
                        />
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-medium text-sm'>
                            {listing.title}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            Status: {listing.status} · Verification:{" "}
                            {listing.trust.verificationStatus}
                            {listing.trust.isStale ? " · stale" : ""}
                          </p>
                        </div>
                        {listing.trust.isStale && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              revalidateMutation.mutate({
                                listingId: listing.id,
                              })
                            }
                            disabled={revalidateMutation.isPending}
                          >
                            <RefreshCcw className='mr-1 h-3.5 w-3.5' />
                            Revalidate
                          </Button>
                        )}
                        <Link href={`/listings/${listing.id}`}>
                          <Button variant='ghost' size='sm'>
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className='space-y-6'>
              <div className='rounded-xl border bg-card p-6 shadow-sm'>
                <h3 className='mb-4 font-serif text-lg'>Account Status</h3>
                <div className='space-y-4 text-sm'>
                  <div className='flex justify-between border-border/40 border-b pb-3'>
                    <span className='text-muted-foreground'>Access</span>
                    <span className='font-medium'>Free</span>
                  </div>
                  <div className='flex justify-between border-border/40 border-b pb-3'>
                    <span className='text-muted-foreground'>API Status</span>
                    <span className='font-medium text-green-600'>
                      {privateData.data?.message ? "Active" : "Connecting..."}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Member Since</span>
                    <span className='font-medium'>Jan 2026</span>
                  </div>
                </div>
              </div>

              <div className='rounded-xl border border-primary/10 bg-primary/5 p-6'>
                <h3 className='mb-2 font-serif text-lg text-primary'>
                  Pro Tip
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  High-quality photos and complete home details improve inquiry
                  conversion significantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
