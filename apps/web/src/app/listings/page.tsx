"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { orpc } from "@/utils/orpc";

export default function ListingsPage() {
	const searchParams = useSearchParams();
	const initialSearch = searchParams.get("search") ?? "";
	const [search, setSearch] = useState(initialSearch);

	// Sync search state when URL param changes
	useEffect(() => {
		const urlSearch = searchParams.get("search") ?? "";
		setSearch(urlSearch);
	}, [searchParams]);
	const [type, setType] = useState<string | undefined>("all");
	const [priceRange, setPriceRange] = useState([0, 10000000]); // 0 to 100k+

	const { data: listings, isLoading } = useQuery(
		orpc.listings.list.queryOptions({
			input: {
				type: type === "all" ? undefined : (type as any),
			},
			// Search is client-side filtered for MVP or could be added to API later
		}),
	);

	const filteredListings = listings?.filter((l: any) => {
		const searchLower = search.toLowerCase();
		const matchesSearch =
			l.title.toLowerCase().includes(searchLower) ||
			l.location?.toLowerCase().includes(searchLower);
		const matchesPrice =
			l.price >= priceRange[0] * 100 && // Convert input to cents
			l.price <= priceRange[1] * 100;
		return matchesSearch && matchesPrice;
	});

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="relative flex h-[40vh] min-h-[400px] w-full items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<img
						src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop"
						alt="Luxury Home"
						className="h-full w-full object-cover opacity-90"
					/>
					<div className="absolute inset-0 bg-black/40" />
				</div>

				<div className="relative z-10 w-full max-w-4xl animate-fade-up space-y-8 px-4 text-center">
					<div className="space-y-4">
						<h1 className="font-medium font-serif text-5xl text-white tracking-tight drop-shadow-sm md:text-6xl lg:text-7xl">
							Find Your Dream Asset
						</h1>
						<p className="font-light text-lg text-white/80 tracking-wide md:text-xl">
							Explore an exclusive collection of properties, vehicles, and land.
						</p>
					</div>

					<div className="relative mx-auto max-w-2xl">
						<div className="flex items-center rounded-full border border-white/20 bg-background/95 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
							<Search className="ml-4 h-5 w-5 text-muted-foreground" />
							<Input
								className="h-12 border-0 bg-transparent text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
								placeholder="Search by title, location, or keyword..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button
								size="icon"
								className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Search className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-12 md:flex-row md:px-6">
				{/* Sidebar Filters */}
				<aside className="w-full shrink-0 space-y-10 pr-4 md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:w-72 md:overflow-y-auto">
					<div>
						<div className="mb-6 flex items-center justify-between">
							<h3 className="font-serif text-2xl text-foreground">Refine</h3>
							<button className="text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-primary">
								Clear all
							</button>
						</div>

						<div className="space-y-8">
							<div className="space-y-3">
								<Label className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
									Category
								</Label>
								<Select
									value={type}
									onValueChange={(val) => setType(val ?? undefined)}
								>
									<SelectTrigger className="h-11 border-border/60 bg-background transition-colors focus:border-primary/50 focus:ring-0">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										<SelectItem value="property">Real Estate</SelectItem>
										<SelectItem value="vehicle">Vehicles</SelectItem>
										<SelectItem value="land">Land</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
										Price Range
									</Label>
									<span className="font-mono text-primary text-xs">
										${priceRange[0].toLocaleString()} — $
										{priceRange[1].toLocaleString()}+
									</span>
								</div>
								<Slider
									min={0}
									max={10000000}
									step={50000}
									value={priceRange}
									onValueChange={(val) => setPriceRange(val as number[])}
									className="py-4"
								/>
							</div>
						</div>
					</div>
				</aside>

				{/* Listings Grid */}
				<main className="flex-1">
					{isLoading ? (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-64 animate-pulse rounded-lg bg-muted"
								/>
							))}
						</div>
					) : filteredListings?.length === 0 ? (
						<div className="py-20 text-center text-muted-foreground">
							No listings found matching your criteria.
						</div>
					) : (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredListings?.map((listing: any) => (
								<ListingCard
									key={listing.id}
									id={listing.id}
									title={listing.title}
									price={listing.price}
									type={listing.type}
									location={listing.location}
									images={listing.images}
									meta={listing.meta}
								/>
							))}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
