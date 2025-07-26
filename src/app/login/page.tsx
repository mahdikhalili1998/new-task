import LoginModal from "@/components/module/LoginModal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "spaceOMID-login page",
};

function page() {
  return <LoginModal />;
}

export default page;
