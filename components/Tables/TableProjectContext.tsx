"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useCookies } from "next-client-cookies";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import axios from "axios";

type TableProject = any; // Bisa diganti interface nyata

interface TableProjectsContextType {
  tableProjects: TableProject[];
  fetchTableProjects: (tableId: string) => void;
}

const TableProjectsContext = createContext<TableProjectsContextType | undefined>(undefined);

export const TableProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tableProjects, setTableProjects] = useState<TableProject[]>([]);
  const cookies = useCookies();

  const fetchTableProjects = async (tableId: string) => {
    try {
      const { data } = await axios.get(`${BACKEND_PORT}workspaces/all-table-project/${tableId}`, {
        headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
      });
      setTableProjects(data.tableproject || []);
    } catch (err) {
      console.error("Error fetching table projects:", err);
    }
  };

  useEffect(() => {
    // 🧩 Listener global untuk semua updates
    const handleTableProjectData = (payload: any) => {
      setTableProjects(payload.tableproject);
    };

    const handleNewTableProject = (payload: any) => {
      setTableProjects((prev) => {
        const exists = prev.some((p) => p._id === payload.newTableProject._id);
        return exists ? prev : [...prev, payload.newTableProject];
      });
    };

    const handleTableProjectEdited = (payload: any) => {
      setTableProjects((prev) =>
        prev.map((p) => (p._id === payload.updatedProject._id ? payload.updatedProject : p))
      );
    };

    const handleTableProjectDeleted = (payload: any) => {
      setTableProjects((prev) =>
        prev.filter((p) => p._id !== payload.deletedProject._id)
      );
    };

    socket.on("tableProjectData", handleTableProjectData);
    socket.on("newTableProject", handleNewTableProject);
    socket.on("tableProjectEdited", handleTableProjectEdited);
    socket.on("tableProjectDeleted", handleTableProjectDeleted);

    return () => {
      socket.off("tableProjectData", handleTableProjectData);
      socket.off("newTableProject", handleNewTableProject);
      socket.off("tableProjectEdited", handleTableProjectEdited);
      socket.off("tableProjectDeleted", handleTableProjectDeleted);
    };
  }, []);

  return (
    <TableProjectsContext.Provider value={{ tableProjects, fetchTableProjects }}>
      {children}
    </TableProjectsContext.Provider>
  );
};

// ✅ Hook untuk mudah pakai
export const useTableProjects = () => {
  const context = useContext(TableProjectsContext);
  if (!context) throw new Error("useTableProjects must be used within TableProjectsProvider");
  return context;
};

export default TableProjectsContext