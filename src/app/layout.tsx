import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/components/Providers/TanstackProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/components/Providers/Theme-Provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digievent",
  description: "Every event is an adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
