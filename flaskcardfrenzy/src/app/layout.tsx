import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FuturisticNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import type { Session } from "@supabase/supabase-js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlashCard Frenzy Multiplayer",
  description: "Quizzing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSession: Session | null = null; 

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider >
          <FuturisticNavbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
