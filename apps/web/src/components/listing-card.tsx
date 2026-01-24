import { BedDouble, Car, Home, MapPin } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ListingCardProps {
	id: string;
	title: string;
	price: number;
	type: "property" | "vehicle" | "land";
	location?: string | null;
	images: string[];
	meta: Record<string, any>;
}

export function ListingCard({
	id,
	title,
	price,
	type,
	location,
	images,
	meta,
}: ListingCardProps) {
	const coverImage = images[0] || "https://placehold.co/600x400?text=No+Image";

	return (
		<Link href={`/listings/${id}`} className="group block h-full">
			<div className="flex h-full flex-col overflow-hidden rounded-sm border border-border/40 bg-card transition-all duration-300 hover:border-border/80 hover:shadow-lg">
				{/* Image Container */}
				<div className="relative aspect-[3/2] overflow-hidden bg-muted">
					<img
						src={coverImage}
						alt={title}
						className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-30 transition-opacity group-hover:opacity-20" />

					<div className="absolute inset-x-3 top-3 flex items-start justify-between">
						<div className="rounded-sm bg-background/90 px-2.5 py-1 font-semibold text-[10px] text-foreground uppercase tracking-widest shadow-sm backdrop-blur-sm">
							{type}
						</div>
						{meta.year && type === "vehicle" && (
							<div className="rounded-sm border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
								{meta.year}
							</div>
						)}
					</div>
				</div>

				{/* Content */}
				<div className="flex flex-grow flex-col space-y-4 p-5">
					<div className="space-y-1">
						<div className="flex items-baseline justify-between gap-2">
							<h3 className="line-clamp-1 font-medium font-serif text-foreground text-xl transition-colors group-hover:text-primary">
								{title}
							</h3>
							<span className="shrink-0 font-semibold text-primary">
								{formatCurrency(price / 100)}
							</span>
						</div>

						{location && (
							<div className="flex items-center text-muted-foreground text-xs uppercase tracking-wider">
								<MapPin className="mr-1 h-3.5 w-3.5" />
								<span className="line-clamp-1">{location}</span>
							</div>
						)}
					</div>

					<div className="h-px w-full bg-border/40" />

					<div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground text-xs">
						{type === "property" && (
							<>
								{meta.bedrooms && (
									<div className="flex items-center">
										<BedDouble className="mr-1.5 h-3.5 w-3.5 opacity-70" />
										<span>{meta.bedrooms} Beds</span>
									</div>
								)}
								{meta.sqft && (
									<div className="flex items-center">
										<Home className="mr-1.5 h-3.5 w-3.5 opacity-70" />
										<span>{meta.sqft} sqft</span>
									</div>
								)}
							</>
						)}
						{type === "vehicle" && meta.mileage && (
							<div className="flex items-center">
								<Car className="mr-1.5 h-3.5 w-3.5 opacity-70" />
								<span>{Number(meta.mileage).toLocaleString()} mi</span>
							</div>
						)}
						{type === "land" && meta.size && (
							<div className="flex items-center">
								<MapPin className="mr-1.5 h-3.5 w-3.5 opacity-70" />
								<span>{meta.size} Acres</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}
