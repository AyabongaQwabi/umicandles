import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://umicandles.qwabi.co.za"),
  title: {
    default: "Umi Candles | Handcrafted Candles Ecommerce Website",
    template: "%s | Umi Candles",
  },
  description: "Umi Candles sells handcrafted luxury candles, personalised gifts, and event candles for special South African moments.",
  keywords: [
    "Umi Candles",
    "handcrafted candles South Africa",
    "luxury candles",
    "personalised candles",
    "event candles"
],
  authors: [{ name: "Umi Candles" }],
  creator: "Umi Candles",
  publisher: "Umi Candles",
  alternates: {
    canonical: "https://umicandles.qwabi.co.za",
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: "https://umicandles.qwabi.co.za",
    siteName: "Umi Candles",
    title: "Umi Candles | Handcrafted Candles Ecommerce Website",
    description: "Umi Candles sells handcrafted luxury candles, personalised gifts, and event candles for special South African moments.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Umi Candles social preview",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Umi Candles",
    description: "Umi Candles sells handcrafted luxury candles, personalised gifts, and event candles for special South African moments.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({


  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-ZA" suppressHydrationWarning><body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
