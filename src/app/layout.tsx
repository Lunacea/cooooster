import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientHeader } from "@/shared/components/layouts/ClientHeader";
import { Playwrite_AU_QLD } from "next/font/google";
import { Toaster } from "@/shared/components/ui/sonner";
import { ClientAuthProvider } from "@/shared/components/providers/ClientAuthProvider";

const playwrite = Playwrite_AU_QLD({
  weight: ['400'],
  variable: '--font-playwrite',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coooster",
  description: "Let's collect the coastline!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientAuthProvider>
          <div className="w-screen h-screen overflow-hidden bg-gradient-to-t from-bice-blue-800 to-bice-blue-900 z-0">
            {/* Header */}
            <div className="absolute top-4 left-4 z-99">
              <ClientHeader font={playwrite.className} />
            </div>

            {children}
          </div>
        </ClientAuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
