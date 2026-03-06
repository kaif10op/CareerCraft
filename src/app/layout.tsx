import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Builder | Create Professional Resumes with AI",
  description:
    "Build stunning, ATS-optimized resumes in seconds using AI. Free, professional, and easy to use.",
  keywords: ["resume builder", "AI resume", "professional resume", "ATS-friendly"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
