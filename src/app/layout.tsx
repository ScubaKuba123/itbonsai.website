import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BonsAI City",
  description: "BonsAI City — your business, growing as a living visual world.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
