"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye, LayoutDashboard, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export default function Dashboard({
	customerState,
	session,
}: {
	customerState: ReturnType<typeof authClient.customer.state>;
	session: typeof authClient.$Infer.Session;
}) {
	const privateData = useQuery(orpc.privateData.queryOptions());
	const hasProSubscription = customerState?.activeSubscriptions?.length! > 0;

	const stats = [
		{
			label: "Active Listings",
			value: "0",
			icon: Package,
			change: null,
		},
		{
			label: "Total Views",
			value: "0",
			icon: Eye,
			change: null,
		},
		{
			label: "Inquiries",
			value: "0",
			icon: TrendingUp,
			change: null,
		},
	];

	return (
		<div className="flex min-h-[calc(100vh-4rem)]">
			{/* Sidebar */}
			<DashboardSidebar
				userName={session.user.name || "Seller"}
				hasProSubscription={hasProSubscription}
			/>

			{/* Main Content */}
			<main className="ml-64 flex-1 bg-background">
				<div className="max-w-[1200px] p-8">
					{/* Page Header */}
					<div className="mb-8">
						<h1 className="mb-2 font-serif text-3xl text-foreground md:text-4xl">
							Welcome back, {session.user.name?.split(" ")[0] || "Seller"}
						</h1>
						<p className="text-muted-foreground">
							Here's an overview of your seller account.
						</p>
					</div>

					{/* Stats Grid */}
					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
						{stats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									key={stat.label}
									className="rounded-xl border border-border/40 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
								>
									<div className="mb-4 flex items-center justify-between">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<Icon className="h-5 w-5 text-primary" />
										</div>
									</div>
									<p className="mb-1 font-medium font-serif text-3xl text-foreground">
										{stat.value}
									</p>
									<p className="text-muted-foreground text-sm">{stat.label}</p>
								</div>
							);
						})}
					</div>

					{/* Quick Actions & Status */}
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Main Content Area */}
						<div className="space-y-6 lg:col-span-2">
							{/* Empty State */}
							<div className="rounded-xl border border-dashed bg-card/50 p-8 text-center">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
									<LayoutDashboard className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="mb-2 font-medium text-lg">No Active Listings</h3>
								<p className="mx-auto mb-6 max-w-sm text-muted-foreground">
									You haven't posted any properties or vehicles yet. Start
									selling by creating a new listing.
								</p>
								<Link href="/listings/create">
									<Button>Create Your First Listing</Button>
								</Link>
							</div>
						</div>

						{/* Sidebar Stats */}
						<div className="space-y-6">
							<div className="rounded-xl border bg-card p-6 shadow-sm">
								<h3 className="mb-4 font-serif text-lg">Account Status</h3>
								<div className="space-y-4 text-sm">
									<div className="flex justify-between border-border/40 border-b pb-3">
										<span className="text-muted-foreground">Plan</span>
										<span className="font-medium">
											{hasProSubscription ? (
												<span className="text-primary">Pro Member</span>
											) : (
												"Standard"
											)}
										</span>
									</div>
									<div className="flex justify-between border-border/40 border-b pb-3">
										<span className="text-muted-foreground">API Status</span>
										<span className="font-medium text-green-600">
											{privateData.data?.message ? "Active" : "Connecting..."}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Member Since</span>
										<span className="font-medium">Jan 2026</span>
									</div>
								</div>
							</div>

							{hasProSubscription && (
								<Button
									onClick={async () => await authClient.customer.portal()}
									variant="outline"
									className="w-full"
								>
									Manage Subscription
								</Button>
							)}

							<div className="rounded-xl border border-primary/10 bg-primary/5 p-6">
								<h3 className="mb-2 font-serif text-lg text-primary">
									Pro Tip
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									High-quality images increase engagement by up to 40%. Ensure
									your property photos are well-lit and high-resolution.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
