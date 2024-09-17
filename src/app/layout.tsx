import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes'
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "tigerlake.xyz",
  description: "Personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
