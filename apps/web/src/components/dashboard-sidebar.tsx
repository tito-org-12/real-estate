"use client";
import { LayoutDashboard, ListPlus, LogOut, User } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userName: string;
  hasProSubscription: boolean;
}

const NAVIGATION_ITEMS = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/listings", label: "Browse Rentals", icon: LayoutDashboard },
    ],
  },
  {
    title: "Actions",
    items: [
      { href: "/listings/create", label: "Create Listing", icon: ListPlus },
    ],
  },
];

export function DashboardSidebar({
  userName,
  hasProSubscription,
}: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <aside className='fixed top-16 left-0 flex h-[calc(100vh-4rem)] w-64 flex-col overflow-y-auto border-border/40 border-r bg-card/30'>
      {/* User Profile Section */}
      <div className='border-border/40 border-b p-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
            <User className='h-5 w-5 text-primary' />
          </div>
          <div className='min-w-0 flex-1'>
            <p className='truncate font-medium text-sm'>{userName}</p>
            <p className='text-muted-foreground text-xs'>
              {hasProSubscription ? (
                <span className='font-medium text-primary'>Pro Member</span>
              ) : (
                "Starter Plan"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-6 overflow-y-auto p-4'>
        {NAVIGATION_ITEMS.map((section) => (
          <div key={section.title}>
            <h3 className='mb-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest'>
              {section.title}
            </h3>
            <ul className='space-y-1'>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href as Route}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className='h-4 w-4 shrink-0' />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className='space-y-3 border-border/40 border-t p-4'>
        {!hasProSubscription && (
          <Button
            onClick={async () => await authClient.checkout({ slug: "pro" })}
            className='w-full'
            size='sm'
          >
            Upgrade to Pro
          </Button>
        )}
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start text-muted-foreground hover:text-foreground'
          onClick={handleSignOut}
        >
          <LogOut className='mr-2 h-4 w-4' />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
