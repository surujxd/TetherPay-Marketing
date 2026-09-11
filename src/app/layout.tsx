import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/site/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F7FA" },
    { media: "(prefers-color-scheme: dark)", color: "#070A0E" },
  ],
};

export const metadata: Metadata = {
  title: "TetherPay — Earn in USDT. Spend in INR.",
  description:
    "Deposit USDT, create an INR payment order, and have the payment fulfilled through TetherPay's verified settlement network. Pay anyone in India with stablecoin.",
  keywords: [
    "TetherPay",
    "USDT to INR",
    "USDT to UPI",
    "stablecoin payments",
    "crypto to fiat India",
    "USDT settlement",
    "TRC20 USDT",
  ],
  authors: [{ name: "TetherPay" }],
  metadataBase: new URL("https://tetherpay.fun"),
  alternates: { canonical: "https://tetherpay.fun" },
  openGraph: {
    title: "TetherPay — Earn in USDT. Spend in INR.",
    description:
      "Deposit USDT, create an INR payment order, and settle through TetherPay's verified agent network.",
    url: "https://tetherpay.fun",
    siteName: "TetherPay",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "TetherPay — Earn in USDT. Spend in INR.",
    description:
      "Deposit USDT, create an INR payment order, and settle through TetherPay's verified agent network.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster />
            <SonnerToaster richColors closeButton position="bottom-right" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
