import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folkline CRM",
  description: "A simple, open-source CRM for modern sales teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
