import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carousel Studio",
  description: "Gerador de carrosséis com Brand Kits e IA"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
