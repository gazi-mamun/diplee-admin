import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context.js";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://admin.diplee.com"),
  title: {
    default: "Diplee | Admin",
    template: `%s | Diplee`,
  },
  description:
    "Diplee is a premium quality men's clothing brand. We offered you original & top premium collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <html lang="en">
        <body
          className={cn(
            "relative h-full font-sans antialiased",
            inter.className
          )}
        >
          <main className="relative flex flex-col min-h-screen max-h-screen">
            <Navbar />
            <div className="flex-1 flex-grow">{children}</div>
            <Toaster />
          </main>
        </body>
      </html>
    </AppProvider>
  );
}
