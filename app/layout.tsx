import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthModalProvider } from "@/components/course-marketplace/auth-modal-context";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { AdSenseScript, ConsentBanner } from "@/components/ads";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const robotoCondensed = Roboto_Condensed({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: {
    default: "LiveThrough",
    template: "LiveThrough • %s",
  },
  description: "LiveThrough - Survival Course Marketplace",
  other: {
    "google-adsense-account": "ca-pub-1437334079893020",
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
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5JF4R7RR1C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5JF4R7RR1C');
          `}
        </Script>
      </head>
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} antialiased bg-topo-overlay`}
      >
        <Toaster position="top-right" />
        <AuthProvider>
          <AuthModalProvider>
            {children}
          </AuthModalProvider>
        </AuthProvider>
        <AdSenseScript 
          clientId={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
          enabled={process.env.NODE_ENV === 'production'}
        />
        <ConsentBanner />
      </body>
    </html>
  );
}
