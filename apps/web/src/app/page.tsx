"use client";

import { FeaturedSection } from "@/components/landing/featured-section";
import { Hero } from "@/components/landing/hero";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col">
			<Hero />
			<FeaturedSection />
		</main>
	);
}
