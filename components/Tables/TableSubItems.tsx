"use client";
import { COOKIE_NAME } from "@/constants";
import { Package } from "@/types/package";
import axios, { Axios } from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ButtonAddProject from "./ButtonAddProject";
import Link from "next/link";
import ShowFileProject from "./ShowFileProject";
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
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const TableSubItems = ({ tableData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState([]);
  const [size, setSize] = React.useState("5xl");
  const [isLoading, setLoading] = useState(true);
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
        setData(await response.data.tableproject);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  // if (!datas) return <p>No Project data</p>;

  return (
    <>
        {console.log(datas)}
      <tr>
        <td colSpan={14}>
          <Accordion isCompact>
            <AccordionItem
              key="2"
              aria-label="Sub Items"
              title="Sub Items"
              className=""
            >
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"></th>
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Sub Item
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Owner
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <div className="flex flex-wrap gap-3">
                  <Button
                    key={"5xl"}
                    // onPress={() => handleOpen("5xl")}
                    color="warning"
                    variant="bordered"
                  >
                    Add Item
                  </Button>
                </div>
              </table>
            </AccordionItem>
          </Accordion>
        </td>
      </tr>
    </>
  );
};

export default TableSubItems;
