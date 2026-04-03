import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zamana Store - Sewing Machines & Accessories",
  description:
    "Pakistan's trusted online store for premium sewing machines, overlockers, embroidery machines, and accessories. Shop Singer, Brother, Juki, and Janome at the best prices with nationwide delivery.",
  keywords: [
    "sewing machines Pakistan",
    "overlock machines",
    "embroidery machines",
    "Singer",
    "Brother",
    "Juki",
    "Janome",
    "Zamana Store",
    "zamanastore.pk",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-geist-sans)',
            },
          }}
        />
      </body>
    </html>
  );
}
