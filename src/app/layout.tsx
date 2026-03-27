import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sayyam Store POS",
  description: "Point of Sale System for Sayyam Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
