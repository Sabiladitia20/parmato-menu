import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parmato - Menu Digital Nasi Padang",
  description:
    "Menu digital restoran Parmato. Nikmati hidangan Padang autentik dengan mudah. Scan QR code untuk melihat menu dan order.",
  keywords: [
    "nasi padang",
    "parmato",
    "menu digital",
    "restoran padang",
    "rendang",
    "masakan minang",
    "qr menu",
  ],
  authors: [{ name: "Parmato Restaurant" }],
  creator: "Parmato",
  publisher: "Parmato",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://parmato-menu.vercel.app",
    siteName: "Parmato Digital Menu",
    title: "Parmato - Menu Digital Nasi Padang",
    description: "Nikmati hidangan Padang autentik. Scan QR code untuk order.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Parmato Digital Menu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parmato - Menu Digital Nasi Padang",
    description: "Nikmati hidangan Padang autentik. Scan QR code untuk order.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="antialiased font-body min-h-screen">
        {children}
      </body>
    </html>
  );
}
