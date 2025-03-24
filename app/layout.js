import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { checkUser } from "@/lib/checkUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Finance Platform",
  description: "Manage your finances with AI-powered insights",
};

export default async function RootLayout({ children }) {
  await checkUser(); // Ensure user is created on sign-in

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Crafted with 💗 by Danish Abdullah</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}