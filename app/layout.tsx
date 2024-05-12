import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/components/fonts/fonts.css";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import { Toaster } from "@/components/ui/toaster";
import LocationFilter from "@/components/LocationFilter";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shelter",
  description: "Hotel booking Website",
  icons: { icon: "/Logo/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar />
              <LocationFilter />
              <section className="flex-grow px-4 lg:px-10">{children}</section>
              <Analytics />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
