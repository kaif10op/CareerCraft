import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carrier Craft | Create Professional Resumes",
  description:
    "Build stunning, ATS-optimized resumes in seconds using AI. Free, professional, and easy to use.",
  keywords: ["resume builder", "Carrier Craft", "professional resume", "ATS-friendly"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gray-950 text-white print:min-h-0 print:bg-white print:text-black`}
        style={{
          fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <Navbar />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
