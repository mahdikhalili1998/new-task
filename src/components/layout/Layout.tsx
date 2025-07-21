import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutProps } from "@/types/ComponentsProps";

function Layout({ children }: LayoutProps) {
  return (
    <div dir="rtl" className="glossy-black">
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
