"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonAddGroupProject from "@/components/Tables/ButtonAddGroupProject";
import ButtonAddProject from "@/components/Tables/ButtonAddSubItem";
import ButtonDeleteGroupProject from "@/components/Tables/ButtonDeleteGroupProject";
import ButtonEditGroupProject from "@/components/Tables/ButtonEditGroupProject";
import TableProject from "@/components/Tables/TableProject";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
export const metadata: Metadata = {
  title: "Workspaces Page | DOTS WMS",
  description: "This is Workspaces page for DOTS WMS",
  // other metadata
};

const WorkspacePage = () => {
  const childRef = useRef(null);
  const [datas, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);

  const [selectedOption, setSelectedOption] = React.useState(new Set([0]));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          "/api/workspaces/group-project"
        );
        setData(await response.data.groupproject);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false); // Reset the trigger after API call
    }
  }, [triggerApiCall]);

  if (isLoading) return <p>Loading...</p>;
  if (!datas) return <p>No profile data</p>;

  const handleParentFunction = () => {
    // Your logic or function here

    // Set the trigger to true to re-run the useEffect
    setTriggerApiCall(true);
  };

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue = Array.from(selectedOption)[0];
  return (
    <>
      <Breadcrumb
        pageName="Workspaces"
        titleName={datas[selectedOptionValue].group_project}
      />
      <ButtonEditGroupProject
        ref={childRef}
        parentFunction={handleParentFunction}
        tableData={datas[selectedOptionValue]}
      />
      <ButtonDeleteGroupProject
        ref={childRef}
        parentFunction={handleParentFunction}
        tableData={datas[selectedOptionValue]}
      />
      <div className="flex flex-col gap-5">
        <div className="text-left">
          {/* <h1>
            <strong>Group Project :</strong>
          </h1> */}
          <ButtonGroup variant="flat">
            <Button>{datas[selectedOptionValue].group_project}</Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly>
                  <svg
                    fill="none"
                    height="14"
                    viewBox="0 0 24 24"
                    width="14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                      fill="currentColor"
                    />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                selectedKeys={selectedOption}
                selectionMode="single"
                onSelectionChange={setSelectedOption}
                className="max-w-[300px]"
              >
                {datas.map((item, key) => (
                  <DropdownItem key={key} description={item.description}>
                    {item.group_project}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <ButtonAddGroupProject
              ref={childRef}
              parentFunction={handleParentFunction}
            />
          </ButtonGroup>
        </div>
        <TableProject tableData={datas[selectedOptionValue]} />
      </div>
    </>
  );
};

export default WorkspacePage;
