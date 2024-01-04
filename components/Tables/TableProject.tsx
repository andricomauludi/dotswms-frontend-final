"use client";
import { COOKIE_NAME } from "@/constants";
import { Package } from "@/types/package";
import axios, { Axios } from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ButtonAddProject from "./ButtonAddTableProject";
import Link from "next/link";
import ShowFileProject from "./ShowFileTableProject";
import {
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TableInside from "./TableInside";

const TableProject = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState([]);
  const [dataproject, setDataProject] = useState([]);
  const [size, setSize] = React.useState("5xl");
  const [isLoading, setLoading] = useState(true);
  const handleOpen = async (size: any) => {
    setSize(size);
    onOpen();
  };
  const handleOpen2 = async (size: any) => {
    setSize(size);
    onOpen();
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "/api/workspaces/all-project"
        );
        setDataProject(await response.data.project);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!datas) return <p>No Project data</p>;

  return (
    <>
      <Accordion variant="splitted">
        {dataproject.map((Item, key) => (
          <AccordionItem
            key={key}
            aria-label={Item.project_name}
            title={Item.project_name}
            className={Item.color_project}
          >
            <TableInside tableData={Item} />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default TableProject;
