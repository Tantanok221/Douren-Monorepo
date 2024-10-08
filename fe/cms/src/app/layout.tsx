import type { Metadata } from "next";
import "./globals.css";
import {Noto_Sans_TC} from "next/font/google";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const NotoSansTS = Noto_Sans_TC({
    weight: "variable",
    subsets: ["latin"],
    variable: '--font-noto-sans-tc',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${NotoSansTS.className}`}>
        {children}
      </body>
    </html>
  );
}
