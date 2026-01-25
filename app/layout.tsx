import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletContextProvider } from "@/providers/wallet-provider"
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})
export const metadata: Metadata = {
  title: "DevPump | Where Transparency and Anonymity meets Clarity",
  description: "The professional network for Solana builders. Showcase your work, find elite projects, and build your reputation—all while staying pseudonymous.",
  keywords: ["Solana", "Web3", "Developers", "Blockchain", "DeFi", "NFT", "Smart Contracts", "Rust", "Anchor", "Crypto Jobs"],
  openGraph: {
    title: "DevPump | The LinkedIn for Solana Builders",
    description: "Showcase your work, find elite projects, and build your reputation in the Solana ecosystem.",
    type: "website",
    locale: "en_US",
    siteName: "DevPump",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPump | The LinkedIn for Solana Builders",
    description: "Showcase your work, find elite projects, and build your reputation in the Solana ecosystem.",
  },
  robots: {
    index: true,
    follow: true,
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0b] text-white`}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
