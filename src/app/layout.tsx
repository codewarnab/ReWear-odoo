import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReWear - Sustainable Fashion Community",
  description: "Join ReWear's sustainable fashion community. Swap, donate, and discover pre-loved clothing while reducing fashion waste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} font-sans antialiased`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
