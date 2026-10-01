import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "COSMO — Contemporary Apparatus & Archival Curation",
  description: "Curated Apple hardware presented as architectural sculpture. Contemporary flagships and iconic archival relics.",
  icons: {
    icon: "/brand/cosmo-logo.svg",
    apple: "/brand/cosmo-logo.svg",
  },
};

import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { CatalogProvider } from "../context/CatalogContext";
import { DiscountProvider } from "../context/DiscountContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body 
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#FAF8F5] text-[#161514] selection:bg-[#161514] selection:text-[#FAF8F5]"
      >
        <CatalogProvider>
          <AuthProvider>
            <DiscountProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </DiscountProvider>
          </AuthProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
