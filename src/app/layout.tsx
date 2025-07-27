import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/shared/components/layouts/Header";
import { Playwrite_AU_QLD } from "next/font/google";
import { Toaster } from "@/shared/components/ui/sonner";
import { AuthProvider } from "@/shared/contexts/AuthContext";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="w-screen h-screen overflow-hidden">
            {/* Header */}
            <div className="absolute top-4 left-4 z-99">
              <Header font={playwrite.className} />
            </div>

            {children}
          </div>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
