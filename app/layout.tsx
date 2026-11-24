import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Display face for headlines, the logo and big numbers; Inter stays for body text.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumira | Electric city bikes",
    template: "%s | Lumira",
  },
  description:
    "Lumira electric city bikes: a step-through frame, a quiet motor and a removable battery. Book a test ride at a store near you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
