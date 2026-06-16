import type { Metadata } from "next";

import { AuthProvider } from "@/providers/auth-provider";
import { getAppUrl, getProductName, getProductTagline } from "@/lib/config/product";

import "./globals.css";

const productName = getProductName();

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: productName,
    template: `%s · ${productName}`,
  },
  description: getProductTagline(),
  robots: {
    index: false,
    follow: false,
  },
  applicationName: productName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
