import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlashPDF",
  description: "AI Flashcards Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50"
      >
        {children}
      </body>
    </html>
  );
}
