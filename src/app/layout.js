import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { authOptions } from "@/auth";
import { SessionProviderWrapper } from "./lib/SessionProviderWrapper";
import { getServerSession } from "next-auth";
import { SocketProvider } from "./context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CommerceHub - B2B Marketplace",
  description:
    "Your trusted B2B marketplace connecting buyers and sellers worldwide",
  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="keywords"
          content="B2B, marketplace, commerce, buyers, sellers, wholesale, business"
        />
        <meta name="author" content="CommerceHub" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initMap`}
        />
        <script
          type="module"
          src="https://unpkg.com/@googlemaps/extended-component-library@0.6"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper session={session}>
          <SocketProvider>{children}</SocketProvider>
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
