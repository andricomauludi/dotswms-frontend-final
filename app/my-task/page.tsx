"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableMyTask from "@/components/Tables/TableMyTask";
import TableMyTaskDone from "@/components/Tables/TableMyTaskDone";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import axios from "axios";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
export const metadata: Metadata = {
  title: "My Task Page | DOTS WMS",
  description: "This is My Task page for DOTS WMS",
  // other metadata
};

const MyTaskPage = () => {
  const [datas, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [selectedOption, setSelectedOption] = React.useState(new Set([0]));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get("/api/users/me");
        setData(await response.data.user);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!datas) return <p>No profile data</p>;

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue = Array.from(selectedOption)[0];
  return (
    <>
      <Breadcrumb pageName="My Task" />

      <h1>On Going My Task</h1>
      <div className="flex flex-col gap-10">
        <TableMyTask tableData={datas} />
      <h1>My Task (Done)</h1>
        <TableMyTaskDone tableData={datas} />
      </div>
    </>
  );
};

export default MyTaskPage;
