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
};

import MainContainer from "@/components/MainContainer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 w-full min-h-screen overflow-x-hidden`}>
        <Navbar />
        <MainContainer>
          {children}
        </MainContainer>
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}
