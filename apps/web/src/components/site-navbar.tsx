"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Properties" },
  { href: "/advertisers", label: "About" },
  { href: "/listings?type=services", label: "Services" },
  { href: "/dashboard", label: "Agents" },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const headerClassName = isHomePage
    ? "absolute top-0 left-0 right-0 z-50 w-full bg-transparent"
    : "sticky top-0 z-50 w-full border-b border-white/10 bg-[#343a4c]/75 backdrop-blur-md";

  return (
    <header className={headerClassName}>
      <div className='mx-auto flex h-18 max-w-350 items-center justify-between gap-4 px-4 md:px-6 lg:px-10'>
        <Link href='/' className='flex shrink-0 items-center gap-2 text-white'>
          <span className='flex h-9 w-9 items-center justify-center rounded-md border border-white/70 text-white'>
            <svg
              width='22'
              height='22'
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
          </span>
          <span className='font-serif text-xl font-semibold tracking-wide'>
            Kigali Home
          </span>
        </Link>

        <nav
          aria-label='Main navigation'
          className='hidden items-center rounded-full border border-white/18 bg-white/18 px-2 py-1.5 backdrop-blur-sm md:flex'
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-white/70 hover:text-white",
                )}
              >
                {isActive ? (
                  <span
                    className='h-2 w-2 rounded-full bg-white'
                    aria-hidden='true'
                  />
                ) : null}
                {label}
              </Link>
            );
          })}
        </nav>

        <div className='flex shrink-0 items-center gap-3'>
          <Link
            href='/login'
            className='inline-flex h-12 items-center justify-center rounded-sm bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/90'
          >
            Sign In
          </Link>
          <Link
            href='/listings'
            className='hidden items-center gap-2 rounded-full bg-[#e7a66f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#dc965f] sm:inline-flex'
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
