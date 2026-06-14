import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TokyoClinic | Precision Care Clinical Dashboard",
  description:
    "Real-time clinical operations, queue management, and patient consultation tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans relative w-full">
        {/* Ambient Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-[0]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-[0]" />

        <Providers>
          <UserProvider>{children}</UserProvider>
        </Providers>
      </body>
    </html>
  );
}
