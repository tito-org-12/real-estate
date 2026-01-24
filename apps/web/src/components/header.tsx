"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const pathname = usePathname();

	const links = [
		{ to: "/", label: "Home" },
		{ to: "/listings", label: "Properties" },
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/listings/create", label: "Sell" },
	] as const;

	return (
		<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
				{/* Logo Area */}
				<Link href="/" className="mr-6 flex items-center space-x-2">
					<span className="font-bold font-serif text-2xl text-foreground tracking-tight">
						ESTATE
					</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden flex-1 items-center justify-center gap-8 font-medium text-sm md:flex">
					{links.map(({ to, label }) => (
						<Link
							key={to}
							href={to}
							className={cn(
								"group relative transition-colors hover:text-primary",
								pathname === to ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{label}
							<span
								className={cn(
									"absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 ease-out",
									pathname === to ? "w-full" : "w-0 group-hover:w-full",
								)}
							/>
						</Link>
					))}
				</nav>

				{/* Right Actions */}
				<div className="flex items-center gap-4">
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
		</header>
	);
}
