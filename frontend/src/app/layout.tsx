import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Load the softer Nunito font
const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Medical Scribe | Enterprise Triage",
  description: "Agentic clinical extraction and structuring tool built with Next.js and Node.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the new font globally */}
      <body className={`${nunito.className} antialiased bg-slate-900 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}