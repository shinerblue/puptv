import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PupTV — Your dog's own TV show, on your TV",
  description:
    "Upload a few photos of your dog and get a cartoon adventure series that publishes straight to your YouTube channel — automatically. Dogs first, cats coming soon. Proceeds fund dog rescues.",
  keywords: ["dog tv", "pet video", "cartoon dog", "AI video", "dog charity", "youtube", "pet tv"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
