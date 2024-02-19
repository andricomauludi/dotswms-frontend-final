"use client";
import { COOKIE_NAME } from "@/constants";
import { Package } from "@/types/package";
import axios, { Axios } from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ButtonEditSubItem from "./ButtonEditSubItem";
import Link from "next/link";
import ShowFileProject from "./ShowContentTextTableProject";
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import {
  faArrowAltCircleDown,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ButtonAddSubItem from "./ButtonAddSubItem";
import ButtonDeleteSubItem from "./ButtonDeleteSubItem";

const TableSubItems = ({ tableData }) => {
  const childRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState([]);
  const [size, setSize] = React.useState("5xl");
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);

  const handleOpen = async (size: any) => {
    setSize(size);
    onOpen();
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = {
          _id: tableData,
        };
        const { data: response } = await axios.post(
          "/api/workspaces/tablesubitems",
          payload
        );
        // const { data: response } = await axios.get(
        //   "/api/workspaces/tableproject"
        // );
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

  const handleParentFunction = () => {
    // Your logic or function here

    // Set the trigger to true to re-run the useEffect
    setTriggerApiCall(true);
  };

  if (isLoading) return <p>Loading...</p>;
  // if (!datas) return <p>No Project data</p>;

  return (
    <>
      <tr>
        <td colSpan={13}>
          <Accordion isCompact>
            <AccordionItem
              key="2"
              aria-label="Sub Items"
              startContent={<FontAwesomeIcon icon={faArrowAltCircleDown} />}
              className="bg-gray-2 text-left dark:bg-meta-4"
            >
              <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div
                  className="flex flex-wrap gap-3"
                  style={{ marginTop: "10px", marginBottom: "20px" }}
                >
                  <ButtonAddSubItem
                    ref={childRef}
                    parentFunction={handleParentFunction}
                    tableData={tableData}
                  />
                </div>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[220px] py-4 px-4 text-xs text-black dark:text-white xl:pl-11">
                        {/* <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"> */}
                        Sub Item
                      </th>
                      <th className="min-w-[150px] py-4 px-4 text-xs text-black dark:text-white">
                        {/* <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"> */}
                        Owner
                      </th>
                      {/* <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white"> */}
                      <th className="min-w-[120px] py-4 px-4 text-xs text-black dark:text-white">
                        Status
                      </th>
                      <th className="py-4 px-4 text-xs text-black dark:text-white">
                        Date
                      </th>
                      <th className="py-4 px-4 text-xs text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {datas.map((packageItem, key) => (
                      <>
                        <tr key={key}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white text-xs">
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
                            <p className="hidden text-black dark:text-white sm:block text-xs">
                              {packageItem.owner}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p
                              className={`inline-flex rounded-full bg-opacity-10 py-1 px-3  text-xs font-medium ${
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
                            <p className="text-black dark:text-white text-xs">
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
            </AccordionItem>
          </Accordion>
        </td>
      </tr>
    </>
  );
};

export default TableSubItems;
