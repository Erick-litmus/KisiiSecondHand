import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kisii Market | Buy & Sell Secondhand Items at Kisii Campus",
  description: "The ultimate student marketplace for Kisii University. Buy and sell textbooks, electronics, furniture, and more.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kisii Market",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import MainContainer from "@/components/MainContainer";
import SWRegistration from "@/components/SWRegistration";
import { PWAProvider } from "@/context/PWAContext";
import PWAInstructions from "@/components/PWAInstructions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 w-full min-h-screen overflow-x-hidden`}>
        <PWAProvider>
          <SWRegistration />
          <Navbar />
          <MainContainer>
            {children}
          </MainContainer>
          <PWAInstructions />
          <BottomNav />
          <Footer />
        </PWAProvider>
      </body>
    </html>
  );
}
