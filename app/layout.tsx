import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: "DevPump | Where Transparency and Anonymity meets Clarity",
  description: "The professional network for Solana builders. Showcase your work, find elite projects, and build your reputation—all while staying pseudonymous.",
  keywords: ["Solana", "Web3", "Developers", "Blockchain", "DeFi", "NFT", "Smart Contracts", "Rust", "Anchor", "Crypto Jobs"],
  authors: [{ name: "DevPump" }],
  creator: "DevPump",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devpump.io",
    siteName: "DevPump",
    title: "DevPump | Where Transparency and Anonymity meets Clarity",
    description: "The professional network for Solana builders. Build your reputation while staying pseudonymous.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevPump - Where Transparency and Anonymity meets Clarity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPump | Where Transparency and Anonymity meets Clarity",
    description: "The professional network for Solana builders.",
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
        <meta name="theme-color" content="#0a0a0b" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
