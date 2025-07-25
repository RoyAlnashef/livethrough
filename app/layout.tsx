import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
