import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Titouan | Futuristic Portfolio",
  description: "Advanced futuristic portfolio with 3D integration and high performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
