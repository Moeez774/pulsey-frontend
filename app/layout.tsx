'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/AuthProvider";
import { SessionProvider } from "next-auth/react";
import SuggestionProvider from "@/context/SuggestionProvider";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <html lang="en" className={inter.variable}>
      <meta name="google-site-verification" content="jAzGWfAtTh1Snk5wC1N37_Coh1Y4OQaUw5XMLT42o-o" />
      <body>
        <SessionProvider>
          <Toaster position="top-center" />
          <AuthProvider>
            <SuggestionProvider>
              <div className="flex flex-col min-h-screen">
                <div className="sticky h-0 w-full max-w-7xl mx-auto top-0 z-50">
                  <Header />
                </div>

                <main className="flex-grow">{children}</main>

                {!isDashboard && <Footer />}
              </div>
            </SuggestionProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
