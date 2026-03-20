"use client";
import { Globe, Heart, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const pathname = usePathname();
  const [marketSelection, setMarketSelection] = useState("en-rw-rwf");

  const links = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Properties" },
    { to: "/advertisers", label: "Advertisers" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/listings/create", label: "Sell" },
  ] as const;

  return (
    <header className='sticky top-0 z-50 w-full border-border/40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6'>
        {/* Logo Area */}
        <Link href='/' className='mr-6 flex items-center space-x-2'>
          <span className='font-bold font-serif text-2xl text-foreground tracking-tight'>
            KIGALI HOME
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden flex-1 items-center justify-center gap-8 font-medium text-sm md:flex'>
          {links.map(({ to, label }) => (
            <a
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
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className='flex items-center gap-2'>
          <div className='hidden lg:block'>
            <Select
              value={marketSelection}
              onValueChange={(value) => {
                if (value) setMarketSelection(value);
              }}
            >
              <SelectTrigger className='h-9 min-w-[210px] border-[#0f2d62]/20 bg-white text-[#0f2d62]'>
                <Globe className='mr-2 h-4 w-4 text-[#12b76a]' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='en-rw-rwf'>
                  English / Rwanda / RWF
                </SelectItem>
                <SelectItem value='rw-rw-rwf'>
                  Kinyarwanda / Rwanda / RWF
                </SelectItem>
                <SelectItem value='fr-rw-rwf'>French / Rwanda / RWF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link
            href='/listings'
            aria-label='Search listings'
            className='inline-flex h-9 w-9 items-center justify-center rounded-md text-[#0f2d62] transition-colors hover:bg-[#0f2d62]/5'
          >
            <Search className='h-4 w-4' />
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='hidden text-[#0f2d62] hover:bg-[#0f2d62]/5 sm:inline-flex'
            aria-label='Saved properties'
          >
            <Heart className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='hidden text-[#0f2d62] hover:bg-[#0f2d62]/5 sm:inline-flex'
            aria-label='Messages'
          >
            <MessageCircle className='h-4 w-4' />
          </Button>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
