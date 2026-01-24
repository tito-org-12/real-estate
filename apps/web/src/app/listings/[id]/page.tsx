"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MapPin, User } from "lucide-react";
import { use } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/utils/orpc";

export default function ListingDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	const { data: listing, isLoading } = useQuery(
		orpc.listings.get.queryOptions({ input: { id } }),
	);

	if (isLoading)
		return (
			<div className="container py-20">
				<Skeleton className="mx-auto h-96 w-full max-w-5xl rounded-lg" />
			</div>
		);
	if (!listing)
		return (
			<div className="container py-20 text-center">Listing not found.</div>
		);

	const handleLead = () => {
		// Lead routing logic here
		toast.success("Interest sent! The seller will contact you shortly.");
	};

	const coverImage =
		listing.images[0] || "https://placehold.co/1200x800?text=No+Image";

	return (
		<div className="min-h-screen bg-background pb-20">
			<div className="container mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-12">
				{/* Breadcrumb / Nav (Optional, maybe just back link later) */}

				{/* Hero Section - Contained Image */}
				<div className="group relative mb-12 aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md md:h-[60vh] md:max-h-[600px]">
					<img
						src={coverImage}
						alt={listing.title}
						className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
					<Badge className="absolute bottom-6 left-6 rounded-md border-0 bg-white/95 px-4 py-1.5 font-medium text-black text-xs uppercase tracking-wide shadow-lg backdrop-blur-md">
						{listing.type}
					</Badge>
				</div>

				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Main Content */}
					<div className="space-y-10 lg:col-span-8">
						<div className="space-y-6 border-border/40 border-b pb-10">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-3 font-medium text-muted-foreground text-sm uppercase tracking-widest">
									{listing.location && (
										<div className="flex items-center gap-1">
											<MapPin className="h-4 w-4" />
											<span className="capitalize">{listing.location}</span>
										</div>
									)}
									<span className="text-border">•</span>
									<span>
										Posted {new Date(listing.createdAt).toLocaleDateString()}
									</span>
								</div>
								<h1 className="font-medium font-serif text-5xl text-foreground capitalize leading-none md:text-6xl">
									{listing.title}
								</h1>
							</div>
						</div>

						<div className="prose max-w-none text-muted-foreground leading-relaxed">
							<h3 className="mb-6 font-medium font-serif text-3xl text-foreground">
								About this {listing.type === "vehicle" ? "vehicle" : "property"}
							</h3>
							<p className="whitespace-pre-wrap font-light text-foreground/80 text-xl leading-relaxed">
								{listing.description || "No description provided."}
							</p>
						</div>

						{/* Dynamic Attributes Grid */}
						<div className="pt-8">
							<h3 className="mb-8 font-medium font-serif text-3xl text-foreground">
								Details & Features
							</h3>
							<div className="grid grid-cols-2 gap-6 md:grid-cols-3">
								{Object.entries(listing.meta).map(([key, value]) => (
									<div
										key={key}
										className="rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-md"
									>
										<div className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-widest">
											{key.replace(/([A-Z])/g, " $1").trim()}
										</div>
										<div className="font-serif text-2xl text-foreground capitalize">
											{value?.toString()}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sticky Sidebar */}
					<div className="lg:col-span-4">
						<div className="sticky top-24 space-y-6">
							<div className="rounded-2xl border border-border/60 bg-card p-8 shadow-black/5 shadow-xl">
								<div className="mb-8 space-y-2">
									<div className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
										Asking Price
									</div>
									<div className="font-serif text-5xl text-primary">
										{(listing.price / 100).toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
											maximumFractionDigits: 0,
										})}
									</div>
								</div>

								<Button
									size="lg"
									className="h-14 w-full rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
									onClick={handleLead}
								>
									I'm Interested
								</Button>

								<div className="mt-8 flex items-center gap-4 border-border/40 border-t pt-6">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
										<User className="h-5 w-5 text-primary" />
									</div>
									<div>
										<div className="font-medium text-foreground">
											Listing Agent
										</div>
										<div className="flex items-center gap-1 text-muted-foreground text-sm">
											<CheckCircle2 className="h-3 w-3 text-green-600" />{" "}
											Verified Member
										</div>
									</div>
								</div>
							</div>

							<div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
								<h4 className="mb-2 font-serif text-primary-foreground/80 text-xl mix-blend-multiply">
									Financing Options
								</h4>
								<p className="mb-6 font-light text-muted-foreground text-sm leading-relaxed">
									Get pre-approved for a loan to secure this exclusive asset
									today. Competitive rates available.
								</p>
								<Button
									variant="link"
									className="h-auto p-0 font-medium text-primary hover:text-primary/80"
								>
									Check Rates &rarr;
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
