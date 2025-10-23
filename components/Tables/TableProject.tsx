"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ButtonAddProject from "./ButtonAddProject";
import { Accordion, AccordionItem, useDisclosure } from "@nextui-org/react";
import TableInside from "./TableInside";
import ButtonEditProject from "./ButtonEditProject";
import ButtonDeleteProject from "./ButtonDeleteProject";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import { socket } from "@/lib/socket";

const TableProject = ({ tableData }) => {
  const childRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataproject, setDataProject] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);
  const cookies = useCookies();

  // Reset data setiap ganti group project
  useEffect(() => {
    setDataProject([]);
    setTriggerApiCall(true);
  }, [tableData._id]);

  useEffect(() => {
    if (!tableData._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${BACKEND_PORT}workspaces/get-project-specific/${tableData._id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`,
            },
          }
        );
        setDataProject(data.groupproject);
      } catch (e) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false);
    }

    const handleNewProject = (newProject) => {
      setDataProject((prev) => {
        const exists = prev.some((p) => p._id === newProject._id);
        return exists ? prev : [...prev, newProject];
      });
    };

    const handleProjectDeleted = (deletedProject) => {
      setDataProject((prev) =>
        prev.filter((p) => p._id !== deletedProject.projectId)
      );
    };

    const handleProjectEdited = (updatedProject) => {
      setDataProject((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
    };

    socket.emit("joinGroupProject", tableData._id);
    console.log(`🟢 Joined room: ${tableData._id}`);

    socket.on("newProject", handleNewProject);
    socket.on("projectDeleted", handleProjectDeleted);
    socket.on("projectEdited", handleProjectEdited);

    return () => {
      socket.emit("leaveGroupProject", tableData._id);
      console.log(`🔴 Left room: ${tableData._id}`);
      socket.off("newProject", handleNewProject);
      socket.off("projectDeleted", handleProjectDeleted);
      socket.off("projectEdited", handleProjectEdited);
    };
  }, [tableData._id, triggerApiCall]);

  const handleParentFunction = () => setTriggerApiCall(true);

  if (isLoading) return <p>Loading...</p>;
  if (!dataproject) return <p>No Project data</p>;

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
            <div className="mb-6 flex justify-end mr-2">
              <ButtonEditProject
                ref={childRef}
                parentFunction={handleParentFunction}
                tableData={Item}
              />
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
