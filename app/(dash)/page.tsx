import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import LayoutAfter from "../layout";

export const metadata: Metadata = {
  title: "DOTS-WMS",
  description: "This is Work Management System for DOTS",
  // other metadata
};

export default function Home() {
  return (
    <>
      {/* <LayoutAfter> */}
      <ECommerce />
      
      {/* </LayoutAfter> */}
    </>
  );
}
