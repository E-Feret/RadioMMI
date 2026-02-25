import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Radio MMI - La Radio Étudiante",
  description: "Écoutez Radio MMI en direct. Vie du campus, projets et actus.",
  icons: {
    icon: '/icon.ico',
  },
  metadataBase: new URL('https://radiooxygene.com'), // Placeholder, should be updated
  openGraph: {
    title: "Radio MMI",
    description: "La Radio Étudiante",
    locale: "fr_FR",
    type: "website",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";
import { AudioProvider } from "@/context/AudioContext";

import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`} suppressHydrationWarning={true}>
        <AudioProvider>
          <Navbar />
          <main className="flex-grow pb-0">
            {children}
          </main>
          <Footer />
          <RadioPlayer />
          <ScrollToTop />
        </AudioProvider>
      </body>
    </html>
  );
}
