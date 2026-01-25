import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Zap } from "lucide-react";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: "DevPump | The LinkedIn for Solana Builders",
  description: "Showcase your work, find elite projects, and build your reputation in the Solana ecosystem—all while staying pseudonymous. Join the community of Web3 builders today.",
  keywords: ["Solana", "Web3", "Developers", "Blockchain", "DeFi", "NFT", "Smart Contracts", "Rust", "Anchor", "Crypto Jobs"],
  authors: [{ name: "DevPump" }],
  creator: "DevPump",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devpump.io",
    siteName: "DevPump",
    title: "DevPump | The LinkedIn for Solana Builders",
    description: "Showcase your work, find elite projects, and build your reputation in the Solana ecosystem—all while staying pseudonymous.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevPump - The LinkedIn for Solana Builders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPump | The LinkedIn for Solana Builders",
    description: "Showcase your work, find elite projects, and build your reputation in the Solana ecosystem.",
    creator: "@devpump",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                  DevPump
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(153,69,255,0.3)]">
                  ALPHA
                </span>
              </a>
              {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                <a href="/feed" className="text-muted-foreground hover:text-white transition-all hover:-translate-y-0.5 flex items-center gap-1.5 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  Feed
                </a>
                <a href="/teams" className="text-muted-foreground hover:text-white transition-all hover:-translate-y-0.5 flex items-center gap-1.5 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Teams
                </a>
                <a href="/messages" className="text-muted-foreground hover:text-white transition-all hover:-translate-y-0.5 flex items-center gap-1.5 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Messages
                </a>
                <a href="/profile" className="text-muted-foreground hover:text-white transition-all hover:-translate-y-0.5 flex items-center gap-1.5 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile
                </a>
              </div>
              {/* Auth Buttons */}
                          <div className="flex items-center gap-4">
                <a href="/signup" className="hidden sm:inline-flex px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
                  Sign In
                </a>
                <a href="/signup" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(153,69,255,0.3)] hover:shadow-[0_0_40px_rgba(153,69,255,0.5)] transition-all duration-300 hover:-translate-y-0.5">
                  Connect Wallet
                </a>
              </div>
            </div>
          </div>
        </nav>
        {/* Main Content */}
        <main className="relative z-10 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
