import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airhead",
  description: "From London Gatwick - the airport for everyone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.className} ${montserrat.className}`} style={{ "--font-montserrat": montserrat.style.fontFamily } as React.CSSProperties}>
      <body className={`${openSans.className} font-sans`}>{children}</body>
    </html>
  );
}
