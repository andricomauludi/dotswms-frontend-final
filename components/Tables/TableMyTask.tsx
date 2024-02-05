"use client";
import { COOKIE_NAME } from "@/constants";
import { Package } from "@/types/package";
import axios, { Axios } from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ButtonEditSubItem from "./ButtonEditSubItem";
import Link from "next/link";
import ShowFileProject from "./ShowFileTableProject";
import { useDisclosure } from "@nextui-org/react";
import ButtonDeleteSubItem from "./ButtonDeleteSubItem";

const TableMyTask = ({ tableData }) => {
  const childRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState([]);
  const [size, setSize] = React.useState("5xl");
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = {
          email: tableData.email,
        };
        const { data: response } = await axios.post("/api/mytask/all", payload);
        setData(await response.data.subItem);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false); // Reset the trigger after API call
    }
  }, [triggerApiCall, tableData]);

  const handleOpen = async (size: any) => {
    setSize(size);
    onOpen();
  };

  const handleParentFunction = () => {
    // Your logic or function here

    // Set the trigger to true to re-run the useEffect
    setTriggerApiCall(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!datas) return <p>No My Task Data</p>;

  return (
    <>
      {console.log(datas)}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] text-xs py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Group Project
              </th>
              <th className="min-w-[150px] text-xs py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Project
              </th>
              <th className="min-w-[150px] text-xs py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Item
              </th>
              <th className="min-w-[150px] text-xs py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Sub Item
              </th>
              <th className="min-w-[150px] text-xs py-4 px-4 font-medium text-black dark:text-white">
                Owner
              </th>
              <th className="min-w-[120px] text-xs py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[100px] py-4 px-4 text-xs font-medium text-black dark:text-white">
                Date
              </th>
              <th className="py-4 px-4 text-xs font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((packageItem, key) => (
              <>
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="text-xs font-medium text-black dark:text-white">
                      {packageItem.group_project_name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="text-xs font-medium text-black dark:text-white">
                      {packageItem.project_name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="text-xs font-medium text-black dark:text-white">
                      {packageItem.item}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="text-xs font-medium text-black dark:text-white">
                      {packageItem.subitem}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div
                      className="relative"
                      style={{
                        width: "48px",
                        height: "48px",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={`data:image/jpeg;base64,${packageItem.avatar}`}
                        layout="fill"
                        objectFit="cover"
                        style={{ margin: "auto", borderRadius: "50%" }}
                        alt="profile"
                      />
                    </div>
                    {/* <Image
                      src={`data:image/jpeg;base64,${packageItem.avatar}`}
                      alt="Brand"
                      width={48}
                      height={48}
                    /> */}
                    <p className="text-xs hidden text-black dark:text-white sm:block">
                      {packageItem.owner}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        packageItem.status === "not yet"
                          ? "text-secondary bg-secondary"
                          : packageItem.status === "on process"
                          ? "text-warning bg-warning"
                          : packageItem.status === "done"
                          ? "text-success bg-success"
                          : "text-warning bg-warning"
                      }`}
                    >
                      {packageItem.status}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-xs text-black dark:text-white">
                      {packageItem.date}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <ButtonEditSubItem
                        ref={childRef}
                        parentFunction={handleParentFunction}
                        tableData={packageItem}
                      />
                      <ButtonDeleteSubItem
                        ref={childRef}
                        parentFunction={handleParentFunction}
                        tableData={packageItem}
                      />
                    </div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableMyTask;
