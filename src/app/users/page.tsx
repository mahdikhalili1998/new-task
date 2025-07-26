import UsersPage from "@/components/template/UserPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "spaceOMID-user list",
};

function page() {
  return <UsersPage />;
}

export default page;
