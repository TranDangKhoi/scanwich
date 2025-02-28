import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter as FontSans } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "src/components/ui/sonner";
import { cn } from "src/lib/utils";
import AuthProvider from "src/providers/auth-provider";
import TanstackProvider from "src/providers/tanstack-provider";
import "./globals.css";

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
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value as string;
  const refreshToken = cookieStore.get("refreshToken")?.value as string;
  return (
    <html lang="en">
      <body className={cn("bg-background font-sans antialiased", fontSans.variable)}>
        <AuthProvider
          initialAccessToken={accessToken}
          initialRefreshToken={refreshToken}
        >
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
        </AuthProvider>
      </body>
    </html>
  );
}
