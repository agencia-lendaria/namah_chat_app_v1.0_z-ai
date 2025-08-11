import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assistente de Desenvolvimento Pessoal",
  description: "Um assistente de IA para conversas sobre autoestima, inteligência emocional, prosperidade e relacionamentos.",
  keywords: ["desenvolvimento pessoal", "autoestima", "inteligência emocional", "prosperidade", "relacionamentos", "assistente de IA"],
  authors: [{ name: "Assistente de Desenvolvimento Pessoal" }],
  openGraph: {
    title: "Assistente de Desenvolvimento Pessoal",
    description: "Converse com um assistente de IA sobre desenvolvimento pessoal e bem-estar emocional",
    url: "https://chat.z.ai",
    siteName: "Assistente de Desenvolvimento Pessoal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assistente de Desenvolvimento Pessoal",
    description: "Converse com um assistente de IA sobre desenvolvimento pessoal e bem-estar emocional",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
