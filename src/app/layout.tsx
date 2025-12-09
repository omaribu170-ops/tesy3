import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google"; // Using IBM Plex Sans Arabic as equivalent/available
import "./globals.css";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
});

export const metadata: Metadata = {
  title: "The Hub | Co-working & Entertainment",
  description: "Modern co-working space and entertainment hub management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmArabic.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
