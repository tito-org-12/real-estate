import { MoveRight } from "lucide-react";
import Link from "next/link";

const FEATURED_PROPERTIES = [
	{
		id: "1",
		title: "The Glass Pavilion",
		location: "Montecito, California",
		price: "$12,500,000",
		image:
			"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
		type: "Residence",
	},
	{
		id: "2",
		title: "Nordic Lake House",
		location: "Stockholm, Sweden",
		price: "$4,200,000",
		image:
			"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
		type: "Retreat",
	},
	{
		id: "3",
		title: "Urban Penthouse",
		location: "New York, NY",
		price: "$8,950,000",
		image:
			"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
		type: "Apartment",
	},
];

export function FeaturedSection() {
	return (
		<section className="bg-secondary/30 py-24">
			<div className="container mx-auto max-w-[1400px] px-4 md:px-6">
				<div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
					<div className="space-y-4">
						<h2 className="font-serif text-4xl text-foreground md:text-5xl lg:text-6xl">
							Curated Selections
						</h2>
						<p className="max-w-sm text-muted-foreground">
							Hand-picked properties for the discerning collector.
						</p>
					</div>
					<Link
						href="/listings"
						className="group flex items-center font-medium text-primary transition-colors hover:text-primary/80"
					>
						View all properties
						<MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
					{FEATURED_PROPERTIES.map((property, _idx) => (
						<div
							key={property.id}
							className="group flex cursor-pointer flex-col gap-3"
						>
							<div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-muted shadow-sm">
								<img
									src={property.image}
									alt={property.title}
									className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
								<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />

								<div className="absolute top-3 right-3">
									<div className="rounded-sm bg-background/95 px-2.5 py-0.5 font-semibold text-[10px] text-foreground uppercase tracking-widest shadow-sm backdrop-blur-sm">
										{property.type}
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex flex-col">
									<span className="mb-1 font-semibold text-primary text-xs uppercase tracking-widest">
										{property.location}
									</span>
									<h3 className="font-medium font-serif text-3xl text-foreground transition-colors duration-300 group-hover:text-primary">
										{property.title}
									</h3>
								</div>
								<div className="h-px w-full bg-border/60 transition-colors duration-500 group-hover:bg-primary/30" />
								<div className="flex items-center justify-between pt-1">
									<span className="font-medium text-lg text-muted-foreground">
										{property.price}
									</span>
									<div className="-translate-x-2 text-primary opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100">
										<MoveRight className="h-5 w-5" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-24 grid grid-cols-1 gap-0 overflow-hidden rounded-lg bg-card lg:grid-cols-2">
					<div className="relative aspect-square lg:aspect-auto">
						<img
							src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2670&auto=format&fit=crop"
							className="h-full w-full object-cover"
							alt="Interior detail"
						/>
					</div>
					<div className="flex flex-col justify-center space-y-8 p-12 md:p-24">
						<h3 className="font-serif text-4xl text-card-foreground md:text-5xl">
							Selling a lifestyle, <br /> not just a home.
						</h3>
						<p className="text-lg text-muted-foreground leading-relaxed">
							We understand that a home is more than bricks and mortar. It is a
							sanctuary, a statement, and a legacy. Trust us to present your
							property with the dignity it deserves.
						</p>
						<button className="self-start border-primary border-b pb-1 font-semibold text-primary text-xs uppercase tracking-widest transition-opacity hover:opacity-70">
							List with us
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
