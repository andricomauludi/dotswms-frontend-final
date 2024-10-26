"use client";
import axios, { Axios, AxiosError } from "axios";
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
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import { io } from 'socket.io-client';


const TableProject = ({ tableData }) => {
  const socket = io(BACKEND_PORT); // Connect to the Socket.IO serve
  const childRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datas, setData] = useState([]);
  const [dataproject, setDataProject] = useState([]);
  const [size, setSize] = React.useState("5xl");
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);
  const cookies = useCookies();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          BACKEND_PORT + "workspaces/get-project-specific/" + tableData._id,
          {
            headers: {
              Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setDataProject(data.groupproject);
      } catch (e) {
        console.log(e.message);
      }
      setLoading(false);
    };
  
    fetchData();

    // Listen for real-time data updates
    socket.on('groupProjectData', (newData) => {
      setDataProject(newData);      

    });    
    socket.on('newProject', (newProject) => {
      setDataProject((prevData) => [...prevData, newProject]);
    });
    socket.on('projectDeleted', (deletedProject) => {
      setDataProject((prevData) =>
        prevData.filter((project) => project._id !== deletedProject.projectId)
      );    
    });
    // Listen for project edits
  socket.on('projectEdited', (updatedProject) => {
    setDataProject((prevData) =>
      prevData.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      )
    );   
  });
  
    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false); // Reset the trigger after API call
    }
    return () => {
      socket.off('groupProjectData');      
      socket.off('newProject');
      socket.off('projectDeleted');
      socket.off('projectEdited');
    };
  }, [tableData]);

  const handleParentFunction = () => {
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
      <Accordion variant="splitted" 
      // selectionMode="multiple"
      >
        {dataproject.map((Item, key) => (
          <AccordionItem
            key={key}
            aria-label={Item.project_name}
            title={Item.project_name}
            className={`${Item.color_project}`}
          >
            <div className="mb-6 flex place-content-end mr-2">
              <div className="">
                <ButtonEditProject
                  ref={childRef}
                  parentFunction={handleParentFunction}
                  tableData={Item}
                />
              </div>
              <div className="ml-2">
                <ButtonDeleteProject
                  ref={childRef}
                  parentFunction={handleParentFunction}
                  tableData={Item}
                />
              </div>
            </div>
            <TableInside tableData={Item} />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default TableProject;
