import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableProject from "@/components/Tables/TableProject";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Workspaces Page | DOTS WMS",
  description: "This is Workspaces page for DOTS WMS",
  // other metadata
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Workspaces" />

      <div className="flex flex-col gap-10">
        <TableProject />
      </div>
    </>
  );
};

export default TablesPage;
