import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { SidenavWrapper } from "@/components/ui/sidenav-wrapper";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KRC20 NFT Generator",
  description: "Générez des NFTs uniques avec votre adresse Kaspa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClerkProvider>
          <div className="flex min-h-screen bg-[#1A202C]">
            <SidenavWrapper />
            <main className="flex-1 lg:ml-72 min-h-screen">
              {children}
            </main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
