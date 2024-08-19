"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonAddGroupProject from "@/components/Tables/ButtonAddGroupProject";
import ButtonDeleteGroupProject from "@/components/Tables/ButtonDeleteGroupProject";
import ButtonEditGroupProject from "@/components/Tables/ButtonEditGroupProject";
import TableProject from "@/components/Tables/TableProject";
import { useCookies } from "next-client-cookies";
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
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";

// export const metadata: Metadata = {
//   title: "Workspaces Page | DOTS WMS",
//   description: "This is Workspaces page for DOTS WMS",
//   // other metadata
// };

const WorkspacePage = () => {
  const cookies = useCookies();

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
          BACKEND_PORT + "workspaces/all-group-project",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setData(await response.groupproject);
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

  const handleParentFunction = () => {
    // Your logic or function here

    // Set the trigger to true to re-run the useEffect
    setTriggerApiCall(true);
  };
  
  if (isLoading) return <p>Loading...</p>;
  if (!datas || datas.length === 0)
    return (
  <>
  <h1>
    Add Group Project
  </h1>
      <ButtonAddGroupProject
        ref={childRef}
        parentFunction={handleParentFunction}
      />
  </>
    );

  

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue = Array.from(selectedOption)[0];
  return (
    <>
      <Breadcrumb
        pageName="Workspaces"
        titleName={
          datas[selectedOptionValue]?.group_project ||
          "No Group Project Selected"
        }
      />
      <div className="mb-6 flex">
        <div className="">
          <ButtonEditGroupProject
            ref={childRef}
            parentFunction={handleParentFunction}
            tableData={datas[selectedOptionValue]}
          />
        </div>
        <div className="ml-2">
          <ButtonDeleteGroupProject
            ref={childRef}
            parentFunction={handleParentFunction}
            tableData={datas[selectedOptionValue]}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="text-left">
          {/* <h1>
            <strong>Group Project :</strong>
          </h1> */}
          <ButtonGroup variant="flat">
            <Button>
              {datas[selectedOptionValue]?.group_project || "No Group Project"}
            </Button>
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
