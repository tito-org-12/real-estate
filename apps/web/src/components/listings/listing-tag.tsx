import { type ReactNode } from "react";

export function ListingTag({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className='rounded-full bg-[#eaf0ff] px-3 py-1 text-[11px] font-medium text-[#4d5fc7]'>
      {children}
    </span>
  );
}
