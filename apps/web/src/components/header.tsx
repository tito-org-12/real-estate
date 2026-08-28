"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import UserMenu from "./user-menu";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Properties" },
  { to: "/advertisers", label: "About" },
  { to: "/listings?type=services", label: "Services" },
  { to: "/dashboard", label: "Agents" },
] as const;

interface HeaderProps {
  /** When true, renders as an absolute overlay on a full-bleed hero image */
  overlay?: boolean;
}

export default function Header({ overlay = false }: Readonly<HeaderProps>) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "z-50 w-full",
        overlay
          ? "absolute top-0 left-0 right-0"
          : "sticky top-0 border-b border-border/60 bg-background/90 backdrop-blur-md",
      )}
    >
      <div className='mx-auto flex h-18 max-w-350 items-center justify-between px-6 md:px-10'>
        {/* ── Logo ── */}
        <Link href='/' className='flex items-center gap-2.5'>
          {/* house icon */}
          <svg
            width='28'
            height='28'
            viewBox='0 0 28 28'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M4 12L14 3L24 12V25H18V18H10V25H4V12Z'
              stroke='white'
              strokeWidth='1.8'
              strokeLinejoin='round'
              fill='none'
            />
            <path
              d='M14 3L24 12'
              stroke='white'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
          </svg>
          <span className='font-serif text-xl font-semibold tracking-wide text-white'>
            Kigali Home
          </span>
        </Link>

        {/* ── Pill Nav ── */}
        <nav
          aria-label='Main navigation'
          className='hidden items-center rounded-full border border-white/20 bg-white/15 px-2 py-1.5 backdrop-blur-sm md:flex'
        >
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                href={to}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-white/70 hover:text-white",
                )}
              >
                {isActive && (
                  <span
                    className='h-1.5 w-1.5 rounded-full bg-white'
                    aria-hidden='true'
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right actions ── */}
        <div className='flex items-center gap-3'>
          <UserMenu />
          <Link
            href='/listings'
            className='hidden items-center gap-1.5 rounded-full bg-[#e8a87c] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d4956a] sm:flex'
          >
            Book Now
            <svg
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path
                d='M2 7H12M7 2L12 7L7 12'
                stroke='white'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
