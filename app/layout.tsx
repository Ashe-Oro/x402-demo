import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 Demo",
  description: "HTTP-native payments with x402",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
