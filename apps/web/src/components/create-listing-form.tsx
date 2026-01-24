"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

export function CreateListingForm() {
	const router = useRouter();
	const [assetType, setAssetType] = useState<"property" | "vehicle" | "land">(
		"property",
	);
	const [loading, setLoading] = useState(false);

	// Form State (Simple controlled inputs for MVP speed)
	const [formData, setFormData] = useState({
		title: "",
		price: "",
		description: "",
		location: "",
		imageUrl: "", // Simplified single image for MVP
		// Meta fields
		bedrooms: "",
		bathrooms: "",
		sqft: "",
		make: "",
		model: "",
		year: "",
		mileage: "",
		size: "", // Land size
	});

	const createMutation = useMutation(
		orpc.listings.create.mutationOptions({
			onSuccess: () => {
				toast.success("Listing created successfully!");
				router.push("/listings");
			},
			onError: (err) => {
				toast.error(`Failed to create listing: ${err.message}`);
				setLoading(false);
			},
		}),
	);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const _handleSelectChange = (val: string) => {
		setAssetType(val as any);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const priceInCents = Math.floor(Number.parseFloat(formData.price) * 100);
		const images = formData.imageUrl ? [formData.imageUrl] : [];

		const meta: any = {};
		if (assetType === "property") {
			meta.bedrooms = Number.parseInt(formData.bedrooms, 10);
			meta.bathrooms = Number.parseFloat(formData.bathrooms);
			meta.sqft = Number.parseInt(formData.sqft, 10);
		} else if (assetType === "vehicle") {
			meta.make = formData.make;
			meta.model = formData.model;
			meta.year = Number.parseInt(formData.year, 10);
			meta.mileage = Number.parseInt(formData.mileage, 10);
		} else if (assetType === "land") {
			meta.size = formData.size;
		}

		createMutation.mutate({
			title: formData.title,
			price: priceInCents,
			type: assetType,
			description: formData.description,
			location: formData.location,
			images: images,
			meta: meta,
		});
	};

	return (
		<Card className="mx-auto w-full max-w-3xl border-border/60 shadow-md">
			<CardHeader className="space-y-1 border-border/40 border-b pb-8 text-center">
				<CardTitle className="font-serif text-3xl">
					Create New Listing
				</CardTitle>
				<CardDescription className="font-medium text-xs uppercase tracking-widest">
					Sell your property or vehicle on the marketplace
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-8">
				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Asset Selector */}
					<div className="space-y-4">
						<Label className="block text-center font-medium text-muted-foreground text-xs uppercase tracking-widest">
							Asset Type
						</Label>
						<div className="mx-auto flex max-w-md justify-center rounded-lg bg-muted/40 p-1">
							<button
								type="button"
								onClick={() => setAssetType("property")}
								className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${assetType === "property" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
							>
								Real Estate
							</button>
							<button
								type="button"
								onClick={() => setAssetType("vehicle")}
								className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${assetType === "vehicle" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
							>
								Vehicle
							</button>
							<button
								type="button"
								onClick={() => setAssetType("land")}
								className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${assetType === "land" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
							>
								Land
							</button>
						</div>
					</div>

					<div className="space-y-6">
						<div className="space-y-4">
							<h3 className="border-border/40 border-b pb-2 font-serif text-xl">
								Basic Information
							</h3>

							<div className="space-y-2">
								<Label
									htmlFor="title"
									className="text-muted-foreground text-xs uppercase tracking-wider"
								>
									Title
								</Label>
								<Input
									id="title"
									name="title"
									placeholder="e.g. Modern Apartment in Downtown"
									required
									value={formData.title}
									onChange={handleChange}
									className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
								/>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label
										htmlFor="price"
										className="text-muted-foreground text-xs uppercase tracking-wider"
									>
										Price (USD)
									</Label>
									<Input
										id="price"
										name="price"
										type="number"
										placeholder="500000"
										required
										value={formData.price}
										onChange={handleChange}
										className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="location"
										className="text-muted-foreground text-xs uppercase tracking-wider"
									>
										Location
									</Label>
									<Input
										id="location"
										name="location"
										placeholder="City, State"
										value={formData.location}
										onChange={handleChange}
										className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="imageUrl"
									className="text-muted-foreground text-xs uppercase tracking-wider"
								>
									Image URL
								</Label>
								<Input
									id="imageUrl"
									name="imageUrl"
									placeholder="https://..."
									value={formData.imageUrl}
									onChange={handleChange}
									className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="description"
									className="text-muted-foreground text-xs uppercase tracking-wider"
								>
									Description
								</Label>
								<Textarea
									id="description"
									name="description"
									placeholder="Describe the distinctive features..."
									rows={4}
									value={formData.description}
									onChange={handleChange}
									className="min-h-[100px] resize-y border-border/60 bg-muted/20 focus:border-primary/50"
								/>
							</div>
						</div>

						{/* Dynamic Fields - Real Estate */}
						{assetType === "property" && (
							<div className="animate-fade-in space-y-4">
								<h3 className="border-border/40 border-b pb-2 font-serif text-xl">
									Property Details
								</h3>
								<div className="grid grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label
											htmlFor="bedrooms"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Bedrooms
										</Label>
										<Input
											id="bedrooms"
											name="bedrooms"
											type="number"
											value={formData.bedrooms}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="bathrooms"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Bathrooms
										</Label>
										<Input
											id="bathrooms"
											name="bathrooms"
											type="number"
											step="0.5"
											value={formData.bathrooms}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="sqft"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Square Feet
										</Label>
										<Input
											id="sqft"
											name="sqft"
											type="number"
											value={formData.sqft}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Dynamic Fields - Vehicle */}
						{assetType === "vehicle" && (
							<div className="animate-fade-in space-y-4">
								<h3 className="border-border/40 border-b pb-2 font-serif text-xl">
									Vehicle Details
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label
											htmlFor="make"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Make
										</Label>
										<Input
											id="make"
											name="make"
											placeholder="e.g. Porsche"
											value={formData.make}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="model"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Model
										</Label>
										<Input
											id="model"
											name="model"
											placeholder="e.g. 911 GT3"
											value={formData.model}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="year"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Year
										</Label>
										<Input
											id="year"
											name="year"
											type="number"
											value={formData.year}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="mileage"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Mileage
										</Label>
										<Input
											id="mileage"
											name="mileage"
											type="number"
											value={formData.mileage}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Dynamic Fields - Land */}
						{assetType === "land" && (
							<div className="animate-fade-in space-y-4">
								<h3 className="border-border/40 border-b pb-2 font-serif text-xl">
									Land Details
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label
											htmlFor="size"
											className="text-muted-foreground text-xs uppercase tracking-wider"
										>
											Size (Acres)
										</Label>
										<Input
											id="size"
											name="size"
											placeholder="0.5"
											value={formData.size}
											onChange={handleChange}
											className="h-10 border-border/60 bg-muted/20 focus:border-primary/50"
										/>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="pt-4">
						<Button
							type="submit"
							className="h-11 w-full font-semibold text-xs uppercase tracking-widest"
							disabled={loading || createMutation.isPending}
						>
							{createMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Publish Listing
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
