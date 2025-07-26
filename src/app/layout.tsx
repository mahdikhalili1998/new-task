import type { Metadata } from "next";
import "@/font/iranSans.css";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { ReduxProvider } from "@/redux/Provider";

export const metadata: Metadata = {
  title: "SpaceOMID",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ReduxProvider>
          <Layout>{children}</Layout>
        </ReduxProvider>
      </body>
    </html>
  );
}
