import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth, isAuthConfigured } from "@/lib/auth";
import AuthProvider, { type AuthState } from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// NOTE: the GitHub repo and Vercel project stay "puptv" for now (URLs remain
// puptv.vercel.app) — only the product-facing brand changed to ToonTails.
// Future home: toontails.tv.
export const metadata: Metadata = {
  title: "ToonTails — Your dog's own TV show, on your TV",
  description:
    "Upload a few photos of your dog and get a cartoon adventure series that publishes straight to your YouTube channel — automatically. Dogs first, cats coming soon. $1 from every episode or portrait pack goes to dog rescues.",
  keywords: ["dog tv", "pet video", "cartoon dog", "AI video", "dog charity", "youtube", "pet tv", "toontails"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Auth.js is never invoked when unconfigured — no secret means no session
  // lookup, no cookie parsing, nothing. The app is byte-for-byte what it
  // was before auth existed, which matters because production has no auth
  // env vars set yet.
  const configured = isAuthConfigured();
  const session = configured ? await auth() : null;
  const authState: AuthState = {
    configured,
    user: session?.user
      ? {
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }
      : null,
  };

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider value={authState}>{children}</AuthProvider>
      </body>
    </html>
  );
}
