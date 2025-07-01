import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "FlashPDF",
  description: "AI Flashcards Generator",
};

const roboto = Roboto({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50"
      >
        {children}
      </body>
    </html>
  );
}
