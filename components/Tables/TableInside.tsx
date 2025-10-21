"use client";
import axios, { Axios } from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ButtonAddProject from "./ButtonAddTableProject";
import ButtonEditTableProject from "./ButtonEditTableProject";
import ButtonDeleteProject from "./ButtonDeleteTableProject";
import Link from "next/link";
import ShowContentTextTableProject from "./ShowContentTextTableProject";
import { useDisclosure } from "@nextui-org/react";
import TableSubItems from "./TableSubItems";
import ShowContentTableProject from "./ShowContentPosting";
import ButtonEditProject from "./ButtonEditProject";
import ShowPostingCaptionTableProject from "./ShowPostingCaptionTableProject";
import { useCookies } from "next-client-cookies";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import ShowContentPosting from "./ShowContentPosting";
import ContentPostingList from "./ContentPostingList";
import { socket } from "@/lib/socket"; // ✅ gunakan socket global

const TableInside = ({ tableData }) => {
  const cookies = useCookies();
  const childRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);

  // ✅ Fetch awal
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_PORT}workspaces/all-table-project/${tableData._id}`,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
        }
      );
      setData(data.tableproject || []);
    } catch (err: any) {
      console.error("Error fetching table projects:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tableData?._id) return;

    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false);
    }

    // ✅ Listener realtime global, tapi filter per project
    const handleNewTableProject = (payload) => {
      if (payload.projectId !== tableData._id) return; // ⛔ skip project lain
      setData((prev) => {
        const exists = prev.some((p) => p._id === payload.newTableProject._id);
        return exists ? prev : [...prev, payload.newTableProject];
      });
      console.log("🟢 New table added for project:", payload.projectId);
    };

    const handleTableProjectEdited = ({ projectId, updatedProject }) => {
      if (projectId !== tableData._id) return;
      setData((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      console.log("🟠 Table edited:", updatedProject._id);
    };

    const handleTableProjectDeleted = ({ projectId, deletedProject }) => {
      if (projectId !== tableData._id) return;
      setData((prev) => prev.filter((p) => p._id !== deletedProject._id));
      console.log("🔴 Table deleted:", deletedProject._id);
    };

    // 🔗 Pasang listener global
    socket.on("newTableProject", handleNewTableProject);
    socket.on("tableProjectEdited", handleTableProjectEdited);
    socket.on("tableProjectDeleted", handleTableProjectDeleted);

    // ✅ Debug: lihat semua event masuk
    socket.onAny((event, data) => console.log("📡 Received:", event, data));

    // 🧹 Cleanup
    return () => {
      socket.off("newTableProject", handleNewTableProject);
      socket.off("tableProjectEdited", handleTableProjectEdited);
      socket.off("tableProjectDeleted", handleTableProjectDeleted);
    };
  }, [tableData._id, triggerApiCall]);

  const handleParentFunction = () => setTriggerApiCall(true);

  if (isLoading) return <p>Loading...</p>;
  if (!datas) return <p>No Project data</p>;

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <ButtonAddProject
            ref={childRef}
            parentFunction={handleParentFunction}
            tableData={tableData}
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full sm:table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-2 px-2 text-xs text-black dark:text-white xl:pl-4">
                  {/* <th className="py-4 px-4 text-xs text-black dark:text-white xl:pl-11"> */}
                  Item
                </th>
                <th className=" py-2 px-2 text-xs text-black dark:text-white">
                  Posting Schedule
                </th>
                <th className=" py-2 px-2 text-xs text-black dark:text-white">
                  Posting Time
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Lead
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Content Category
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Content Text Link
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Content Text
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Content Posting
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Posting Caption
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Posting Status
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Last Updated
                </th>
                <th className="py-2 px-2 text-xs text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.map((packageItem: any, key) => (
                <React.Fragment key={packageItem._id || key}>
                  <tr key={packageItem._id}>
                    <td className="border-b border-[#eee] py-3 px-2 pl-5 dark:border-strokedark xl:pl-5">
                      <h5 className="text-xs text-black dark:text-white">
                        {packageItem.item}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <p className="text-black dark:text-white text-xs">
                        {packageItem.postingschedule}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <p className="text-black dark:text-white text-xs">
                        {packageItem.postingtime}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      {/* <div
                        className="relative"
                        style={{
                          width: "48px",
                          height: "48px",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={`data:image/jpeg;base64,${packageItem.lead_avatar}`}
                          layout="fill"
                          objectFit="cover"
                          style={{ margin: "auto", borderRadius: "50%" }}
                          alt="profile"
                        />
                      </div>                      */}
                      <p className="hidden text-black dark:text-white sm:block text-xs">
                        {packageItem.lead_name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs text-xs ${
                          packageItem.contentcategory === "reels"
                            ? "text-primary bg-primary"
                            : packageItem.contentcategory === "tiktok"
                            ? "text-secondary bg-secondary"
                            : packageItem.contentcategory === "photo"
                            ? "text-warning bg-warning"
                            : packageItem.contentcategory === "design"
                            ? "text-danger bg-danger"
                            : packageItem.contentcategory === "youtubevideo"
                            ? "text-success bg-success"
                            : "text-warning bg-warning"
                        }`}
                      >
                        {packageItem.contentcategory}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <p className="text-black dark:text-white text-xs">
                        <Link
                          href={`${packageItem.contenttextlink}`}
                          className="flex items-center gap-3.5 text-xs text-xs duration-300 ease-in-out hover:text-primary lg:text-xs"
                          // className="flex items-center gap-3.5 text-xs text-xs duration-300 ease-in-out hover:text-primary lg:text-base"
                          target="_blank"
                        >
                          {packageItem.contenttextlink}
                        </Link>
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <ShowContentTextTableProject tableData={packageItem} />
                    </td>

                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <div className="flex-shrink-0">
                        <ContentPostingList contentPostingItem={packageItem} />
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <div className="text-black dark:text-white text-xs">
                        <ShowPostingCaptionTableProject
                          tableData={packageItem}
                        />
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs text-xs ${
                          packageItem.postingstatus === "not yet"
                            ? "text-primary bg-primary"
                            : packageItem.postingstatus === "on preview"
                            ? "text-warning bg-warning"
                            : packageItem.postingstatus === "on hold"
                            ? "text-danger bg-danger"
                            : packageItem.postingstatus === "posted"
                            ? "text-success bg-success"
                            : "text-warning bg-warning"
                        }`}
                      >
                        {packageItem.postingstatus}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      {/* <div
                        className="relative"
                        style={{
                          width: "48px",
                          height: "48px",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={`data:image/jpeg;base64,${packageItem.updated_by_avatar}`}
                          layout="fill"
                          objectFit="cover"
                          style={{ margin: "auto", borderRadius: "50%" }}
                          alt="profile"
                        />
                      </div> */}

                      <p className="hidden text-black dark:text-white sm:block text-xs">
                        {packageItem.updated_by}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <ButtonEditTableProject
                          ref={childRef}
                          parentFunction={handleParentFunction}
                          tableData={packageItem}
                        />
                        <ButtonDeleteProject
                          ref={childRef}
                          parentFunction={handleParentFunction}
                          tableData={packageItem}
                        />
                      </div>
                    </td>
                  </tr>
                  <TableSubItems tableData={packageItem} />
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableInside;
