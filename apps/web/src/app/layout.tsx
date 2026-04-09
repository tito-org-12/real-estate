import type { Metadata } from "next";

import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { SiteNavbar } from "@/components/site-navbar";

const fontSerif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kigali Homes — Modern Real Estate",
  description:
    "Discover premium properties for sale and rent across Kigali. Find your place in Rwanda's most vibrant city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased`}
      >
        <Providers>
          <SiteNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
