"use client";
import axios, { Axios } from "axios";
import React, { useEffect, useRef, useState } from "react";
import ButtonAddProject from "./ButtonAddProject";
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import TableInside from "./TableInside";
import ButtonEditProject from "./ButtonEditProject";
import ButtonDeleteProject from "./ButtonDeleteProject";

const TableProject = ({ tableData }) => {
  const childRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState([]);
  const [dataproject, setDataProject] = useState([]);
  const [size, setSize] = React.useState("5xl");
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);

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
      const payload = {
        _id: tableData._id,
      };
      try {
        const { data: response } = await axios.post(
          "/api/workspaces/all-project",
          payload
        );
        setDataProject(await response.data.groupproject);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false); // Reset the trigger after API call
    }
    fetchData();
  }, [triggerApiCall, tableData]);

  const handleParentFunction = () => {
    // Your logic or function here

    // Set the trigger to true to re-run the useEffect
    setTriggerApiCall(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!datas) return <p>No Project data</p>;

  return (
    <>
      <ButtonAddProject
        ref={childRef}
        parentFunction={handleParentFunction}
        tableData={tableData}
      />
      <Accordion variant="splitted">
        {dataproject.map((Item, key) => (
          <AccordionItem
            key={key}
            aria-label={Item.project_name}
            title={Item.project_name}
            className={`${Item.color_project}`}
          >
            <ButtonEditProject
              ref={childRef}
              parentFunction={handleParentFunction}
              tableData={Item}
            />
            <ButtonDeleteProject
              ref={childRef}
              parentFunction={handleParentFunction}
              tableData={Item}
            />
            <TableInside tableData={Item} />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default TableProject;
