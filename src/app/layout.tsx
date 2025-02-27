import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "src/components/ui/sonner";
import { cn } from "src/lib/utils";
import "./globals.css";
import TanstackProvider from "src/providers/tanstack-provider";
import { ThemeProvider } from "src/providers/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Scanwich",
  description: "The best dining solution in the world!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-background font-sans antialiased", fontSans.variable)}>
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            {children}
            <Toaster
              gap={12}
              icons={{ success: <CircleCheck /> }}
              richColors
              closeButton
            />
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
